#!/usr/bin/env bash
# Proves content-gates.sh can FAIL: a clean fixture must pass, and one fixture per forbidden string must fail on its own
# rule. Names in the fixtures are synthetic (the real list lives in the hub and never enters this public repo).
# Usage: content-gates.bench.sh   Exit 0 when every case behaves, 1 otherwise.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"; GATES="$HERE/content-gates.sh"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
NAMES="$T/names.txt"; printf '# synthetic\nAcmecorp\ncs:Zorblax\nre:Gaston[eë]\n' >"$NAMES"
mk() { # mk NAME 'body html' -> dir with index.html + llms.txt
  mkdir -p "$T/$1"; printf '<!doctype html><html lang="fr"><head><title>t</title></head><body><main id="contenu"><p>%s</p></main></body></html>' "$2" >"$T/$1/index.html"
  printf '# Sablia\nContact: brice@sablia.io\n' >"$T/$1/llms.txt"; }
fail=0
expect() { # expect WANT_EXIT RULE DIR [flags...]
  local want="$1" rule="$2" dir="$3"; shift 3
  out="$("$GATES" "$@" "$T/$dir" 2>&1)"; rc=$?
  if [ "$rc" -ne "$want" ]; then echo "BENCH FAIL $dir: exit $rc, wanted $want"; echo "$out" | head -3; fail=1
  elif [ "$want" -ne 0 ] && ! grep -q "$rule" <<<"$out"; then echo "BENCH FAIL $dir: exit $rc but rule '$rule' not reported"; echo "$out" | head -3; fail=1
  else echo "bench ok   $dir (exit $rc)"; fi; }
mk clean 'Un texte propre. 80 clients, 20+ clients, width 80 pour cent. Contact brice@sablia.io'
expect 0 - clean --names "$NAMES"
for f in 70,9 80 95 70 19 94 46 51 54 36 35 96 26 17; do mk "fig-$f" "Selon une étude, $f % des projets"; expect 1 'banned-figure' "fig-$f"; done
mk fig-nospace 'Selon une étude, 95% des projets'; expect 1 'banned-figure' fig-nospace
mk fig-nbsp 'Selon une étude, 80&nbsp;% des projets'; expect 1 'banned-figure' fig-nbsp
mk milliards '18,6 milliards d euros'; expect 1 'banned-18-6' milliards
mk tjm 'TJM entre 500 et 950 € par jour'; expect 1 'banned-tjm' tjm
mk rand 'Selon RAND, la plupart échouent'; expect 1 'banned-rand' rand
mk rand-ok 'Notre brand et un random walk'; expect 0 - rand-ok
mk iap 'Les élèves de IAPreneurs'; expect 1 'banned-iapreneurs' iap
mk etape "Quand l'étape de vente avance"; expect 1 'banned-etape-de-vente' etape
mk etape2 "Quand l’étape de vente avance"; expect 1 'banned-etape-de-vente' etape2
mk emdash-proof 'x'; printf '<section class="proof-strip"><p>Un chiffre — un fait</p></section>' >>"$T/emdash-proof/index.html"; expect 1 'em-dash-proof' emdash-proof
mk emdash-llms 'x'; printf 'Une phrase — avec tiret\n' >>"$T/emdash-llms/llms.txt"; expect 1 'em-dash-proof' emdash-llms
mk emdash-ok 'Un tiret — hors surface de preuve'; expect 0 - emdash-ok
for h in fonts.googleapis.com fonts.gstatic.com youtube.com/embed/abc youtube.com/iframe_api i.ytimg.com/vi/x; do
  k="host-$(tr '/.' '__' <<<"$h")"; mk "$k" 'x'; printf '<link href="https://%s">' "$h" >>"$T/$k/index.html"; expect 1 'third-party-host' "$k"; done
mk ma 'x'; printf '<script src="/m/a.js"></script>' >>"$T/ma/index.html"; expect 1 'umami-static' ma
mk conf 'Prix [À CONFIRMER] ici'
expect 0 - conf; expect 0 - conf --auto; expect 1 'a-confirmer' conf --prod; SABLIA_SLOT=prod expect 1 'a-confirmer' conf --auto
mk email 'Écrire à jean@exemple.fr'; expect 1 'foreign-email' email
mk name1 'Nous avons aidé Acmecorp'; expect 0 - name1; expect 1 'banned-name' name1 --names "$NAMES"
mk name2 'Merci zorblax'; expect 0 - name2 --names "$NAMES"
mk name3 'Merci Zorblax'; expect 1 'banned-name' name3 --names "$NAMES"
mk name4 'Voici Gastonë'; expect 1 'banned-name' name4 --names "$NAMES"
mkdir -p "$T/empty"; expect 1 'no-html' empty
expect 1 'no-html' nonexistent
[ "$fail" -eq 0 ] && echo "content-gates.bench: all cases behave" || echo "content-gates.bench: FAILED"
exit "$fail"
