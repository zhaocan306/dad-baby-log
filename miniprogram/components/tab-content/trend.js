const { query, callFunction, _ } = require('../../utils/cloud')
const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']
Component({
  properties: { current: { type: String, value: '' } },
  data: { milkTotal: '', milkTag: '', sleepAvg: '', nightWakes: '', poopCount: '', weightGain: '', dailyAvgMl: '', barData: [] },
  lifetimes: { attached() { this.loadData() } },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return
        const [feedStats, sleepStats, poopStats] = await Promise.all([
          callFunction('getWeeklyStats', { babyId, type: 'feed' }),
          callFunction('getWeeklyStats', { babyId, type: 'sleep' }),
          callFunction('getWeeklyStats', { babyId, type: 'poop' })
        ])
        const dailyMap = feedStats?.dailyMap || {}
        const maxVal = Math.max(...Object.values(dailyMap), 1)
        const today = new Date(); const bars = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today); d.setDate(d.getDate() - i)
          const key = d.toISOString().slice(0, 10)
          const val = dailyMap[key] || 0
          bars.push({ day: DAY_NAMES[d.getDay()], percentage: Math.round((val / maxVal) * 130), highlight: i === 0 })
        }
        this.setData({
          milkTotal: ((feedStats?.total || 0) / 1000).toFixed(2) + 'L',
          dailyAvgMl: String(Math.round(feedStats?.dailyAvg || 0)),
          sleepAvg: (sleepStats?.dailyAvg || 0) + 'h',
          nightWakes: String(sleepStats?.totalWakes || 0),
          poopCount: String(poopStats?.total || 0) + ' 次',
          weightGain: '+0g',
          barData: bars
        })
      } catch(e) { console.log(e) }
    }
  }
})
