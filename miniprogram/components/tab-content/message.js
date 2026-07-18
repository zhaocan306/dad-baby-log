const { query } = require('../../utils/cloud')
Component({
  properties: { current: { type: String, value: '' } },
  data: { familyName: '', babyDetail: '', memberCount: '', daysOld: '', totalRecords: 0 },
  lifetimes: { attached() { this.loadData() } },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return
        const babies = await query('babies', { filter: { _id: babyId }, limit: 1 })
        if (babies.length) {
          const b = babies[0]
          const days = Math.floor((Date.now() - new Date(b.birthday).getTime()) / 86400000)
          this.setData({ babyDetail: b.name + ' · ' + days + ' 天' + (b.gender === 'female' ? ' · 女宝宝' : ''), daysOld: String(days) })
        }
        const feeds = await query('feed_records', { filter: { baby_id: babyId }, limit: 500 })
        this.setData({ totalRecords: feeds.length })
      } catch(e) { console.log(e) }
    }
  }
})
