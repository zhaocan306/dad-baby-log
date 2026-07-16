import { supabase } from '../supabase'

export const vaccineApi = {
  async list(babyId) {
    return await supabase.from('vaccine_records')
      .select('*').eq('baby_id', babyId)
      .order('due_date', { ascending: true }).all()
  },

  async milestones(babyId) {
    return await supabase.from('milestones')
      .select('*').eq('baby_id', babyId)
      .order('age_month', { ascending: true }).all()
  },

  async create(data) {
    return await supabase.from('vaccine_records').insert(data)
  },

  async nextDue(babyId) {
    return await supabase.from('vaccine_records')
      .select('*').eq('baby_id', babyId)
      .in('status', ['pending', 'booked'])
      .order('due_date', { ascending: true }).limit(1).single()
  },

  async stats(babyId) {
    const records = await supabase.from('vaccine_records')
      .select('status').eq('baby_id', babyId).all()
    return {
      done: records.filter(r => r.status === 'done').length,
      booked: records.filter(r => r.status === 'booked').length,
      pending: records.filter(r => r.status === 'pending').length,
      overdue: records.filter(r => r.status === 'overdue').length
    }
  }
}
