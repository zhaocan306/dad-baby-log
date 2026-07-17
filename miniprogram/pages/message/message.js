const { query } = require('../../utils/cloud')
Page({
  data: { familyName: 'cc cc', babyDetail: '小鲸鱼 · 29 天 · 女宝宝', memberCount: '3', daysOld: '29', totalRecords: '186' },
  onLoad() { this.loadData() },
  async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return
      const feeds = await query('feed_records', { filter: { baby_id: babyId }, limit: 500 })
      this.setData({ totalRecords: feeds.length || 186 })
    } catch(e) { console.log(e) }
  }
})
