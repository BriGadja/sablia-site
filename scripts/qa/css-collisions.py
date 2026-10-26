#!/usr/bin/env python3
"""CSS discipline enforcer for the v2 build (plan sablia-io-v2, "CSS discipline").

Scans <root>/**/*.css (default root: src) and fails (exit 1) on:
  NO-LAYER-ORDER        file does not open with `@layer theme, base, components, utilities;`
  OUTSIDE-LAYER         a rule / @keyframes / @media outside an `@layer` block (scoped files: outside
                        `@layer components`; globals.css / base.css: outside any @layer)
  UNSCOPED-RULE         in a scoped file, a rule whose selector does not start with `.v2-<scope>`
  KEYFRAMES-NESTED      `@keyframes` written inside a style rule (Turbopack drops it with a warning)
  KEYFRAMES-UNPREFIXED  in a scoped file, a keyframe name not prefixed `<scope>-`
  DUP-KEYFRAMES         the same @keyframes name defined twice across the tree
  ROOT-ID-DESCENDANT    `.v2-x #id ...` (never matches a root carrying both; write `&#id`)
  FONT-LITERAL          'Familjen Grotesk' / 'Fragment Mono' anywhere under root except app/fonts.ts
  PREFLIGHT             a Tailwind preflight import (`tailwindcss/preflight*` or bare `@import "tailwindcss"`)

`globals.css` and `base.css` are the "global" files: they may hold unscoped rules, but only inside @layer.
Every other .css file is a "scoped" file: one `.v2-<scope>` per file.
"""
import argparse
import re
import sys
from pathlib import Path

LAYER_ORDER = "@layer theme, base, components, utilities;"
GLOBAL_FILES = {"globals.css", "base.css"}
FONT_RE = re.compile(r"Familjen Grotesk|Fragment Mono")
PREFLIGHT_RE = re.compile(r"""@import\s+(?:url\()?\s*["']tailwindcss(?:/preflight(?:\.css)?)?["']""")
ROOT_ID_RE = re.compile(r"^\.v2-[\w-]+\s+#")


def strip_comments(text):
    return re.sub(r"/\*.*?\*/", "", text, flags=re.S)


def parse(text):
    """Return a list of nodes: {'prelude': str, 'children': list|None}. `children` None = statement."""
    pos = 0
    n = len(text)

    def read_block():
        nonlocal pos
        nodes = []
        while pos < n:
            start = pos
            depth = 0
            quote = None
            while pos < n:
                c = text[pos]
                if quote:
                    if c == "\\":
                        pos += 1
                    elif c == quote:
                        quote = None
                elif c in "\"'":
                    quote = c
                elif c == "(":
                    depth += 1
                elif c == ")":
                    depth -= 1
                elif depth == 0 and c in "{};":
                    break
                pos += 1
            prelude = text[start:pos].strip()
            if pos >= n:
                if prelude:
                    nodes.append({"prelude": prelude, "children": None})
                return nodes
            c = text[pos]
            pos += 1
            if c == "{":
                nodes.append({"prelude": prelude, "children": read_block()})
            elif c == ";":
                if prelude:
                    nodes.append({"prelude": prelude, "children": None})
            else:  # "}"
                if prelude:
                    nodes.append({"prelude": prelude, "children": None})
                return nodes
        return nodes

    return read_block()


def selectors(prelude):
    return [s.strip() for s in re.split(r",(?![^(]*\))", prelude) if s.strip()]


def keyframes_anywhere(nodes, inside_rule, out):
    for node in nodes:
        p = node["prelude"]
        ch = node["children"]
        if p.startswith("@keyframes") or re.match(r"@-\w+-keyframes", p):
            if inside_rule:
                out.append(p)
            continue
        if ch is None:
            continue
        is_rule = not p.startswith("@")
        keyframes_anywhere(ch, inside_rule or is_rule, out)


