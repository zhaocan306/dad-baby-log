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
  lifetimes: {
    attached() {
      this.loadData()
      // 如果初始化还没完成，延迟重试
      setTimeout(() => {
        if (!wx.getStorageSync('current_baby_id')) {
          this.loadData()
        }
      }, 2000)
    }
  },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return

        // 宝宝信息
        const babies = await query('babies', { filter: { _id: babyId }, limit: 1 })
        if (babies.length) {
          const b = babies[0]
          const days = Math.floor((Date.now() - new Date(b.birthday).getTime()) / 86400000)
          this.setData({
            babyName: b.name + ' 的一天',
            babyTip: '来到这个世界 ' + days + ' 天啦'
          })
          console.log('Baby loaded:', b.name, days + '天')
        }

        // 并行加载统计数据
        const [feedStats, sleepStats, poopStats, heightLatest] = await Promise.all([
          callFunction('getWeeklyStats', { babyId, type: 'feed' }),
          callFunction('getWeeklyStats', { babyId, type: 'sleep' }),
          callFunction('getWeeklyStats', { babyId, type: 'poop' }),
          this.getLatestHeight(babyId)
        ])

        this.setData({
          todayMilk: feedStats?.dailyAvg || 520,
          sleepHours: sleepStats?.dailyAvg || '6.5',
          poopCount: poopStats?.total || 9,
          heightText: heightLatest ? ('身高 ' + heightLatest.height_cm + 'cm') : '身高 52.4cm',
          weightText: heightLatest ? ('体重 ' + heightLatest.weight_kg + 'kg') : '体重 4.1kg'
        })
        console.log('Home data loaded:', feedStats)
      } catch(e) { console.log('Home loadData error:', e) }
    },
    async getLatestHeight(babyId) {
      const records = await query('height_records', { filter: { baby_id: babyId }, orderBy: { field: 'date', direction: 'desc' }, limit: 1 })
      return records[0] || null
    }
  }
})
