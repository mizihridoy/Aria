# 🌸 Aria — Modern AI Agent for Discord

Aria is a **powerful, context-aware AI agent** built with TypeScript and designed to live naturally inside Discord communities. Unlike traditional prefix-based bots, Aria integrates seamlessly into Discord's native environment, understanding context, remembering users, and reasoning through multi-step tasks autonomously.

Built with production-grade architecture, Aria powers AI interactions through a **modular engine**, **dynamic memory system**, and **multi-provider AI support** (Google Gemini & Groq LLaMA), making it an ideal foundation for AI-enhanced Discord communities.

---

## ✨ Core Features

### 🤖 **Intelligent AI Engine**
* **Provider-Agnostic Architecture**: Powered by Google Gemini 3.6 Flash with automatic intelligent fallback to Groq (LLaMA 3.3)
* **Multi-Step Agent Reasoning**: Aria autonomously executes complex reasoning cycles with tool support (up to 3 steps)
* **Vision Capabilities**: Native image/screenshot analysis powered by Gemini's multimodal vision
* **Smart Tool Orchestration**: Automatically selects and executes tools based on context (memory lookup, knowledge search, Discord inspection)
* **Silent Decision Mode**: Intelligently decides when NOT to respond in active channels to avoid spam

### 💾 **Dynamic Memory System**
* **User-Level Memories**: Stores personal details, gaming profiles (e.g., Clash of Clans IGN, Town Hall level), preferences, and conversation context
* **Server-Wide Knowledge**: Retains guild-specific context, tournament guidelines, community rules, and shared facts
* **Vector-Powered Search**: Uses `pgvector` for semantic similarity search across memories
* **Privacy-First Controls**:
  - `/memory list` — View all stored memories
  - `/memory forget id:[ID]` — Delete specific memories
  - `/memory forget-all` — Completely wipe your data

### 📚 **Semantic Knowledge Base**
* **Per-Server FAQ & Guides**: Vector-indexed knowledge base for rules, FAQs, strategy guides, and documentation
* **Semantic Search**: Natural language queries that find relevant knowledge even with loose phrasing
* **Easy Management**: Add, update, and search knowledge without SQL

### 🎙️ **Natural Discord Integration**
* **Multiple Interaction Methods**:
  - Direct `@Aria` mentions
  - Reply-based conversations
  - Slash commands (`/aria prompt:[text]`)
  - Configurable auto-chat channels
* **Adaptive Behavior**: Responds contextually in mentions and replies, stays silent in other channels to avoid spam
* **Message Content Intent**: Full access to message history and context

### 🗄️ **Production-Grade Database**
* **Supabase PostgreSQL**: Multi-tenant architecture with soft deletes and connection pooling
* **Vector Extensions**: `pgvector` integration for semantic memory search
* **Clean Schema**: Organized tables for guilds, users, memories, knowledge, and conversation logs

