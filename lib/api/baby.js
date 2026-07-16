import { supabase } from '../supabase'

export const babyApi = {
  async getCurrent() {
    const session = supabase.auth.getSession()
    if (!session?.user?.id) return null
    const members = await supabase.from('members')
      .select('family_id').eq('user_id', session.user.id).single()
    if (!members) return null
    return await supabase.from('babies')
      .select('*').eq('family_id', members.family_id).single()
  },

  async update(id, data) {
    return await supabase.from('babies').update(data).eq('id', id)
  }
}
