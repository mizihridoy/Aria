import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import type { Database } from '../types/database.types.js';
import { createChildLogger } from '../services/logger.js';

const log = createChildLogger('supabase-client');

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: { 'x-application-name': 'aria-discord-agent' },
    },
  }
);

log.info('Supabase database client initialized');
