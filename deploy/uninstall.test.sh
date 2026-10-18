#!/bin/bash
# Test of deploy/uninstall.sh against temp directories and a fake systemctl (no root, nothing real touched).
HERE="$(cd "$(dirname "$0")" && pwd)"
[ -f "$HERE/uninstall.sh" ] || { echo "FAIL uninstall.sh missing"; exit 1; }
T="$(mktemp -d)"; fails=0; trap 'rm -rf "$T"' EXIT
ok() { echo "PASS $1"; }; bad() { echo "FAIL $1"; fails=$((fails+1)); }
mkdir -p "$T/bin" "$T/units" "$T/polkit" "$T/etc" "$T/site"
printf '#!/bin/bash\necho "$@" >> %s\n' "$T/calls.log" > "$T/bin/systemctl"; chmod +x "$T/bin/systemctl"
for f in 'sablia-site@.service' sablia-site-deploy.service sablia-site-deploy.timer; do echo x > "$T/units/$f"; done
echo x > "$T/units/other.service"; echo x > "$T/polkit/50-sablia-site.rules"; echo x > "$T/polkit/10-other.rules"
echo keep > "$T/etc/prod.env"; echo keep > "$T/site/RELEASE"
export PATH="$T/bin:$PATH" UNIT_DIR="$T/units" POLKIT_DIR="$T/polkit" CONF_DIR="$T/etc" SITE_ROOT="$T/site" UNINSTALL_NO_ROOT_CHECK=1

bash "$HERE/uninstall.sh" > "$T/out.log" 2>&1; rc=$?
[ $rc -eq 0 ] && ok "exit 0" || bad "exit $rc"
ls "$T/units" | grep -q sablia-site && bad "units left behind" || ok "the three units are removed"
[ -f "$T/units/other.service" ] && ok "another unit is untouched" || bad "another unit was removed"
[ -f "$T/polkit/50-sablia-site.rules" ] && bad "polkit rule left" || ok "the polkit rule is removed"
[ -f "$T/polkit/10-other.rules" ] && ok "another polkit rule is untouched" || bad "another polkit rule removed"
grep -q "disable --now sablia-site-deploy.timer" "$T/calls.log" && ok "the timer is disabled and stopped first" || bad "timer disable"
grep -q "disable --now sablia-site@prod.service" "$T/calls.log" && grep -q "disable --now sablia-site@preview.service" "$T/calls.log" && ok "both instances are disabled and stopped" || bad "instances disable"
grep -q "daemon-reload" "$T/calls.log" && ok "daemon-reload" || bad "daemon-reload"
[ -f "$T/etc/prod.env" ] && [ -f "$T/site/RELEASE" ] && ok "config and site tree are kept by default" || bad "data removed without --purge"
bash "$HERE/uninstall.sh" --purge > "$T/out2.log" 2>&1
[ -d "$T/etc" ] && bad "--purge must remove the config dir" || ok "--purge removes the config dir"
[ -d "$T/site" ] && bad "--purge must remove the site tree" || ok "--purge removes the site tree"
exit $((fails>0))
