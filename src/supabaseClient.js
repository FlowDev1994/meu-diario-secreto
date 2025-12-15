import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zphiyztusnvhdvqsdtsw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwaGl5enR1c252aGR2cXNkdHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTE0MTUsImV4cCI6MjA4MTM4NzQxNX0.VlPTRoqRsTewTUNHi_8kLB0NJBXvPHYYK0Gco_rxdwg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