### ⚡ **Advanced Features**
* **Rate Limit Handling**: Smart retry logic with backoff for API rate limits
* **Server Personality**: Set custom personality instructions per server (`/config personality`)
* **Auto-Chat Channels**: Designate specific channels for autonomous Aria responses
* **Conversation Context**: Maintains channel-level context for coherent multi-turn interactions
* **Error Recovery**: Graceful fallback mechanisms across AI providers

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js 20+ LTS** (TypeScript runtime via tsx)
- **Discord Bot Application** with `Message Content Intent` enabled in [Developer Portal](https://discord.com/developers/applications)
- **Supabase Project** (free tier with PostgreSQL works great)
- **Google Generative AI API Key** from [Google AI Studio](https://aistudio.google.com/)
- *(Optional)* **Groq API Key** from [Groq Console](https://console.groq.com/) for fallback model

### 2. Installation

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/mizihridoy/Aria.git
   cd Aria
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Fill in your `.env` file:
   ```env
   # Discord Bot
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_DEV_GUILD_ID=your_testing_server_id_here  # Optional: for instant slash command deployment

   # AI Providers
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here  # Optional: fallback provider

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 3. Database Setup (Supabase)

Execute these SQL migration scripts in order via **Supabase SQL Editor**:

1. **`supabase/migrations/00001_initial_schema.sql`** — Guild settings, permissions
2. **`supabase/migrations/00002_memory_system.sql`** — User/server memories, vector search
3. **`supabase/migrations/00003_knowledge_system.sql`** — Knowledge base & FAQ
4. **`supabase/migrations/00004_conversation_log.sql`** — Channel context logging

### 4. Running Aria

**Development Mode** (with live reload):
```bash
npm run dev
```

**Deploy Slash Commands** (register commands with Discord):
```bash
npm run deploy:commands
```

**Production** (TypeScript build & run):
```bash
npm run build
npm start
```

---

## 🎮 Available Commands

| Command | Description | Permission |
|---------|-------------|-----------|
| `/aria prompt:[text] secret:[bool]` | Directly query Aria (public or ephemeral) | Everyone |
| `/memory list` | View your stored memories in this server | Everyone |
| `/memory forget id:[ID]` | Delete a specific memory | Everyone |
| `/memory forget-all` | Wipe all your memories in this server | Everyone |
| `/config channels add [channel]` | Enable Aria auto-chat in a channel | Admin / Manage Server |
| `/config channels remove [channel]` | Disable Aria auto-chat | Admin / Manage Server |
| `/config channels list` | Show all active auto-chat channels | Admin / Manage Server |
| `/config personality [prompt]` | Set server-specific personality instructions | Admin / Manage Server |
| `/help` | View Aria's capabilities and usage | Everyone |

---

## 📁 Project Architecture

```
src/
├── core/                      # Aria AI Engine (decoupled from Discord)
│   ├── engine.ts              # Main agent loop with multi-step reasoning
│   ├── personality/           # System prompt builder & Aria identity
│   ├── providers/             # Gemini & Groq adapters with fallback logic
│   ├── tools/                 # Memory lookup, knowledge search, Discord inspection
│   ├── context/               # Context assembly (history, memories, knowledge)
│   └── types.ts               # Core TypeScript interfaces
├── discord/                   # Discord.js Integration Layer
│   ├── client.ts              # Extended Discord client with intents
│   ├── pipeline/              # Message intake, response gate, chunked responder
│   ├── commands/              # Slash command definitions & deployer
│   └── events/                # Gateway listeners (ready, messageCreate, interactionCreate)
├── memory/                    # Dynamic memory & vector embeddings
│   ├── storage.ts             # Memory persistence
│   └── embedding.ts           # Vector embedding logic
├── knowledge/                 # Knowledge base & semantic search
│   ├── storage.ts             # Knowledge entry storage
│   └── search.ts              # Semantic search via pgvector
├── database/                  # Supabase Client & Repositories
│   ├── client.ts              # Supabase initialization
│   └── repositories/          # Data access layer (scoped by entity)
├── services/                  # Shared services
│   ├── logger.ts              # Pino logging setup
│   └── error-handling.ts      # Custom error classes
└── utils/                     # Helpers & utilities
```

### Key Architectural Patterns

- **Decoupled AI Engine**: `src/core/` is completely independent of Discord, allowing reuse in other platforms
- **Repository Pattern**: Database operations use scoped repositories for clean data access
- **Provider Registry**: Pluggable AI model support with fallback chains
- **Tool Registry**: Extensible tool system for agent reasoning
- **Event-Driven**: Discord.js event listeners trigger pipeline stages

---

## 🔧 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20+ LTS, TypeScript |
| **Discord** | discord.js 14.18.0 |
| **AI Providers** | Google Gemini (AI SDK), Groq LLaMA (AI SDK) |
| **Database** | Supabase PostgreSQL with pgvector |
| **Logging** | Pino + Pino Pretty |
| **Validation** | Zod |
| **Build** | tsc (TypeScript Compiler) |

---

## 📊 Performance & Reliability

- **Rate Limit Smart Retry**: Automatic backoff (2.5s) on HTTP 429 responses
- **Provider Failover**: Seamless fallback from Gemini to Groq if primary fails
- **Connection Pooling**: Supabase connection pooling for database efficiency
- **Structured Logging**: Pino-based logging for debugging and monitoring
- **Type Safety**: Full TypeScript coverage for compile-time error detection

---

## 🛡️ Privacy & Security

- **Service Role Keys**: Supabase authentication via service role (never expose)
- **User Data Control**: Users can inspect and delete their memories anytime
- **Soft Deletes**: Data is logically deleted but retainable for compliance
- **Per-Guild Isolation**: Each server's data is completely isolated
- **No API Key Leaks**: All sensitive keys stored in `.env` and never committed

---

## 🚀 Deployment

### Self-Hosted
```bash
# Build for production
npm run build

# Run the bot
npm start
```

### Docker (example)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Environment Variables (Production)
Ensure all `.env` variables are set in your hosting platform:
- Railway, Render, Heroku, or any Node.js-compatible host
- Use `npm run build && npm start` for the start command

---

## 📝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** — see the LICENSE file for details.

---

## 💡 Tips & Tricks

- **Memory Persistence**: Aria automatically stores user and server data across sessions
- **Custom Personalities**: Use `/config personality` to give Aria a unique voice per server
- **Knowledge Seeding**: Pre-populate your knowledge base with FAQs before launch
- **Rate Limits**: For high-volume servers, monitor Groq/Gemini quotas and adjust models
- **Dev Guild ID**: Set `DISCORD_DEV_GUILD_ID` in `.env` for instant command testing (no 1-hour cache)

---

## 🤝 Support

For issues, questions, or feature requests:
- 📧 Open an issue on [GitHub Issues](https://github.com/mizihridoy/Aria/issues)
- 💬 Reach out via Discord

---

**Made with ❤️ by Hridoy**
