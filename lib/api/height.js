import { supabase } from '../supabase'

export const heightApi = {
  async list(babyId, { limit = 20 } = {}) {
    return await supabase.from('height_records')
      .select('*').eq('baby_id', babyId)
      .order('date', { ascending: false }).limit(limit).all()
  },

  async create(data) {
    return await supabase.from('height_records').insert(data)
  },

  async latest(babyId) {
    return await supabase.from('height_records')
      .select('*').eq('baby_id', babyId)
      .order('date', { ascending: false }).limit(1).single()
  }
}
