const { query, callFunction, _ } = require('../../utils/cloud')
Component({
  properties: { current: { type: String, value: '' } },
  data: {
    babyName: '小鲸鱼的一天', babyTip: '来到这个世界 29 天啦',
    todayMilk: 520, milkTag: '+8%',
    sleepHours: '6.5', sleepNext: '14:30',
    poopCount: 9,
    heightText: '身高 52.4cm', weightText: '体重 4.1kg',
    vaccineName: '乙肝第 2 针', vaccineDays: '还剩 2 天',
    recentActivities: []
  },
  lifetimes: { attached() { this.loadData() } },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return
        const feedStats = await callFunction('getWeeklyStats', { babyId, type: 'feed' })
        this.setData({ todayMilk: feedStats?.dailyAvg || 520 })
      } catch(e) { console.log(e) }
    }
  }
})
