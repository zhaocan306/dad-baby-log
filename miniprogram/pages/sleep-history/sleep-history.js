const { query, _ } = require('../../utils/cloud')
Page({
  data: { stats: {}, records: [] },
  onLoad() { this.loadData() },
  async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return
      const records = await query('sleep_records', { filter: { baby_id: babyId }, orderBy: { field: 'start_time', direction: 'desc' }, limit: 20 })
      records.forEach(r => {
        r._time = r.start_time ? r.start_time.slice(11, 16) : ''
      })
      this.setData({ records })
    } catch(e) { console.log(e) }
  },
  goBack() { wx.navigateBack() }
})
