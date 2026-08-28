# 🌸 Aria — 24/7 Cloud Deployment Guide

This guide covers how to deploy **Aria** so she stays online in your Discord server 24/7 without needing your personal computer running.

---

## 📋 Required Environment Variables

Before deploying, ensure you have these values ready:

| Variable | Description | Source |
|---|---|---|
| `DISCORD_TOKEN` | Discord Bot Token | [Discord Developer Portal](https://discord.com/developers/applications) $\rightarrow$ Bot $\rightarrow$ Reset Token |
| `DISCORD_CLIENT_ID` | Discord Application ID | [Discord Developer Portal](https://discord.com/developers/applications) $\rightarrow$ General Info |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API Key (Vision & Fallback) | [Google AI Studio](https://aistudio.google.com/) |
| `GROQ_API_KEY` | Groq API Key (Fast Tool Reasoning) | [Groq Console](https://console.groq.com/) |
| `SUPABASE_URL` | Supabase Project URL | [Supabase Dashboard](https://supabase.com/dashboard) $\rightarrow$ Project Settings $\rightarrow$ API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret | [Supabase Dashboard](https://supabase.com/dashboard) $\rightarrow$ Project Settings $\rightarrow$ API |
| `COC_API_TOKEN` *(Optional)* | Supercell Clash of Clans API Token | [Supercell Dev Portal](https://developer.clashofclans.com/) |

---

## Option 1: Railway (Recommended — Easiest 1-Click Setup)

Railway provides seamless 24/7 hosting with automatic Git deployments:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Aria AI Discord Bot"
   git remote add origin https://github.com/your-username/Aria.git
   git push -u origin main
   ```
2. **Deploy on Railway**:
   - Go to [Railway.app](https://railway.app/) and sign in with GitHub.
   - Click **New Project** $\rightarrow$ **Deploy from GitHub repo** $\rightarrow$ Select `Aria`.
3. **Configure Environment Variables**:
   - In Railway dashboard, open your project $\rightarrow$ **Variables** tab.
   - Click **Raw Editor** and paste the contents of your `.env` file (never commit your real `.env` to GitHub!).
4. **Deploy**:
   - Railway will automatically detect the `Dockerfile`, build the TypeScript app, and keep Aria running 24/7!

---

## Option 2: VPS / Linux Server (Docker Compose)

If you have a Linux VPS (Ubuntu / Debian / DigitalOcean / Hetzner):

1. **Clone the repository onto your server**:
   ```bash
   git clone https://github.com/your-username/Aria.git /opt/aria
   cd /opt/aria
   ```
2. **Create the `.env` file**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   *(Paste your real API keys and tokens)*

3. **Start with Docker Compose**:
   ```bash
   docker compose up -d --build
   ```

4. **Monitor Logs**:
   ```bash
   docker compose logs -f aria
   ```

5. **Stop / Restart**:
   ```bash
   docker compose restart
   docker compose down
   ```

---

## Option 3: VPS with PM2 (Without Docker)

1. **Install Node.js 20 & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Build and Launch**:
   ```bash
   cd /opt/aria
   npm ci
   npm run build
   pm2 start dist/index.js --name "aria-bot"
   pm2 save
   pm2 startup
   ```

3. **Useful PM2 Commands**:
   - `pm2 logs aria-bot` — View live Discord bot logs.
   - `pm2 restart aria-bot` — Restart the bot.
   - `pm2 status` — Check uptime and memory usage.

---

## 🔑 Setting Up Supercell API Token on Cloud Hosts

The Supercell Developer Portal requires whitelisting your server's **Public IPv4 address**:

1. Log in to [https://developer.clashofclans.com/](https://developer.clashofclans.com/).
2. Click **Create New Key**.
3. Under **Allowed IP Addresses**:
   - For a **VPS**: Enter your VPS public IP address (run `curl ifconfig.me` on the server).
   - For **Railway / Dynamic IP Clouds**: You can create keys for any static egress IP or proxy.
4. Copy the generated Key into `COC_API_TOKEN` in your environment variables.

---

## 🩺 Health Check & Verification

Once deployed, check your server channel `#aria-test`:
- Type `hey` or `@Ariaa` to confirm she greets you instantly.
- Type `/clash strategy th:18` or `/clash hero name:Dragon Duke` to verify Clash features.
- Type `/clash player tag:#9V8LLQP` to verify live Supercell API integration.
