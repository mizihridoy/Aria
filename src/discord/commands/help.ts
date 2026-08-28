import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../types/command.js';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Learn how to interact with Aria and discover her capabilities'),

  async execute(interaction: ChatInputCommandInteraction) {
    // Acknowledge interaction immediately to prevent 3-second Discord timeout
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const helpMessage = `
# 🌸 Hello! I'm Aria

I'm a modern AI agent built natively for Discord. I'm here to understand your community, help out with conversations, remember useful context, and assist with gaming, questions, and server needs!

---

### 💬 How to Chat With Me
* **Direct Mention**: Mention me with \`@Aria\` anywhere I have access.
* **Replies**: Reply directly to any of my messages to continue our conversation.
* **Image & Screenshot Analysis**: Attach or drop any Clash base screenshot or game result and mention me!
* **Auto Channels**: Server admins can set up designated channels where I automatically participate.
* **Slash Command**: Use \`/aria prompt:<your message>\` to ask a question privately or publicly.

---

### ⚔️ Clash of Clans Strategy Engine
* \`/clash strategy [th] [name]\` — View meta attack strategies, army compositions, and execution plans.
* \`/clash equipment [hero] [name]\` — Inspect Hero Equipment stats and top synergy combos.
* \`/clash townhall th:<12-17>\` — View Town Hall upgrade priority paths and key defense counters.

---

### 📚 Knowledge Base & Rules
* \`/knowledge add\` — Add server guides, tournament rules, or FAQs (supports text file uploads!).
* \`/knowledge list\` — List all stored knowledge articles in the server.
* \`/knowledge search query:<text>\` — Test semantic search on server documentation.

---

### 🧠 Memory & Privacy
* \`/memory list\` — View what I remember about you in this server.
* \`/memory forget id:<ID>\` — Delete a specific memory.
* \`/memory forget-all\` — Wipe all your memories in this server.

---

### ⚙️ Server Configuration *(Admins Only)*
* \`/config channels add/remove/list\` — Manage auto-chat channels.
* \`/config personality\` — Give me server-specific personality instructions.

*Feel free to talk to me anytime!* ✨
`;

    await interaction.editReply({
      content: helpMessage.trim(),
    });
  },
};
