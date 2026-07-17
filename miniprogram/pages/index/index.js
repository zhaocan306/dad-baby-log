import { query, callFunction, _ } from '../../utils/cloud'

Page({
  data: {
    babyName: '小鲸鱼的一天',
    babyTip: '来到这个世界 29 天啦',
    todayMilk: 520,
    milkTag: '+8%',
    sleepHours: '6.5',
    sleepNext: '14:30',
    poopCount: 9,
    heightText: '身高 52.4cm',
    weightText: '体重 4.1kg',
    vaccineName: '乙肝第 2 针',
    vaccineDays: '还剩 2 天',
    recentActivities: []
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) return

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
        heightText: heightLatest ? `身高 ${heightLatest.height_cm}cm` : '身高 52.4cm',
        weightText: heightLatest ? `体重 ${heightLatest.weight_kg}kg` : '体重 4.1kg'
      })
    } catch (e) {
      console.log('loadData error:', e)
    }
  },

  async getLatestHeight(babyId) {
    const records = await query('height_records', {
      filter: { baby_id: babyId },
      orderBy: { field: 'date', direction: 'desc' },
      limit: 1
    })
    return records[0] || null
  }
})
