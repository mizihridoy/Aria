# 🌸 Aria — Modern AI Agent for Discord

Aria is a modern, context-aware AI agent built from scratch for Discord communities. Rather than acting like a simple chatbot or traditional prefix bot, Aria lives naturally inside Discord — understanding who she's speaking with, maintaining long-term memory, consulting server knowledge, using tools, and making intelligent decisions (including knowing when to stay silent).

---

## ✨ Features

* **Provider-Agnostic AI Engine**: Powered by Google Gemini 2.0 Flash with automatic fallback to Groq (Llama 3.3). Easily extensible to other models and providers.
* **Autonomous Multi-Step Tool Loops**: Aria can autonomously reason, recall memories, store facts, search server knowledge, and inspect Discord context before formulating a response.
* **Dynamic Memory System**:
  * **User Memories**: Remembers personal details, gaming profiles (e.g. Clash of Clans IGN, Town Hall level), and conversation preferences.
  * **Server Memories**: Retains server-wide context, tournament guidelines, or community rules.
  * **Privacy Controls**: Users can inspect (`/memory list`), delete individual memories (`/memory forget`), or wipe all memories (`/memory forget-all`).
* **Semantic Knowledge Base**: Per-server vector search (`pgvector`) for FAQs, rules, and strategy guides.
* **Natural Discord Pipeline**:
  * Direct `@Aria` mentions & replies.
  * Configurable auto-chat channels (`/config channels add`).
  * Direct slash commands (`/aria`).
  * **Decision to Stay Silent**: Knows when not to speak in active channels to avoid spam.
* **Multi-Tenant Supabase Postgres**: Clean database schema with connection pooling, soft deletes, and vector indexing.

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js 20+ LTS**
* **A Discord Bot Application** (with `Message Content Intent` enabled in Developer Portal)
* **Supabase Project** (free tier with PostgreSQL)
* **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
* *(Optional)* **Groq API Key** for fallback (from [Groq Console](https://console.groq.com/))

---

### 2. Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Fill in your credentials in `.env`:
   ```env
   # Discord
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_DEV_GUILD_ID=your_testing_server_id_here # (Optional for instant slash commands)

   # AI Providers
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here # (Optional fallback)

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

---

### 3. Database Setup (Supabase)

Run the SQL migration scripts in your **Supabase SQL Editor** in order:
1. `supabase/migrations/00001_initial_schema.sql` (Guilds & settings)
2. `supabase/migrations/00002_memory_system.sql` (Memories & `pgvector` search)
3. `supabase/migrations/00003_knowledge_system.sql` (Knowledge base)
4. `supabase/migrations/00004_conversation_log.sql` (Channel conversation context)

---

### 4. Running Aria

* **Development Mode (with live reload):**
  ```bash
  npm run dev
  ```

* **Deploy Slash Commands:**
  ```bash
  npm run deploy:commands
  ```

* **Production Build & Run:**
  ```bash
  npm run build
  npm start
  ```

---

## 🎮 Slash Commands

| Command | Description | Permission |
| :--- | :--- | :--- |
| `/aria prompt:[text] secret:[bool]` | Directly interact with Aria (publicly or ephemeral) | Everyone |
| `/memory list` | View what Aria remembers about you in this server | Everyone |
| `/memory forget id:[ID]` | Delete a specific memory | Everyone |
| `/memory forget-all` | Wipe all your stored memories in this server | Everyone |
| `/config channels add [channel]` | Enable Aria auto-chat in a designated channel | Admin / Manage Server |
| `/config channels remove [channel]` | Remove auto-chat from a channel | Admin / Manage Server |
| `/config channels list` | List all active auto-chat channels | Admin / Manage Server |
| `/config personality [prompt]` | Set server-specific personality instructions | Admin / Manage Server |
| `/help` | Overview of Aria's capabilities and commands | Everyone |

---

## 📁 Project Architecture

```
src/
├── core/                # Aria AI Engine (Decoupled from Discord)
│   ├── engine.ts        # Agent loop with multi-step tool execution
│   ├── personality/     # System prompt & Aria identity builder
│   ├── providers/       # Gemini & Groq adapters with auto-fallback
│   ├── tools/           # Memory, knowledge, and Discord inspection tools
│   └── context/         # Context assembly (recent history, memories, knowledge)
├── discord/             # Discord.js Integration Layer
│   ├── client.ts        # Extended client with intents & partials
│   ├── pipeline/        # Intake filter, ShouldRespond gate, chunked responder
│   ├── commands/        # Slash command definitions & deployer
│   └── events/          # Gateway event listeners (ready, messageCreate, interactionCreate)
├── memory/              # Dynamic Memory & Vector Embeddings
├── knowledge/           # Server Knowledge Base & FAQ Search
├── database/            # Supabase Client & Scoped Repositories
└── config/              # Zod environment validation
```
