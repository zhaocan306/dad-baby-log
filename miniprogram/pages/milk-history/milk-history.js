const { query, _ } = require('../../utils/cloud')
Page({
  data: { stats: {}, records: [] },
  onLoad() { this.loadData() },
  async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return
      const records = await query('feed_records', { filter: { baby_id: babyId }, orderBy: { field: 'created_at', direction: 'desc' }, limit: 20 })
      records.forEach(r => {
        r._time = r.created_at ? r.created_at.slice(11, 16) : ''
        r._date = r.created_at ? r.created_at.slice(5, 10) : ''
      })
      this.setData({ records })
    } catch(e) { console.log(e) }
  },
  goBack() { wx.navigateBack() }
})
