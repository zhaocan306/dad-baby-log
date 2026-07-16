import { supabase } from '../supabase'

export const familyApi = {
  async getCurrent() {
    const session = supabase.auth.getSession()
    if (!session?.user?.id) return null
    const member = await supabase.from('members')
      .select('family_id').eq('user_id', session.user.id).single()
    if (!member) return null
    const family = await supabase.from('families')
      .select('*').eq('id', member.family_id).single()
    const members = await supabase.from('members')
      .select('*, ...users(email)').eq('family_id', member.family_id).all()
    const babies = await supabase.from('babies')
      .select('*').eq('family_id', member.family_id).all()
    return { ...family, members, babies }
  },

  async create(name) {
    const session = supabase.auth.getSession()
    if (!session?.user?.id) return null
    const family = await supabase.from('families').insert({ name })
    await supabase.from('members').insert({
      family_id: family[0].id,
      user_id: session.user.id,
      role: 'owner'
    })
    return family[0]
  }
}
