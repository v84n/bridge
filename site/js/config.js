import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://icilbwqoszulckbhcptd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljaWxid3Fvc3p1bGNrYmhjcHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NjU2OTEsImV4cCI6MjA1MjA0MTY5MX0.cslP29Fj9lPwdZJ8lOAA9CCA84QzrtQYBFKgAj_Fhhk'

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase } 