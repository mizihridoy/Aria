import {
  SlashCommandBuilder,
  MessageFlags,
  type ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../types/command.js';
import { KnowledgeManager } from '../../knowledge/manager.js';
import { isGuildAdmin } from '../utils/permissions.js';
import { createChildLogger } from '../../services/logger.js';

const log = createChildLogger('command-knowledge');

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('knowledge')
    .setDescription('Manage the server knowledge base, FAQs, guides, and rules')
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Add a new article, FAQ, guide, or tournament rule to the knowledge base')
        .addStringOption(opt =>
          opt
            .setName('title')
            .setDescription('Title of the knowledge entry (e.g. "Clan War Rules", "Hydra Attack Guide")')
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName('category')
            .setDescription('Category of the knowledge entry')
            .setRequired(true)
            .addChoices(
              { name: 'FAQ', value: 'faq' },
              { name: 'Server Rules', value: 'rules' },
              { name: 'Guide / Strategy', value: 'guide' },
              { name: 'Tournament / League', value: 'tournament' },
              { name: 'Clan Lore / Info', value: 'lore' },
              { name: 'Custom', value: 'custom' }
            )
        )
        .addStringOption(opt =>
          opt
            .setName('content')
            .setDescription('The full text content of the entry (or upload a text/markdown file below)')
            .setRequired(false)
        )
        .addAttachmentOption(opt =>
          opt
            .setName('file')
            .setDescription('Optional text or markdown file (.txt, .md) to ingest as content')
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt
            .setName('tags')
            .setDescription('Comma-separated keywords (e.g. "cwl, lineup, th15")')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('List stored knowledge entries in this server')
        .addStringOption(opt =>
          opt
            .setName('category')
            .setDescription('Filter by category')
            .setRequired(false)
            .addChoices(
              { name: 'FAQ', value: 'faq' },
              { name: 'Server Rules', value: 'rules' },
              { name: 'Guide / Strategy', value: 'guide' },
              { name: 'Tournament / League', value: 'tournament' },
              { name: 'Clan Lore / Info', value: 'lore' },
              { name: 'Custom', value: 'custom' }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('search')
        .setDescription('Test semantic search on the server knowledge base')
        .addStringOption(opt =>
          opt
            .setName('query')
            .setDescription('The search terms or question to test')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('delete')
        .setDescription('Delete a knowledge entry by ID (Admin only)')
        .addIntegerOption(opt =>
          opt
            .setName('id')
            .setDescription('The ID number of the entry (found in /knowledge list)')
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'The `/knowledge` command is only available inside servers.',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    // Immediately defer reply to avoid Discord interaction timeout
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    try {
      // 1. ADD ENTRY
      if (subcommand === 'add') {
        if (!isGuildAdmin(interaction)) {
          await interaction.editReply({
            content: '⚠️ You need `Manage Server` or `Administrator` permissions to add knowledge entries.',
          });
          return;
        }

        const title = interaction.options.getString('title', true);
        const category = interaction.options.getString('category', true) as any;
        let content = interaction.options.getString('content') || '';
        const attachment = interaction.options.getAttachment('file');
        const tagsRaw = interaction.options.getString('tags') || '';
        const tags = tagsRaw
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0);

        // If file attachment provided, read text
        if (attachment) {
          try {
            const response = await fetch(attachment.url);
            const fileText = await response.text();
            content = content.length > 0 ? `${content}\n\n${fileText}` : fileText;
          } catch (fileErr) {
            log.error({ fileErr, url: attachment.url }, 'Failed to fetch attached knowledge file');
            await interaction.editReply({
              content: '❌ Failed to read the attached file. Please check the file format and try again.',
            });
            return;
          }
        }

        if (!content || content.trim().length === 0) {
          await interaction.editReply({
            content: '⚠️ Please provide either text `content` or attach a text file.',
          });
          return;
        }

        const saved = await KnowledgeManager.addKnowledge({
          guildId,
          title,
          content,
          category,
          tags,
          createdBy: userId,
        });

        if (saved) {
          await interaction.editReply({
            content: `📚 **Successfully added knowledge entry!**\n• **ID**: \`#${saved.id}\`\n• **Title**: **${title}**\n• **Category**: \`${category}\`\n• **Tags**: ${tags.length > 0 ? tags.map(t => `\`${t}\``).join(', ') : '_none_'}\n\nAria will now use this context to answer questions from your members! ✨`,
          });
        } else {
          await interaction.editReply({
            content: '❌ Failed to save knowledge entry into the database. Please try again.',
          });
        }
        return;
      }

      // 2. LIST ENTRIES
      if (subcommand === 'list') {
        const categoryFilter = interaction.options.getString('category') || undefined;
        const entries = await KnowledgeManager.listKnowledge(guildId, categoryFilter);

        if (entries.length === 0) {
          await interaction.editReply({
            content: `ℹ️ No knowledge entries found${categoryFilter ? ` in category \`${categoryFilter}\`` : ''}. Admins can add one using \`/knowledge add\`!`,
          });
          return;
        }

        let reply = `### 📚 Knowledge Base for **${interaction.guild.name}**:\n\n`;
        for (const e of entries) {
          const snippet = e.content.length > 80 ? `${e.content.slice(0, 80)}...` : e.content;
          reply += `• **[#${e.id}]** \`${e.category.toUpperCase()}\` **${e.title}**\n  _${snippet}_\n`;
        }
        reply += `\n*Search semantically with \`/knowledge search query:<text>\`*`;

        await interaction.editReply({ content: reply });
        return;
      }

      // 3. SEMANTIC SEARCH
      if (subcommand === 'search') {
        const query = interaction.options.getString('query', true);
        const matches = await KnowledgeManager.searchKnowledge(query, guildId, 3);

        if (matches.length === 0) {
          await interaction.editReply({
            content: `🔍 No matching knowledge entries found for query: "${query}".`,
          });
          return;
        }

        let reply = `### 🔍 Semantic Search Results for "${query}":\n\n`;
        for (const m of matches) {
          const similarityPct = Math.round((m.similarity || 0) * 100);
          reply += `• **[#${m.id}] ${m.title}** (\`${m.category}\` • ~${similarityPct}% match)\n> ${m.content.slice(0, 150)}...\n\n`;
        }

        await interaction.editReply({ content: reply.trim() });
        return;
      }

      // 4. DELETE ENTRY
      if (subcommand === 'delete') {
        if (!isGuildAdmin(interaction)) {
          await interaction.editReply({
            content: '⚠️ You need `Manage Server` or `Administrator` permissions to delete knowledge entries.',
          });
          return;
        }

        const targetId = interaction.options.getInteger('id', true);
        const deleted = await KnowledgeManager.deleteKnowledge(targetId, guildId);

        if (deleted) {
          await interaction.editReply({
            content: `🗑️ Successfully deleted knowledge entry **#${targetId}**!`,
          });
        } else {
          await interaction.editReply({
            content: `⚠️ Could not find active knowledge entry with ID **#${targetId}**.`,
          });
        }
        return;
      }
    } catch (error) {
      log.error({ error, subcommand, guildId }, 'Error executing /knowledge command');
      await interaction.editReply({
        content: 'An error occurred while managing the knowledge base.',
      });
    }
  },
};
