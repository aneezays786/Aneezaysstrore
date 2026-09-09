import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const SUPABASE_URL='YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY';
export const supabase=(SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY!=='YOUR_SUPABASE_ANON_KEY')?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
