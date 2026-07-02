#!/bin/bash
mkdir -p /home/jules/verification
kill $(lsof -t -i:3000) 2>/dev/null || true
pnpm run dev > /home/jules/verification/dev_server.log 2>&1 &
