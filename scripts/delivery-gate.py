#!/usr/bin/env python3
"""Delivery gate: every feat/fix commit of a client repo carries a story id and a test file.

Contract (harness/registry.json, tests_hors_registre.liste["scripts/harness/delivery_gate.test.sh"]):
  - considered: non-merge commits whose subject matches (feat|fix) case-insensitively, with repeated
    scopes and spaces before the colon tolerated (`fix : x`, `fix(a)(b): x`, `FEAT: x`); a `fixup! ` /
    `squash! ` prefix is stripped, so such a commit counts by the commit it wraps. Every other type passes
    deliberately, including `Revert "..."` commits: a revert removes code, so asking it for a story and a
    test would only produce noise (exempt on purpose, pinned by delivery_gate.test.sh).
  - story: \\bUS-\\d+\\b anywhere in the full message.
  - test file: a changed path (renames by new path, deletions do not count) whose basename has
    .test. / .spec. / test_*.py / *_test.py / *.test.sh, or with a segment e2e|test|tests|__tests__,
    or under supabase/tests/. specs/ is not a test.
  - usage: --repo PATH (--range BASE..HEAD | --since YYYY-MM-DD) [--report]
  - exit 0 VERT, 1 ROUGE (one offender per line), 2 ERREUR (git cannot resolve: refuse, never green).
stdlib only, Python 3.10+; also copied into satellite repos and run in CI.
"""
import argparse
import fnmatch
import os
import re
import subprocess
import sys

SUBJECT_RE = re.compile(r"^(?:(?:fixup|squash)!\s+)*(?:feat|fix)(?:\s*\([^)]*\))*\s*!?\s*:", re.IGNORECASE)
STORY_RE = re.compile(r"\bUS-\d+\b")
TEST_SEGMENTS = {"e2e", "test", "tests", "__tests__"}
TEST_BASENAMES = ("test_*.py", "*_test.py", "*.test.sh")


class GitError(Exception):
    pass


def git(repo, *args):
    p = subprocess.run(["git", "-C", repo, *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if p.returncode != 0:
        raise GitError((p.stderr.strip() or "git failed") + f" [git {' '.join(args)}]")
    return p.stdout


def is_test(path):
    parts = path.split("/")
    base = parts[-1]
    if ".test." in base or ".spec." in base:
        return True
    if any(fnmatch.fnmatchcase(base, g) for g in TEST_BASENAMES):
        return True
    if any(seg in TEST_SEGMENTS for seg in parts[:-1]):
        return True
    return path.startswith("supabase/tests/")


def changed_paths(repo, sha):
    """Paths present after the commit: added/modified/copied by path, renamed by new path; deletions skipped."""
    out = git(repo, "diff-tree", "--root", "--no-commit-id", "--name-status", "-r", "-M", "-z", sha)
    tok = out.split("\0")
    paths, i = [], 0
    while i < len(tok) and tok[i]:
        status = tok[i][0]
        if status in "RC":
            paths.append(tok[i + 2])
            i += 3
        else:
            if status != "D":
                paths.append(tok[i + 1])
            i += 2
    return paths


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--repo", required=True)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--range", dest="rng")
    g.add_argument("--since")
    ap.add_argument("--report", action="store_true")
    a = ap.parse_args()

    try:
        # git walks up from a subdirectory: `--repo <dir inside the hub>` would lint the HUB's history.
        top = git(a.repo, "rev-parse", "--show-toplevel").strip()
        if os.path.realpath(top) != os.path.realpath(a.repo):
            raise GitError(f"{a.repo} is not a repository root (git resolves {top})")
        sel = [a.rng] if a.rng else [f"--since={a.since}", "HEAD"]
        shas = git(a.repo, "log", "--no-merges", "--format=%H", *sel).split()
        offenders, considered = [], 0
        for sha in shas:
            subject = git(a.repo, "log", "-1", "--format=%s", sha).strip()
            if not SUBJECT_RE.match(subject):
                continue
            considered += 1
            message = git(a.repo, "log", "-1", "--format=%B", sha)
            missing = []
            if not STORY_RE.search(message):
                missing.append("story")
            if not any(is_test(p) for p in changed_paths(a.repo, sha)):
                missing.append("test")
            if missing:
                offenders.append((sha[:7], subject, "+".join(missing)))
    except GitError as e:
        print(f"ERREUR delivery-gate: {e}")
        _trace("erreur", str(e)[:200])
        return 2

    n, k = considered, len(offenders)
    if k:
        print(f"ROUGE delivery-gate: {k} sur {n} commit(s) feat/fix sans story ou sans test")
        for sha7, subject, what in offenders:
            print(f"{sha7} {subject} — manque: {what}")
    else:
        print(f"VERT delivery-gate: {n} commit(s) feat/fix, tous avec story et test")
    if a.report:
        pct = round(100 * (n - k) / n) if n else 100
        print(f"Conformes: {n - k}/{n} ({pct} %)")
    _trace("rouge" if k else "vert", f"{n - k}/{n} {a.repo}")
    return 1 if k else 0


def _trace(action, detail):
    # Optional hub telemetry: absent in satellite repos and CI, so only the import may fail silently.
    try:
        sys.path.insert(0, "/home/sablia/workspace/scripts/harness")
        from harness_trace import harness_trace
    except ImportError:
        return
    harness_trace("delivery-gate", action, detail)


if __name__ == "__main__":
    sys.exit(main())
