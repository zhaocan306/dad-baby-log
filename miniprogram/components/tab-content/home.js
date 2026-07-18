const { query, callFunction, _ } = require('../../utils/cloud')
Component({
  properties: { current: { type: String, value: '' } },
  data: { babyName: '', babyTip: '', todayMilk: 0, milkTag: '', sleepHours: '', sleepNext: '', poopCount: 0, heightText: '', weightText: '', vaccineName: '', vaccineDays: '', recentActivities: [] },
  lifetimes: { attached() { this.loadData(); setTimeout(() => this.loadData(), 2000) } },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return
        const babies = await query('babies', { filter: { _id: babyId }, limit: 1 })
        let babyDays = 29
        if (babies.length) {
          const b = babies[0]
          babyDays = Math.floor((Date.now() - new Date(b.birthday).getTime()) / 86400000)
          this.setData({ babyName: b.name + ' 的一天', babyTip: '来到这个世界 ' + babyDays + ' 天啦' })
        }
        const [feedStats, sleepStats, poopStats] = await Promise.all([
          callFunction('getWeeklyStats', { babyId, type: 'feed' }),
          callFunction('getWeeklyStats', { babyId, type: 'sleep' }),
          callFunction('getWeeklyStats', { babyId, type: 'poop' })
        ])
        const records = await query('feed_records', { filter: { baby_id: babyId }, orderBy: { field: 'created_at', direction: 'desc' }, limit: 5 })
        this.setData({
          todayMilk: feedStats?.dailyAvg || 0, milkTag: '+0%',
          sleepHours: (sleepStats?.dailyAvg || 0) + '',
          poopCount: poopStats?.total || 0,
          recentActivities: records.slice(0, 5).map(r => ({
            icon: '/static/list-icon-milk-1.png',
            name: '喂养', desc: (r.amount_ml || '') + 'ml',
            time: r.created_at ? r.created_at.slice(11, 16) : ''
          }))
        })
      } catch(e) { console.log(e) }
    }
  }
})
