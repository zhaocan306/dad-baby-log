const { query, callFunction, _ } = require('../../utils/cloud')
const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']
Component({
  properties: { current: { type: String, value: '' } },
  data: { milkTotal: '3.42L', milkTag: '+6%', sleepAvg: '15.8', nightWakes: '2', poopCount: '9 次', weightGain: '+180g', dailyAvgMl: '488', barData: [] },
  lifetimes: {
    attached() { this.loadData() }
  },
  methods: {
    async loadData() {
      try {
        const babyId = wx.getStorageSync('current_baby_id')
        if (!babyId) return
        const feedStats = await callFunction('getWeeklyStats', { babyId, type: 'feed' })
        const dailyMap = feedStats?.dailyMap || {}
        const maxVal = Math.max(...Object.values(dailyMap), 1)
        const today = new Date(); const bars = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today); d.setDate(d.getDate() - i)
          const key = d.toISOString().slice(0, 10)
          const val = dailyMap[key] || 0
          bars.push({ day: DAY_NAMES[d.getDay()], percentage: Math.round((val / maxVal) * 130), highlight: i === 0 })
        }
        this.setData({ milkTotal: ((feedStats?.total || 3420) / 1000).toFixed(2) + 'L', dailyAvgMl: String(Math.round(feedStats?.dailyAvg || 488)), barData: bars })
      } catch(e) { console.log(e) }
    }
  }
})
