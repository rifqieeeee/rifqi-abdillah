import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {

  // READ
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .order('year', { ascending: false })

    if (error) return res.status(500).json(error)
    return res.status(200).json(data)
  }

  // CREATE
  if (req.method === 'POST') {
    const { title, year, scope, status, description, role, funding, output } = req.body

    const { error } = await supabase.from('research').insert([{
      title, year, scope, status, description, role, funding, output
    }])

    if (error) return res.status(500).json(error)
    return res.status(200).json({ success: true })
  }

  // UPDATE
  if (req.method === 'PUT') {
    const { id, ...payload } = req.body

    const { error } = await supabase
      .from('research')
      .update(payload)
      .eq('id', id)

    if (error) return res.status(500).json(error)
    return res.status(200).json({ success: true })
  }

  // DELETE
  if (req.method === 'DELETE') {
    const { id } = req.body

    const { error } = await supabase
      .from('research')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json(error)
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
