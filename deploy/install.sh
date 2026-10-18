#!/bin/bash
# System wiring of the sablia-site host chain (plan sablia-io-lot0-vps, F2). Run as root, idempotent:
#
#     sudo bash deploy/install.sh [--prod-ref REF] [--preview-ref REF] [--enable-instances]
#
# Does:   the unprivileged user `sablia-site`; /opt/sablia/sites/sablia-site (its tree); /etc/sablia-site
#         (root:sablia-site 750) with deploy.sh (root-owned: the deploy user can run it, not change it),
#         the two ref files and deploy.env (INDEXNOW_ENABLED=0); the three systemd units; the polkit
#         rule that lets the deploy user restart exactly sablia-site@prod and sablia-site@preview.
# Does NOT: touch Caddy, the DNS, or the secrets (deploy/install-env.sh writes those), and does not
#         start the timer until the env files exist. A build NEVER runs as root: deploy.sh refuses.
# After:  sudo bash deploy/install-env.sh ; sudo systemctl enable --now sablia-site-deploy.timer
#         (or `systemctl start sablia-site-deploy.service` for a first immediate build).
#         --enable-instances (later, once a slot has a release) enables sablia-site@prod|preview at boot.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SITE_ROOT="${SITE_ROOT:-/opt/sablia/sites/sablia-site}"
CONF_DIR="${CONF_DIR:-/etc/sablia-site}"
UNIT_DIR="${UNIT_DIR:-/etc/systemd/system}"
POLKIT_DIR="${POLKIT_DIR:-/etc/polkit-1/rules.d}"
PROD_REF=main
PREVIEW_REF=main
ENABLE_INSTANCES=0

while [ $# -gt 0 ]; do
  case "$1" in
    --prod-ref) PROD_REF="$2"; shift 2;;
    --preview-ref) PREVIEW_REF="$2"; shift 2;;
    --enable-instances) ENABLE_INSTANCES=1; shift;;
    *) echo "unknown option $1" >&2; exit 2;;
  esac
done
[ "$(id -u)" = 0 ] || { echo "run as root: sudo bash $0" >&2; exit 1; }
for ref in "$PROD_REF" "$PREVIEW_REF"; do
  case "$ref" in ""|*[!A-Za-z0-9._/-]*|*..*) echo "refusing ref '$ref'" >&2; exit 2;; esac
done

echo "==> 1/6 user sablia-site"
if ! id sablia-site >/dev/null 2>&1; then
  useradd --system --home-dir "$SITE_ROOT" --no-create-home --shell /usr/sbin/nologin sablia-site
  echo "    created"
else
  echo "    exists"
fi

echo "==> 2/6 directories"
install -d -o sablia-site -g sablia-site -m 0755 "$SITE_ROOT" "$SITE_ROOT/home"
# trigger files (scripts/site-redeploy.py, run by the human user `sablia`): the deploy user owns the folder
# and deletes them; the group `sablia` may create them.
install -d -o sablia-site -g sablia -m 2770 "$SITE_ROOT/triggers"
install -d -o root -g sablia-site -m 0750 "$CONF_DIR"

echo "==> 3/6 deploy.sh (root-owned)"
install -o root -g root -m 0755 "$HERE/deploy.sh" "$CONF_DIR/deploy.sh"

echo "==> 4/6 refs and deploy.env (existing values are kept)"
[ -f "$CONF_DIR/prod-ref" ] || echo "$PROD_REF" > "$CONF_DIR/prod-ref"
[ -f "$CONF_DIR/preview-ref" ] || echo "$PREVIEW_REF" > "$CONF_DIR/preview-ref"
[ -f "$CONF_DIR/deploy.env" ] || echo "INDEXNOW_ENABLED=0" > "$CONF_DIR/deploy.env"
chown root:sablia-site "$CONF_DIR/prod-ref" "$CONF_DIR/preview-ref" "$CONF_DIR/deploy.env"
chmod 0640 "$CONF_DIR/prod-ref" "$CONF_DIR/preview-ref" "$CONF_DIR/deploy.env"
echo "    prod-ref=$(cat "$CONF_DIR/prod-ref") preview-ref=$(cat "$CONF_DIR/preview-ref") $(cat "$CONF_DIR/deploy.env")"

echo "==> 5/6 units and polkit rule"
install -o root -g root -m 0644 "$HERE/sablia-site@.service" "$UNIT_DIR/sablia-site@.service"
install -o root -g root -m 0644 "$HERE/sablia-site-deploy.service" "$UNIT_DIR/sablia-site-deploy.service"
install -o root -g root -m 0644 "$HERE/sablia-site-deploy.timer" "$UNIT_DIR/sablia-site-deploy.timer"
install -d -m 0755 "$POLKIT_DIR"
install -o root -g root -m 0644 "$HERE/50-sablia-site.rules" "$POLKIT_DIR/50-sablia-site.rules"
systemctl daemon-reload

echo "==> 6/6 instances"
if [ "$ENABLE_INSTANCES" = 1 ]; then
  for slot in prod preview; do
    if [ -L "$SITE_ROOT/$slot" ]; then systemctl enable "sablia-site@$slot.service"; else echo "    $slot has no release yet: not enabled"; fi
  done
else
  echo "    skipped (--enable-instances once a slot has a release)"
fi
if [ -f "$CONF_DIR/prod.env" ] && [ -f "$CONF_DIR/preview.env" ] && [ -f "$CONF_DIR/build.env" ]; then
  echo "env files present: enable the timer with  systemctl enable --now sablia-site-deploy.timer"
else
  echo "env files missing: run  sudo bash $HERE/install-env.sh  before enabling the timer"
fi
