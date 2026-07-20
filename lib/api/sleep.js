import { query, add } from '../cloud'

export const sleepApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const records = await query('sleep_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'start_time', direction: 'desc' },
      limit: 100
    })
    return records.filter(r => new Date(r.start_time) >= since).slice(0, limit)
  },

  async create(data) {
    return await add('sleep_records', data)
  },

  async weeklyStats(babyId) {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const records = await query('sleep_records', {
      filter: { baby_id: babyId },
      limit: 200
    })
    const filtered = records.filter(r => new Date(r.start_time) >= weekAgo)
    const totalMin = filtered.reduce((s, r) => s + (r.duration_min || 0), 0)
    const totalWakes = filtered.reduce((s, r) => s + (r.wake_count || 0), 0)
    return { totalMin, dailyAvg: +(totalMin / 7).toFixed(1), totalWakes, count: filtered.length }
  }
}
