#!/bin/bash
# Takes the host chain of sablia-site back out (the rollback of deploy/install.sh). Run as root:
#
#     sudo bash deploy/uninstall.sh [--purge]
#
# Stops and disables the timer and both instances, removes the three units and the polkit rule, reloads
# systemd. Keeps /etc/sablia-site (refs, env files) and the site tree by default: `--purge` removes them too
# (the releases and the build logs go with it). Never touches Caddy, the DNS, the Umami stack or the user
# `sablia-site` (remove it by hand with `userdel sablia-site` once nothing needs it).
set -euo pipefail

SITE_ROOT="${SITE_ROOT:-/opt/sablia/sites/sablia-site}"
CONF_DIR="${CONF_DIR:-/etc/sablia-site}"
UNIT_DIR="${UNIT_DIR:-/etc/systemd/system}"
POLKIT_DIR="${POLKIT_DIR:-/etc/polkit-1/rules.d}"
PURGE=0
[ "${1:-}" = "--purge" ] && PURGE=1
if [ "$(id -u)" != 0 ] && [ -z "${UNINSTALL_NO_ROOT_CHECK:-}" ]; then echo "run as root: sudo bash $0" >&2; exit 1; fi

systemctl disable --now sablia-site-deploy.timer || true
for slot in prod preview; do systemctl disable --now "sablia-site@$slot.service" || true; done
rm -f "$UNIT_DIR/sablia-site@.service" "$UNIT_DIR/sablia-site-deploy.service" "$UNIT_DIR/sablia-site-deploy.timer"
rm -f "$POLKIT_DIR/50-sablia-site.rules"
systemctl daemon-reload
echo "units and polkit rule removed"
if [ "$PURGE" = 1 ]; then
  rm -rf "$CONF_DIR" "$SITE_ROOT"
  echo "purged $CONF_DIR and $SITE_ROOT"
else
  echo "kept $CONF_DIR and $SITE_ROOT (--purge removes them)"
fi
