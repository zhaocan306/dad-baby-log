import { supabase } from '../supabase'

export const feedApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    return await supabase.from('feed_records')
      .select('*').eq('baby_id', babyId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)
      .all()
  },

  async create(data) {
    return await supabase.from('feed_records').insert(data)
  },

  async todayTotal(babyId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const records = await supabase.from('feed_records')
      .select('amount_ml').eq('baby_id', babyId)
      .gte('created_at', today.toISOString())
      .all()
    return records.reduce((sum, r) => sum + (r.amount_ml || 0), 0)
  },

  async weeklyStats(babyId) {
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const records = await supabase.from('feed_records')
      .select('amount_ml, created_at').eq('baby_id', babyId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })
      .all()
    const total = records.reduce((sum, r) => sum + (r.amount_ml || 0), 0)
    const days = 7
    const dailyMap = {}
    records.forEach(r => {
      const d = r.created_at.slice(0, 10)
      dailyMap[d] = (dailyMap[d] || 0) + (r.amount_ml || 0)
    })
    return { total, dailyAvg: Math.round(total / days), count: records.length, dailyMap }
  }
}
