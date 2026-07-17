const { query } = require('../../utils/cloud')
Component({{
  properties: { current: { type: String, value: "" } }, data: { familyName: 'cc cc', babyDetail: '灏忛哺楸?路 29 澶?路 濂冲疂瀹?, memberCount: '3', daysOld: '29', totalRecords: '186' },
  lifetimes: { attached() { this.loadData() }, methods: { async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return
      const feeds = await query('feed_records', { filter: { baby_id: babyId }, limit: 500 })
      this.setData({ totalRecords: feeds.length || 186 })
    } catch(e) { console.log(e) }
  }
})


