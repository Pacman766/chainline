#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "=== Payload Start — Init ==="
echo "Directory: $(pwd)"
echo ""

# ── 1. Install dependencies ────────────────────────────────────────────────
echo ">>> Installing dependencies..."
npm install
echo ""

# ── 2. Lint ───────────────────────────────────────────────────────────────
echo ">>> Running lint..."
npm run lint
echo ""

# ── 3. Integration tests ──────────────────────────────────────────────────
echo ">>> Running integration tests..."
npm run test:int
echo ""

# ── 4. Build (disabled — slow, enable manually when needed) ───────────────
# echo ">>> Building..."
# npm run build
# echo ""

echo "=== Init complete. All checks passed. ==="
echo ""
echo "Next: npm run dev"
