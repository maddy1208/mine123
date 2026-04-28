#!/bin/bash
# install.sh — FreelanceAI installer
set -e
echo "=========================================="
echo "      FreelanceAI — Installing"
echo "=========================================="
echo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
if ! command -v python3 &>/dev/null; then
    echo "ERROR: Python 3 not found."
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip"
    exit 1
fi
echo "✓ Python: $(python3 --version)"
echo "Installing packages..."
python3 -m pip install flask requests -q
echo "✓ Packages installed."
mkdir -p data
chmod +x crakup.sh 2>/dev/null || true
echo
echo "=========================================="
echo "  Done! Run: bash crakup.sh to launch"
echo "=========================================="
