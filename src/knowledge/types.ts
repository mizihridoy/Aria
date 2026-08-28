export interface KnowledgeItem {
  id?: number;
  guildId: string;
  title: string;
  content: string;
  category: 'faq' | 'rules' | 'guide' | 'lore' | 'custom' | 'tournament';
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdBy?: string | null;
  createdAt?: string;
  similarity?: number;
}
