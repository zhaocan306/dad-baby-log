const { query, callFunction, _ } = require('../../utils/cloud')

Page({
  data: {
    nextVaccine: null,
    milestones: [],
    vaccineName: '暂无',
    vaccineDetails: '',
    vaccineCountdown: '--'
  },
  onLoad() {
    this.loadData()
  },
  async loadData() {
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
          vaccineName: v.name || '乙肝疫苗第 2 针',
          vaccineDetails: (v.appointment_at || '').replace('T', ' ') + ' ' + (v.location || ''),
          vaccineCountdown: '还剩 ' + days + ' 天'
        })
      }
    } catch (e) {
      console.log('Health loadData error:', e)
    }
  }
})
