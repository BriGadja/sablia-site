#!/usr/bin/env bash
# RED/GREEN for motion-check.py: a real JS loop without pause fails, finite sequences and a loop with a pause pass.
set -u
cd "$(dirname "$0")"
PORT=$(python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1])')
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory fixtures/motion >/dev/null 2>&1 &
SRV=$!; trap 'kill $SRV' EXIT; sleep 1
fail=0
run() { # want-exit route
  python3 motion-check.py --base "http://127.0.0.1:$PORT" --routes "$2" --vp 1440 >/tmp/mc-test.$$ 2>&1; got=$?
  if [ "$got" = "$1" ]; then echo "PASS $2 exit $got"; else echo "FAIL $2 wanted $1 got $got"; cat /tmp/mc-test.$$; fail=1; fi
}
run 1 /loop-nopause.html
run 0 /oneshot-9s.html
run 0 /loop-pause.html
rm -f /tmp/mc-test.$$
exit $fail
