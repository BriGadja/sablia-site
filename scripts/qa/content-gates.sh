#!/usr/bin/env bash
# Content gates on the BUILT site: greps every *.html under <dir> plus llms.txt for what the register (§ c) forbids.
# Usage: content-gates.sh [--prod|--auto] [--names FILE] <dir>
#   --prod        also fails on « [À CONFIRMER] » (the CGV markers must be resolved before prod)
#   --auto        same as --prod only when SABLIA_SLOT=prod (what the build chain runs; it has no --names: the list stays in the hub)
#   --names FILE  hub list of banned names (projects/sablia/offre/preuve/site-banned-names.txt; format in its header)
# Rules (reported as `FAIL <rule> <file>: <excerpt>`): banned-figure (14 figures followed by %), banned-18-6, banned-tjm (500-950),
# banned-rand (« RAND », case-sensitive), banned-iapreneurs, banned-etape-de-vente, em-dash-proof (em dash in llms.txt or inside an
# element whose id/class contains proof|preuve|temoignage), third-party-host (fonts.googleapis, fonts.gstatic, youtube.com/embed,
# youtube.com/iframe_api, i.ytimg.com), umami-static (/m/a.js in static HTML), a-confirmer, foreign-email (any address but
# brice@sablia.io, in text or hrefs), banned-name (--names), no-html (no HTML under <dir>: a gate that read nothing is red).
# Text rules read the visible text and meta content (scripts and styles stripped, so CSS « width:80% » never trips them).
# Exit 0 clean, 1 on any FAIL, 2 on bad usage.
set -u
MODE=""; NAMES=""; DIR=""
while [ $# -gt 0 ]; do case "$1" in
  --prod) MODE=prod; shift;; --auto) MODE=auto; shift;;
  --names) NAMES="${2:-}"; shift 2;;
  -*) echo "usage: content-gates.sh [--prod|--auto] [--names FILE] <dir>" >&2; exit 2;;
  *) DIR="$1"; shift;; esac; done
[ -n "$DIR" ] || { echo "usage: content-gates.sh [--prod|--auto] [--names FILE] <dir>" >&2; exit 2; }
STRICT=0; [ "$MODE" = prod ] && STRICT=1; [ "$MODE" = auto ] && [ "${SABLIA_SLOT:-}" = prod ] && STRICT=1
if [ -n "$NAMES" ] && [ ! -r "$NAMES" ]; then echo "FAIL names file unreadable: $NAMES"; exit 1; fi
exec python3 -I - "$DIR" "$STRICT" "$NAMES" <<'PY'
import html, re, sys
from html.parser import HTMLParser
from pathlib import Path

root, strict, names_file = Path(sys.argv[1]), sys.argv[2] == "1", sys.argv[3]
SP = r"[\s  ]*"
FIG = re.compile(r"(?<![\d,.])(?:70,9|80|95|70|19|94|46|51|54|36|35|96|26|17)" + SP + "%")
TEXT_RULES = [
    ("banned-18-6", re.compile(r"18,6" + SP + "milliards", re.I)),
    ("banned-tjm", re.compile(r"500" + SP + r"(?:-|–|à|et|a)" + SP + "950")),
    ("banned-rand", re.compile(r"\bRAND\b")),
    ("banned-iapreneurs", re.compile(r"IA" + r"\s?preneurs?", re.I)),
    ("banned-etape-de-vente", re.compile(r"l['’]étape de vente avance", re.I)),
]
RAW_HOSTS = [("fonts.googleapis", "fonts.googleapis"), ("fonts.gstatic", "fonts.gstatic"), ("youtube.com/embed", "youtube.com/embed"),
             ("youtube.com/iframe_api", "youtube.com/iframe_api"), ("i.ytimg.com", "i.ytimg.com")]
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}")
FILE_TLD = {"png", "webp", "jpg", "jpeg", "svg", "gif", "avif", "css", "js", "ico", "woff", "woff2"}
OWN = "brice@sablia.io"
PROOF = re.compile(r"proof|preuve|temoignage|témoignage", re.I)
VOID = {"br", "img", "input", "meta", "link", "hr", "source", "area", "base", "col", "embed", "wbr", "track", "param"}


