const { query, _ } = require('../../utils/cloud')
Page({
  data: { milestones: [] },
  onLoad() { this.loadData() },
  async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return
      const milestones = await query('milestones', { filter: { baby_id: babyId }, orderBy: { field: 'age_month', direction: 'asc' } })
      this.setData({ milestones })
    } catch(e) { console.log(e) }
  },
  goBack() { wx.navigateBack() }
})
