const { query, callFunction, _ } = require('../../utils/cloud')
Page({
  data: { stats: {}, records: [] },
  onLoad() { this.loadData() },
  async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return
      const records = await query('vaccine_records', { filter: { baby_id: babyId }, orderBy: { field: 'created_at', direction: 'desc' }, limit: 20 })
      this.setData({ records })
    } catch(e) { console.log(e) }
  },
  goBack() { wx.navigateBack() }
})
