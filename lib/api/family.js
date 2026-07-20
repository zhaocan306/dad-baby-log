import { query, add, getById } from '../cloud'

export const familyApi = {
  async getCurrent() {
    try {
      const families = await query('families', { limit: 1 })
      if (!families?.length) return null
      const family = families[0]
      const members = await query('members', { filter: { family_id: family.id } })
      const babies = await query('babies', { filter: { family_id: family.id } })
      return { ...family, members, babies }
    } catch (e) {
      console.log('getCurrent family error:', e)
    }
    return null
  },

  async create(name) {
    return await add('families', { name })
  }
}
