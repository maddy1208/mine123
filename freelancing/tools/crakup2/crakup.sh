#!/bin/bash
# crakup.sh — FreelanceAI launcher
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "⚡ FreelanceAI starting..."
echo "   Open: http://localhost:5000"
echo "   Make sure Ollama is running in another terminal: ollama serve"
echo
(sleep 1.5 && xdg-open http://localhost:5000 2>/dev/null || open http://localhost:5000 2>/dev/null) &
python3 server.py
