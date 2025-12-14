import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wmxrbiwbbxjcsnhzgyic.supabase.co'
// WE USE THE ANON KEY (THE SECOND ONE)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndteHJiaXdiYnhqY3NuaHpneWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTEzMzgsImV4cCI6MjA4MDg4NzMzOH0.OEA3kkfrYGcgxF9_NZ-pMnRnAlGJV3VYPGJDZo5rR8s'

export const supabase = createClient(supabaseUrl, supabaseKey)
