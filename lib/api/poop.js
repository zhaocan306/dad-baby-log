import { supabase } from '../supabase'

export const poopApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date(); since.setDate(since.getDate() - days)
    return await supabase.from('poop_records')
      .select('*').eq('baby_id', babyId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false }).limit(limit).all()
  },

  async create(data) {
    return await supabase.from('poop_records').insert(data)
  },

  async weeklyStats(babyId) {
    const since = new Date(); since.setDate(since.getDate() - 7)
    const records = await supabase.from('poop_records')
      .select('color, amount, created_at').eq('baby_id', babyId)
      .gte('created_at', since.toISOString()).all()
    return { total: records.length, records }
  }
}
