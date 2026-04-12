/* ═══ Supabase Configuration ═══ */
/* This file connects your app to the Supabase backend */
/* Both the admin panel and main website use the same config */

const SUPABASE_URL = 'wkjrikgavwtmlrfalngy';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndranJpa2dhdnd0bWxyZmFsbmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTMxNTUsImV4cCI6MjA5MDg2OTE1NX0.OL9coE0rc_n0NLOm3FK6R75Cf71RL2Kulundjlf2T8w';  // ← Paste your anon/public key from Supabase Dashboard → Settings → API

// Initialize Supabase client
const supabase = window.supabase.createClient(wkjrikgavwtmlrfalngy, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndranJpa2dhdnd0bWxyZmFsbmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTMxNTUsImV4cCI6MjA5MDg2OTE1NX0.OL9coE0rc_n0NLOm3FK6R75Cf71RL2Kulundjlf2T8w);

/* ═══ HOW TO FIND YOUR ANON KEY ═══
 * 1. Go to https://supabase.com/dashboard
 * 2. Click on your project (myrfbzilwmcxupaxsing)
 * 3. Click Settings (gear icon) → API
 * 4. Copy the key under "anon" / "public"
 * 5. Paste it above replacing 'YOUR-ANON-KEY-HERE'
 */
