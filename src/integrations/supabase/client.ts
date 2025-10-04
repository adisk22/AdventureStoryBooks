import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallback to hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://oatxaqvyzwylmopzjqfa.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdHhhcXZ5end5bG1vcHpqcWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDk1NzYsImV4cCI6MjA3NTEyNTU3Nn0.-BFqfEqAqT0hCAS6UZBelJUfXuRhGCmUBnrzQCUVJ-o';

// Debug: Log the connection details
console.log('🔗 Supabase Connection Details:');
console.log('URL:', SUPABASE_URL);
console.log('Key (first 20 chars):', SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + '...');
console.log('Key format valid:', SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ'));

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});