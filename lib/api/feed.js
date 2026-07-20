import { query, add } from '../cloud'

export const feedApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const records = await query('feed_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'created_at', direction: 'desc' },
      limit: 100
    })
    return records.filter(r => new Date(r.created_at) >= since).slice(0, limit)
  },

  async create(data) {
    return await add('feed_records', data)
  },

  async todayTotal(babyId) {
    const today = new Date().toISOString().slice(0, 10)
    const records = await query('feed_records', {
      filter: { baby_id: babyId },
      limit: 100
    })
    return records
      .filter(r => (r.created_at || '').slice(0, 10) === today)
      .reduce((sum, r) => sum + (r.amount_ml || 0), 0)
  },

  async weeklyStats(babyId) {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const records = await query('feed_records', {
      filter: { baby_id: babyId },
      limit: 200
    })
    const filtered = records.filter(r => new Date(r.created_at) >= weekAgo)
    const total = filtered.reduce((s, r) => s + (r.amount_ml || 0), 0)
    const dailyMap = {}
    filtered.forEach(r => {
      const d = (r.created_at || '').slice(0, 10)
      if (d) dailyMap[d] = (dailyMap[d] || 0) + (r.amount_ml || 0)
    })
    return { total, dailyAvg: Math.round(total / 7), count: filtered.length, dailyMap }
  }
}
