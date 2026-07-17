const { add } = require('../../utils/cloud')

Component({{
  properties: { current: { type: String, value: "" } }, data: {
    currentType: 'milk', recordValue: '120', note: '', selectedTag: '', saving: false,
    recordTypes: [
      { id: 'milk', name: '鍠濆ザ', icon: '/static/shuidi.png', activeIcon: '/static/shuidi_active.png' },
      { id: 'poop', name: '渚夸究', icon: '/static/bianbian.png', activeIcon: '/static/bianbian_active.png' },
      { id: 'sleep', name: '鐫¤', icon: '/static/shuimian.png', activeIcon: '/static/shuimian_active.png' },
      { id: 'height', name: '韬珮', icon: '/static/shengao.png', activeIcon: '/static/shengao_active.png' },
      { id: 'vaccine', name: '鐤嫍', icon: '/static/yimiao.png', activeIcon: '/static/yimiao_active.png' }
    ],
    formConfigs: {
      milk: { cardTitle: '鏈濂堕噺', timeText: '鍒氬垰', defaultVal: '120', unit: 'ml', step: 10, tags: ['濂剁摱', '浜插杺', '閰嶆柟濂?], placeholder: '鍚愬ザ銆佹媿鍡濃€?, btnText: '淇濆瓨杩欐璁板綍' },
      poop: { cardTitle: '鏈渚夸究', timeText: '08:45', defaultVal: '涓?, unit: '閲?, step: null, tags: ['榛勯噾鑹?, '杞硦鐘?, '灏垮竷宸叉崲'], placeholder: '棰滆壊銆佸舰鎬佲€?, btnText: '淇濆瓨渚夸究璁板綍' },
      sleep: { cardTitle: '鐫＄湢鏃堕暱', timeText: '13:20 寮€濮?, defaultVal: '2.0', unit: '灏忔椂', step: 0.5, tags: ['鏃ラ棿灏忕潯', '澶滈棿鐫＄湢', '瀹夋姎鍏ョ潯'], placeholder: '鍏ョ潯鏂瑰紡鈥?, btnText: '淇濆瓨鐫＄湢璁板綍' },
      height: { cardTitle: '鎴愰暱娴嬮噺', timeText: '浠婂ぉ', defaultVal: '52.4', unit: 'cm', step: 0.1, tags: ['韬珮', '浣撻噸 4.1kg', '澶村洿 37cm'], placeholder: '娴嬮噺濮垮娍鈥?, btnText: '淇濆瓨鎴愰暱璁板綍' },
      vaccine: { cardTitle: '鎺ョ淇℃伅', timeText: '7鏈?1鏃?, defaultVal: '涔欒倽', unit: '绗?閽?, step: null, tags: ['宸查绾?, '宸叉帴绉?, '寤跺悗'], placeholder: '鎺ョ鍦扮偣鈥?, btnText: '淇濆瓨鐤嫍璁板綍' }
    }
  },

  get currentConfig() {
    return this.data.formConfigs[this.data.currentType]
  },

  switchType(e) {
    const id = e.currentTarget.dataset.id
    const cfg = this.data.formConfigs[id]
    this.setData({ currentType: id, recordValue: cfg.defaultVal, note: '', selectedTag: '' })
  },

  increment() {
    const step = this.currentConfig.step
    if (!step) return
    this.setData({ recordValue: String(+(+this.data.recordValue + step).toFixed(1)) })
  },

  decrement() {
    const step = this.currentConfig.step
    if (!step) return
    const val = +this.data.recordValue - step
    if (val < 0) return
    this.setData({ recordValue: String(+val.toFixed(1)) })
  },

  selectTag(e) {
    this.setData({ selectedTag: e.currentTarget.dataset.tag })
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },

  async save() {
    if (this.data.saving) return
    this.setData({ saving: true })
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) { wx.showToast({ title: '璇峰厛璁剧疆瀹濆疂妗ｆ', icon: 'none' }); return }
      await add(this.data.currentType + '_records', { baby_id: babyId, note: this.data.note })
      wx.showToast({ title: '淇濆瓨鎴愬姛', icon: 'success' })
      const cfg = this.data.formConfigs[this.data.currentType]
      this.setData({ recordValue: cfg.defaultVal, note: '', selectedTag: '' })
    } catch (e) {
      wx.showToast({ title: '淇濆瓨澶辫触', icon: 'none' })
    }
    this.setData({ saving: false })
  }
})


