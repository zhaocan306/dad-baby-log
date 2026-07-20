import { query, update as cloudUpdate } from '../cloud'

export const babyApi = {
  async getCurrent(id) {
    if (!id) return null
    const babies = await query('babies', { filter: { id }, limit: 1 })
    return babies?.[0] || null
  },

  async update(id, data) {
    return await cloudUpdate('babies', id, data)
  }
}
