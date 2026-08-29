#!/bin/bash
# ================================================
# Aria — One-Command Update Script
# Run this on your Oracle server to update Aria
# Usage: ./update.sh
# ================================================

echo "🌸 Updating Aria..."

# Pull latest code from GitHub
git pull origin main

# Install any new dependencies
npm ci

# Rebuild TypeScript
npm run build

# Restart Aria via PM2
pm2 restart aria-bot

echo "✅ Aria updated and restarted!"
pm2 status aria-bot
