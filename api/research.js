import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { data } = await supabase.from('research').select('*')
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { title, year, scope, status } = req.body
    await supabase.from('research').insert([{ title, year, scope, status }])
    return res.status(200).json({ success: true })
  }
}
