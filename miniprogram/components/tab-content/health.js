const { query, callFunction, _ } = require('../../utils/cloud')

Component({{
  properties: { current: { type: String, value: "" } }, data: {
    nextVaccine: null,
    milestones: [],
    vaccineName: '鏆傛棤',
    vaccineDetails: '',
    vaccineCountdown: '--'
  },
  lifetimes: { attached() {
    this.loadData()
  }, methods: { async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return

      const milestones = await query('milestones', {
        filter: { baby_id: babyId },
        orderBy: { field: 'age_month', direction: 'asc' }
      })
      this.setData({ milestones })

      // Find next due vaccine
      const vaccines = await query('vaccine_records', {
        filter: { baby_id: babyId, status: ['pending', 'booked'] },
        orderBy: { field: 'due_date', direction: 'asc' },
        limit: 1
      })
      if (vaccines.length) {
        const v = vaccines[0]
        const days = Math.ceil((new Date(v.due_date) - new Date()) / 86400000)
        this.setData({
          vaccineName: v.name || '涔欒倽鐤嫍绗?2 閽?,
          vaccineDetails: (v.appointment_at || '').replace('T', ' ') + ' ' + (v.location || ''),
          vaccineCountdown: '杩樺墿 ' + days + ' 澶?
        })
      }
    } catch (e) {
      console.log('Health loadData error:', e)
    }
  }
})


