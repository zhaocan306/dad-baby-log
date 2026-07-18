const { query, callFunction, _ } = require('../../utils/cloud')
Component({
  properties: { current: { type: String, value: '' } },
  data: { vaccineName: '', vaccineDetails: '', vaccineCountdown: '', milestones: [] },
  lifetimes: { attached() { this.loadData() } },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return
        const milestones = await query('milestones', { filter: { baby_id: babyId }, orderBy: { field: 'age_month', direction: 'asc' } })
        this.setData({ milestones })
      } catch(e) { console.log(e) }
    }
  }
})
