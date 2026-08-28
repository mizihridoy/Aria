export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      guilds: {
        Row: {
          id: string;
          name: string;
          icon_hash: string | null;
          owner_id: string | null;
          joined_at: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          icon_hash?: string | null;
          owner_id?: string | null;
          joined_at?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon_hash?: string | null;
          owner_id?: string | null;
          joined_at?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guild_settings: {
        Row: {
          guild_id: string;
          ai_channels: string[];
          personality_notes: string | null;
          auto_respond_enabled: boolean;
          memory_enabled: boolean;
          knowledge_enabled: boolean;
          features: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          guild_id: string;
          ai_channels?: string[];
          personality_notes?: string | null;
          auto_respond_enabled?: boolean;
          memory_enabled?: boolean;
          knowledge_enabled?: boolean;
          features?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          guild_id?: string;
          ai_channels?: string[];
          personality_notes?: string | null;
          auto_respond_enabled?: boolean;
          memory_enabled?: boolean;
          knowledge_enabled?: boolean;
          features?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      memories: {
        Row: {
          id: number;
          guild_id: string;
          user_id: string | null;
          content: string;
          category: string;
          confidence: number;
          embedding: string | null;
          metadata: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          guild_id: string;
          user_id?: string | null;
          content: string;
          category?: string;
          confidence?: number;
          embedding?: string | null;
          metadata?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          guild_id?: string;
          user_id?: string | null;
          content?: string;
          category?: string;
          confidence?: number;
          embedding?: string | null;
          metadata?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_entries: {
        Row: {
          id: number;
          guild_id: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          embedding: string | null;
          metadata: Json;
          created_by: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          guild_id: string;
          title: string;
          content: string;
          category?: string;
          tags?: string[];
          embedding?: string | null;
          metadata?: Json;
          created_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          guild_id?: string;
          title?: string;
          content?: string;
          category?: string;
          tags?: string[];
          embedding?: string | null;
          metadata?: Json;
          created_by?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversation_messages: {
        Row: {
          id: number;
          guild_id: string;
          channel_id: string;
          message_id: string;
          user_id: string;
          user_name: string;
          content: string;
          is_aria: boolean;
          reply_to_message_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          guild_id: string;
          channel_id: string;
          message_id: string;
          user_id: string;
          user_name: string;
          content: string;
          is_aria?: boolean;
          reply_to_message_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          guild_id?: string;
          channel_id?: string;
          message_id?: string;
          user_id?: string;
          user_name?: string;
          content?: string;
          is_aria?: boolean;
          reply_to_message_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      clash_strategies: {
        Row: {
          id: number;
          town_hall: number;
          name: string;
          archetype: string;
          army_composition: Json;
          hero_equipment: Json;
          execution_guide: string;
          strengths: string[];
          weaknesses: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          town_hall: number;
          name: string;
          archetype: string;
          army_composition?: Json;
          hero_equipment?: Json;
          execution_guide: string;
          strengths?: string[];
          weaknesses?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          town_hall?: number;
          name?: string;
          archetype?: string;
          army_composition?: Json;
          hero_equipment?: Json;
          execution_guide?: string;
          strengths?: string[];
          weaknesses?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      hero_equipment: {
        Row: {
          id: number;
          hero: string;
          name: string;
          rarity: string;
          synergy_pairs: Json;
          recommended_armies: string[];
          description: string;
          best_playstyles: string[];
          created_at: string;
        };
        Insert: {
          id?: number;
          hero: string;
          name: string;
          rarity: string;
          synergy_pairs?: Json;
          recommended_armies?: string[];
          description: string;
          best_playstyles?: string[];
          created_at?: string;
        };
        Update: {
          id?: number;
          hero?: string;
          name?: string;
          rarity?: string;
          synergy_pairs?: Json;
          recommended_armies?: string[];
          description?: string;
          best_playstyles?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      town_hall_guides: {
        Row: {
          town_hall: number;
          theme: string;
          key_defenses: string[];
          offense_upgrade_priority: string[];
          defense_upgrade_priority: string[];
          hero_priorities: string[];
          notes: string;
          created_at: string;
        };
        Insert: {
          town_hall: number;
          theme: string;
          key_defenses?: string[];
          offense_upgrade_priority?: string[];
          defense_upgrade_priority?: string[];
          hero_priorities?: string[];
          notes: string;
          created_at?: string;
        };
        Update: {
          town_hall?: number;
          theme?: string;
          key_defenses?: string[];
          offense_upgrade_priority?: string[];
          defense_upgrade_priority?: string[];
          hero_priorities?: string[];
          notes?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_guild_memories: {
        Args: {
          query_embedding: string;
          filter_guild_id: string;
          filter_user_id?: string | null;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: number;
          guild_id: string;
          user_id: string | null;
          content: string;
          category: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_guild_knowledge: {
        Args: {
          query_embedding: string;
          filter_guild_id: string;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: number;
          guild_id: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
