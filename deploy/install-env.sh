#!/bin/bash
# Writes the three env files of the site from the credential store (plan sablia-io-lot0-vps, F3).
#
#     sudo bash deploy/install-env.sh
#
#   /etc/sablia-site/build.env    640 root:sablia-site  VITE_SUPABASE_ANON_KEY (public by design; the build needs it)
#   /etc/sablia-site/prod.env     600 root:root         PORT=5000, RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY
#   /etc/sablia-site/preview.env  600 root:root         PORT=5001, same two secrets
#
# prod.env / preview.env are read by systemd (PID 1) only: the site user cannot read them, and the
# deploy user never needs them (its smoke test runs the candidate WITHOUT secrets). Exactly three key
# paths are read, none listed: resend.api_key (the SEND-ONLY key; api_key_full is never used),
# supabase.sablia.service_role, supabase.sablia.anon_key. A missing path stops the script before it
# writes anything and names the path, never a value. Re-run to rotate.
# Test seams: CONF_DIR CREDS_FILE ENV_ROOT_USER ENV_RUN_GROUP ANON_KEY_FILE.
set -euo pipefail

CONF_DIR="${CONF_DIR:-/etc/sablia-site}"
CREDS_FILE="${CREDS_FILE:-/home/sablia/workspace/.credentials/sablia.json}"
ROOT_USER="${ENV_ROOT_USER:-root}"
RUN_GROUP="${ENV_RUN_GROUP:-sablia-site}"
ANON_KEY_FILE="${ANON_KEY_FILE:-}"

exec python3 - "$CONF_DIR" "$CREDS_FILE" "$ROOT_USER" "$RUN_GROUP" "$ANON_KEY_FILE" <<'PY'
import grp, json, os, pwd, sys

conf, creds_path, root_user, run_group, anon_file = sys.argv[1:6]
PATHS = {
    "RESEND_API_KEY": ("resend", "api_key"),
    "SUPABASE_SERVICE_ROLE_KEY": ("supabase", "sablia", "service_role"),
    "VITE_SUPABASE_ANON_KEY": ("supabase", "sablia", "anon_key"),
}
try:
    store = json.load(open(creds_path))
except (OSError, ValueError):
    sys.exit(f"cannot read the credential store at {creds_path}")

values, missing = {}, []
for name, path in PATHS.items():
    node = store
    for part in path:
        node = node.get(part) if isinstance(node, dict) else None
    if isinstance(node, str) and node:
        values[name] = node
    else:
        missing.append((name, ".".join(path)))
if "VITE_SUPABASE_ANON_KEY" in dict(missing) and anon_file:
    for line in open(anon_file):
        if line.startswith("VITE_SUPABASE_ANON_KEY=") and len(line.strip()) > 23:
            values["VITE_SUPABASE_ANON_KEY"] = line.strip().split("=", 1)[1]
            missing = [m for m in missing if m[0] != "VITE_SUPABASE_ANON_KEY"]
if missing:
    for _, dotted in missing:
        print(f"missing credential path: {dotted}", file=sys.stderr)
    sys.exit(1)
print("read: " + ", ".join(".".join(p) for p in PATHS.values()))

root_uid = pwd.getpwnam(root_user).pw_uid
run_gid = grp.getgrnam(run_group).gr_gid
os.makedirs(conf, mode=0o750, exist_ok=True)
try:
    os.chown(conf, root_uid, run_gid)
    os.chmod(conf, 0o750)
except PermissionError:
    pass

def write(name, mode, gid, items):
    tmp = os.path.join(conf, f".{name}.tmp")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        f.write("".join(f"{k}={v}\n" for k, v in items))
    os.chmod(tmp, mode)
    os.chown(tmp, root_uid, gid)
    os.replace(tmp, os.path.join(conf, name))
    print(f"wrote {conf}/{name} ({oct(mode)[2:]}): " + ", ".join(k for k, _ in items))

secrets = [("RESEND_API_KEY", values["RESEND_API_KEY"]), ("SUPABASE_SERVICE_ROLE_KEY", values["SUPABASE_SERVICE_ROLE_KEY"])]
write("build.env", 0o640, run_gid, [("VITE_SUPABASE_ANON_KEY", values["VITE_SUPABASE_ANON_KEY"])])
write("prod.env", 0o600, os.getgid() if root_user != "root" else 0, [("PORT", "5000")] + secrets)
write("preview.env", 0o600, os.getgid() if root_user != "root" else 0, [("PORT", "5001")] + secrets)
PY
