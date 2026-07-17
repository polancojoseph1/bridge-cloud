#!/bin/bash
find src -type f -name "*.tsx" -exec grep -n "<button" {} /dev/null \;
