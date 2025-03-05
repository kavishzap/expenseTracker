import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gdfktcefwovujzsbrjpq.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZmt0Y2Vmd292dWp6c2JyanBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMjM1MjMsImV4cCI6MjA1NjY5OTUyM30.z4BdIY-dM4eynIKbg2cFj8GJSt0DP3FMKR9M7wWyc9I"; // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
