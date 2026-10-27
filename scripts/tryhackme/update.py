#!/usr/bin/env python3
"""Fetch public TryHackMe stats and write them to _data/tryhackme.yml in the site repo.

Runs from a residential connection (e.g. a homelab container), because TryHackMe
blocks requests from data centers such as GitHub Actions runners.

Environment:
  THM_USERNAME   TryHackMe username
  GITHUB_TOKEN   fine-grained token, repo jkuehnemundt/jkuehnemundt.github.io, Contents: read and write
  GITHUB_REPO    optional, default jkuehnemundt/jkuehnemundt.github.io
"""
import base64
import datetime
import json
import os
import sys
import urllib.request

from curl_cffi import requests  # pip install curl_cffi

API = "https://tryhackme.com/api/v2/public-profile"
PROFILES = ["chrome", "chrome131", "safari", "chrome120"]
PATH = "_data/tryhackme.yml"
STAT_KEYS = ["top_percent", "rank", "rooms", "badges", "level"]


def fetch(username):
    last = None
    for profile in PROFILES:
        try:
            r = requests.get(API, params={"username": username}, impersonate=profile,
                             headers={"accept": "application/json"}, timeout=20)
            if r.headers.get("x-vercel-mitigated") or r.status_code != 200:
                last = f"{profile}: HTTP {r.status_code} {r.headers.get('x-vercel-mitigated', '')}"
                continue
            body = r.json()
            if body.get("status") == "success":
                return body["data"]
            last = f"{profile}: {body.get('status')}"
        except Exception as e:  # try the next browser profile
            last = f"{profile}: {e}"
    sys.exit(f"TryHackMe fetch failed ({last})")


def to_yaml(username, d):
    stats = {
        "top_percent": d.get("topPercentage"),
        "rank": d.get("rank"),
        "rooms": d.get("completedRoomsNumber"),
        "badges": d.get("badgesNumber"),
        "level": d.get("level"),
    }
    lines = [
        "# Filled automatically by scripts/tryhackme/update.py (runs weekly in the homelab).",
        '# As long as "updated" is empty, /about/ shows a plain profile link without numbers.',
        f'username: "{username}"',
        f'profile: "https://tryhackme.com/p/{username}"',
        f'updated: "{datetime.date.today().isoformat()}"',
    ]
    lines += [f'{k}: "{"" if stats[k] is None else stats[k]}"' for k in STAT_KEYS]
    return "\n".join(lines) + "\n", stats


def gh(method, url, token, payload=None):
    req = urllib.request.Request(url, method=method, data=json.dumps(payload).encode() if payload else None,
                                 headers={"Authorization": f"Bearer {token}",
                                          "Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)


def current_stats(text):
    out = {}
    for line in text.splitlines():
        if ":" in line and not line.startswith("#"):
            k, v = line.split(":", 1)
            out[k.strip()] = v.strip().strip('"')
    return {k: out.get(k, "") for k in STAT_KEYS}


def main():
    username = os.environ["THM_USERNAME"]
    token = os.environ["GITHUB_TOKEN"]
    repo = os.environ.get("GITHUB_REPO", "jkuehnemundt/jkuehnemundt.github.io")

    yaml, stats = to_yaml(username, fetch(username))
    url = f"https://api.github.com/repos/{repo}/contents/{PATH}"
    existing = gh("GET", url, token)
    old = base64.b64decode(existing["content"]).decode()

    if current_stats(old) == {k: "" if stats[k] is None else str(stats[k]) for k in STAT_KEYS}:
        print("No change, nothing to commit.")
        return

    gh("PUT", url, token, {
        "message": "Update TryHackMe stats",
        "content": base64.b64encode(yaml.encode()).decode(),
        "sha": existing["sha"],
    })
    print("Committed:", stats)


if __name__ == "__main__":
    main()
