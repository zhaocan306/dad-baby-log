import { query, add, callFunction } from '../cloud'
import { _ } from '../cloud'

export const familyApi = {
  async getCurrent() {
    try {
      const { result } = await wx.cloud.callFunction({ name: 'init' })
      if (result?.familyId) {
        const family = await getFamilyById(result.familyId)
        const members = await query('members', {
          filter: { family_id: result.familyId }
        })
        const babies = await query('babies', {
          filter: { family_id: result.familyId }
        })
        return { ...family, members, babies }
      }
    } catch (e) {
      console.log('getCurrent family error:', e)
    }
    return null
  },

  async create(name) {
    const { result } = await wx.cloud.callFunction({ name: 'init' })
    return result
  }
}

async function getFamilyById(id) {
  const { data } = await wx.cloud.database().collection('families').doc(id).get()
  return data
}
