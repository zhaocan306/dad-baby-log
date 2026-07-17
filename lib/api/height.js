import { query, add } from '../cloud'
import { _ } from '../cloud'

export const heightApi = {
  async list(babyId, { limit = 20 } = {}) {
    return await query('height_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'date', direction: 'desc' },
      limit
    })
  },

  async create(data) {
    return await add('height_records', data)
  },

  async latest(babyId) {
    const records = await query('height_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'date', direction: 'desc' },
      limit: 1
    })
    return records[0] || null
  }
}
