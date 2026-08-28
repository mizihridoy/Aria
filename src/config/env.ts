import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Discord Configuration
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  DISCORD_DEV_GUILD_ID: z.string().optional(),

  // AI Provider Keys
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, 'GOOGLE_GENERATIVE_AI_API_KEY is required for primary intelligence'),
  GROQ_API_KEY: z.string().optional(),

  // Model Defaults
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
  GROQ_MODEL: z.string().default('qwen/qwen3.8-27b'),
  EMBEDDING_MODEL: z.string().default('gemini-embedding-001'),

  // Supabase Configuration
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required for backend database access'),

  // Clash of Clans Official API
  COC_API_TOKEN: z.string().optional(),
  COC_API_BASE_URL: z.string().default('https://api.clashofclans.com/v1'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    for (const error of result.error.errors) {
      console.error(`  - ${error.path.join('.')}: ${error.message}`);
    }
    console.error('\nPlease check your .env file against .env.example');
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
