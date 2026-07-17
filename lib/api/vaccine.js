import { query, add, getById } from '../cloud'
import { _ } from '../cloud'

export const vaccineApi = {
  async list(babyId) {
    return await query('vaccine_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'due_date', direction: 'asc' }
    })
  },

  async milestones(babyId) {
    return await query('milestones', {
      filter: { baby_id: babyId },
      orderBy: { field: 'age_month', direction: 'asc' }
    })
  },

  async create(data) {
    return await add('vaccine_records', data)
  },

  async nextDue(babyId) {
    const records = await query('vaccine_records', {
      filter: { baby_id: babyId, status: _.in(['pending', 'booked']) },
      orderBy: { field: 'due_date', direction: 'asc' },
      limit: 1
    })
    return records[0] || null
  },

  async stats(babyId) {
    const records = await query('vaccine_records', {
      filter: { baby_id: babyId }
    })
    return {
      done: records.filter(r => r.status === 'done').length,
      booked: records.filter(r => r.status === 'booked').length,
      pending: records.filter(r => r.status === 'pending').length,
      overdue: records.filter(r => r.status === 'overdue').length
    }
  }
}
