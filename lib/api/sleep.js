import { supabase } from '../supabase'

export const sleepApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date(); since.setDate(since.getDate() - days)
    return await supabase.from('sleep_records')
      .select('*').eq('baby_id', babyId)
      .gte('start_time', since.toISOString())
      .order('start_time', { ascending: false }).limit(limit).all()
  },

  async create(data) {
    return await supabase.from('sleep_records').insert(data)
  },

  async weeklyStats(babyId) {
    const since = new Date(); since.setDate(since.getDate() - 7)
    const records = await supabase.from('sleep_records')
      .select('duration_min, wake_count, start_time').eq('baby_id', babyId)
      .gte('start_time', since.toISOString()).all()
    const total = records.reduce((s, r) => s + (r.duration_min || 0), 0)
    const totalWakes = records.reduce((s, r) => s + (r.wake_count || 0), 0)
    return { totalMin: total, dailyAvg: +(total / 7).toFixed(1), totalWakes, count: records.length }
  }
}
