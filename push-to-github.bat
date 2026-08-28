@echo off
echo === Setting up Aria for GitHub ===

git init
git config user.email "abdullahalharunhridoy@gmail.com"
git config user.name "mizihridoy"

git add .

git commit -m "feat: Aria - Discord AI Agent with Clash of Clans integration"

git branch -M main

git remote add origin https://github.com/mizihridoy/Aria.git

echo === Pushing to GitHub ===
git push -u origin main

echo.
echo === Done! Check https://github.com/mizihridoy/Aria ===
pause
