#!/usr/bin/env bash
set -euo pipefail

echo "[slack] Installing deps..."
npm install

echo "[slack] Building..."
npm run build

echo "[slack] Build finished (dist/)"
