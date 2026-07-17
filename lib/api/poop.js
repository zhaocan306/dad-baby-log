import { query, add, callFunction } from '../cloud'
import { _ } from '../cloud'

export const poopApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    return await query('poop_records', {
      filter: { baby_id: babyId, created_at: _.gte(since) },
      orderBy: { field: 'created_at', direction: 'desc' },
      limit
    })
  },

  async create(data) {
    return await add('poop_records', data)
  },

  async weeklyStats(babyId) {
    return await callFunction('getWeeklyStats', { babyId, type: 'poop' })
  }
}