class Extract(HTMLParser):
    """Collects visible text, meta content, hrefs, and the text inside proof-like elements."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.text, self.attrs, self.proof, self.skip, self.stack = [], [], [], 0, []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
        if tag == "meta" and a.get("content"):
            self.text.append(a["content"])
        for k in ("href", "src", "alt", "title", "aria-label"):
            if a.get(k):
                self.attrs.append(a[k]); (self.text.append(a[k]) if k in ("alt", "title", "aria-label") else None)
        if tag not in VOID:
            self.stack.append((tag, bool(PROOF.search((a.get("id") or "") + " " + (a.get("class") or "")))))
    def handle_endtag(self, tag):
        if tag in ("script", "style") and self.skip:
            self.skip -= 1
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break
    def handle_data(self, d):
        if self.skip:
            return
        self.text.append(d)
        if any(p for _, p in self.stack):
            self.proof.append(d)


def load_names(path):
    rules = []
    for ln in Path(path).read_text(encoding="utf8").splitlines():
        ln = ln.strip()
        if not ln or ln.startswith("#"):
            continue
        if ln.startswith("re:"):
            rules.append((ln, re.compile(r"\b(?:" + ln[3:] + r")\b", re.I)))
        elif ln.startswith("cs:"):
            rules.append((ln, re.compile(r"\b" + re.escape(ln[3:]) + r"\b")))
        else:
            rules.append((ln, re.compile(r"\b" + re.escape(ln) + r"\b", re.I)))
    return rules


names = load_names(names_file) if names_file else []
fails = []
def fail(rule, f, text, m):
    s = max(0, m.start() - 25)
    fails.append(f"FAIL {rule} {f}: …{re.sub(r'[\s]+', ' ', text[s:m.end() + 25])}…")

files = sorted(p for p in root.rglob("*.html")) if root.is_dir() else []
llms = sorted(root.rglob("llms.txt")) if root.is_dir() else []
if not files:
    fails.append(f"FAIL no-html no HTML file under {root}")
for p in files:
    raw = p.read_text(encoding="utf8", errors="replace")
    ex = Extract(); ex.feed(raw)
    text = html.unescape(" ".join(ex.text))
    rel = str(p.relative_to(root)) if root.is_dir() else str(p)
    for m in FIG.finditer(text): fail("banned-figure", rel, text, m)
    for rule, rx in TEXT_RULES:
        for m in rx.finditer(text): fail(rule, rel, text, m)
    ptxt = " ".join(ex.proof)
    for m in re.finditer("—", ptxt): fail("em-dash-proof", rel, ptxt, m)
    for label, needle in RAW_HOSTS:
        i = raw.find(needle)
        if i >= 0: fails.append(f"FAIL third-party-host {rel}: {label}")
    if "/m/a.js" in raw: fails.append(f"FAIL umami-static {rel}: /m/a.js in static HTML")
    if strict:
        for m in re.finditer(r"\[À CONFIRMER\]", text): fail("a-confirmer", rel, text, m)
    for m in EMAIL.finditer(text + " " + " ".join(a.replace("mailto:", "") for a in ex.attrs)):
        if m.group(0).lower() != OWN and m.group(0).rsplit(".", 1)[-1].lower() not in FILE_TLD:
            fails.append(f"FAIL foreign-email {rel}: {m.group(0)}")
    for label, rx in names:
        for m in rx.finditer(text): fail("banned-name", rel, text, m); fails[-1] += f"  [{label}]"
for p in llms:
    t = p.read_text(encoding="utf8", errors="replace"); rel = str(p.relative_to(root))
    for m in FIG.finditer(t): fail("banned-figure", rel, t, m)
    for rule, rx in TEXT_RULES:
        for m in rx.finditer(t): fail(rule, rel, t, m)
    for m in re.finditer("—", t): fail("em-dash-proof", rel, t, m)
    if strict:
        for m in re.finditer(r"\[À CONFIRMER\]", t): fail("a-confirmer", rel, t, m)
    for m in EMAIL.finditer(t):
        if m.group(0).lower() != OWN: fails.append(f"FAIL foreign-email {rel}: {m.group(0)}")
    for label, rx in names:
        for m in rx.finditer(t): fail("banned-name", rel, t, m); fails[-1] += f"  [{label}]"
    for label, needle in RAW_HOSTS:
        if needle in t: fails.append(f"FAIL third-party-host {rel}: {label}")
seen = set()
for f in fails:
    if f not in seen:
        seen.add(f); print(f)
print(f"content-gates: {len(seen)} finding(s) in {len(files)} html + {len(llms)} llms.txt{' (strict: À CONFIRMER)' if strict else ''}")
sys.exit(1 if seen else 0)
PY
