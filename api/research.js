export default function handler(req, res) {
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL,
    serviceKeyLoaded: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  })
}