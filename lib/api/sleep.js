import { query, add, callFunction } from '../cloud'
import { _ } from '../cloud'

export const sleepApi = {
  async list(babyId, { limit = 20, days = 7 } = {}) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    return await query('sleep_records', {
      filter: { baby_id: babyId, start_time: _.gte(since.toISOString()) },
      orderBy: { field: 'start_time', direction: 'desc' },
      limit
    })
  },

  async create(data) {
    return await add('sleep_records', data)
  },

  async weeklyStats(babyId) {
    return await callFunction('getWeeklyStats', { babyId, type: 'sleep' })
  }
}
