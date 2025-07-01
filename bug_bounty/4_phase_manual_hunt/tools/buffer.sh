#!/bin/bash

# Usage: ./buffer.sh <length> [char]
# Example: ./buffer.sh 1000 A

LENGTH=$1
CHAR=${2:-A}

# Repeat the character exactly LENGTH times
printf "%${LENGTH}s" | tr ' ' "$CHAR"
echo