def check_scoped_layer(nodes, scope, rel, errors, keyframes):
    for node in nodes:
        p = node["prelude"]
        ch = node["children"]
        if p.startswith("@keyframes"):
            name = p.split(None, 1)[1].strip()
            keyframes.setdefault(name, []).append(rel)
            if scope and not name.startswith(scope.removeprefix("v2-") + "-"):
                errors.append((rel, "KEYFRAMES-UNPREFIXED", f"{name} (expected prefix {scope.removeprefix('v2-')}-)"))
        elif p.startswith("@media") or p.startswith("@supports") or p.startswith("@container"):
            check_scoped_layer(ch or [], scope, rel, errors, keyframes)
        elif p.startswith("@"):
            errors.append((rel, "OUTSIDE-LAYER", f"unexpected at-rule {p[:40]}"))
        elif ch is not None:
            for sel in selectors(p):
                m = re.match(r"^\.(v2-[\w-]+)", sel)
                if not m or (scope and m.group(1) != scope):
                    errors.append((rel, "UNSCOPED-RULE", sel[:80]))
                elif ROOT_ID_RE.match(sel):
                    errors.append((rel, "ROOT-ID-DESCENDANT", sel[:80]))


def first_scope(nodes):
    def walk(ns):
        for node in ns:
            for sel in selectors(node["prelude"]) if not node["prelude"].startswith("@") else []:
                m = re.match(r"^\.(v2-[\w-]+)", sel)
                if m:
                    return m.group(1)
            if node["children"]:
                found = walk(node["children"])
                if found:
                    return found
        return None

    return walk(nodes)


def check_css(path, root, errors, keyframes):
    rel = str(path.relative_to(root))
    raw = path.read_text()
    text = strip_comments(raw)
    if not text.lstrip().startswith(LAYER_ORDER):
        errors.append((rel, "NO-LAYER-ORDER", "file must open with the layer-order statement"))
    for m in PREFLIGHT_RE.finditer(text):
        errors.append((rel, "PREFLIGHT", m.group(0)))
    if "preflight" in text.lower() and not PREFLIGHT_RE.search(text):
        errors.append((rel, "PREFLIGHT", "preflight mentioned"))

    nodes = parse(text)
    nested = []
    keyframes_anywhere(nodes, False, nested)
    for p in nested:
        errors.append((rel, "KEYFRAMES-NESTED", p))

    is_global = path.name in GLOBAL_FILES
    scope = None if is_global else first_scope(nodes)
    for node in nodes:
        p = node["prelude"]
        ch = node["children"]
        if p == LAYER_ORDER.rstrip(";") and ch is None:
            continue
        if p.startswith("@import") or p.startswith("@theme") or p.startswith("@charset"):
            continue
        if p.startswith("@layer") and ch is not None:
            layer = p[len("@layer"):].strip()
            if is_global:
                for sub in ch:
                    sp = sub["prelude"]
                    if sp.startswith("@keyframes"):
                        keyframes.setdefault(sp.split(None, 1)[1].strip(), []).append(rel)
                    elif sub["children"] is not None and sp.startswith("@media"):
                        for sub2 in sub["children"]:
                            if sub2["prelude"].startswith("@keyframes"):
                                keyframes.setdefault(sub2["prelude"].split(None, 1)[1].strip(), []).append(rel)
                continue
            if layer != "components":
                errors.append((rel, "OUTSIDE-LAYER", f"@layer {layer} in a scoped file"))
                continue
            check_scoped_layer(ch, scope, rel, errors, keyframes)
            continue
        errors.append((rel, "OUTSIDE-LAYER", p[:60]))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="src")
    args = ap.parse_args()
    root = Path(args.root)
    if not root.is_dir():
        print(f"root not found: {root}", file=sys.stderr)
        return 2
    errors = []
    keyframes = {}
    for path in sorted(root.rglob("*.css")):
        check_css(path, root, errors, keyframes)
    for name, files in keyframes.items():
        if len(files) > 1:
            errors.append((", ".join(sorted(set(files))) if len(set(files)) > 1 else files[0], "DUP-KEYFRAMES", name))
    for path in sorted(root.rglob("*")):
        if path.suffix in {".css", ".ts", ".tsx", ".mjs", ".js", ".jsx"} and path.is_file():
            rel = str(path.relative_to(root))
            if rel == "app/fonts.ts":
                continue
            for i, line in enumerate(path.read_text().splitlines(), 1):
                if FONT_RE.search(line):
                    errors.append((f"{rel}:{i}", "FONT-LITERAL", line.strip()[:80]))
    for where, code, detail in errors:
        print(f"{code}  {where}  {detail}")
    print(f"css-collisions: {len(errors)} violation(s) in {root}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
