import { query, add } from '../cloud'

export const poopApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const records = await query('poop_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'created_at', direction: 'desc' },
      limit: 100
    })
    return records.filter(r => new Date(r.created_at) >= since).slice(0, limit)
  },

  async create(data) {
    return await add('poop_records', data)
  },

  async weeklyStats(babyId) {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const records = await query('poop_records', {
      filter: { baby_id: babyId },
      limit: 200
    })
    const filtered = records.filter(r => new Date(r.created_at) >= weekAgo)
    return { total: filtered.length }
  }
}
