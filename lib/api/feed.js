import { query, add, callFunction } from '../cloud'
import { _ } from '../cloud'

export const feedApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    return await query('feed_records', {
      filter: { baby_id: babyId, created_at: _.gte(since) },
      orderBy: { field: 'created_at', direction: 'desc' },
      limit
    })
  },

  async create(data) {
    return await add('feed_records', data)
  },

  async todayTotal(babyId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const records = await query('feed_records', {
      filter: { baby_id: babyId, created_at: _.gte(today) }
    })
    return records.reduce((sum, r) => sum + (r.amount_ml || 0), 0)
  },

  async weeklyStats(babyId) {
    return await callFunction('getWeeklyStats', { babyId, type: 'feed' })
  }
}
