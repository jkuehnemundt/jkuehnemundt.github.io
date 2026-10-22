#!/usr/bin/env bash
# Downloads the four fonts from npm (Fontsource, open licenses) and copies the
# woff2 files the theme needs into assets/fonts/. Run once from the repo root:
#   bash scripts/fetch-fonts.sh
# Needs Node.js/npm. Afterwards you can commit assets/fonts/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
npm init -y >/dev/null
npm install --silent @fontsource/instrument-sans @fontsource/jetbrains-mono @fontsource/architects-daughter

mkdir -p "$ROOT/assets/fonts"
copy() { cp "node_modules/@fontsource/$1/files/$2" "$ROOT/assets/fonts/$2"; echo "  $2"; }

echo "Copying fonts to assets/fonts/:"
copy instrument-sans      instrument-sans-latin-400-normal.woff2
copy instrument-sans      instrument-sans-latin-500-normal.woff2
copy instrument-sans      instrument-sans-latin-600-normal.woff2
copy jetbrains-mono       jetbrains-mono-latin-400-normal.woff2
copy architects-daughter  architects-daughter-latin-400-normal.woff2
echo "Done."
