const { add } = require('../../utils/cloud')
Page({
  data: { currentType: 'milk', recordValue: '120', note: '', selectedTag: '', saving: false,
    recordTypes: [
      { id: 'milk', name: '喝奶', icon: '/static/shuidi.png', activeIcon: '/static/shuidi_active.png' },
      { id: 'poop', name: '便便', icon: '/static/bianbian.png', activeIcon: '/static/bianbian_active.png' },
      { id: 'sleep', name: '睡觉', icon: '/static/shuimian.png', activeIcon: '/static/shuimian_active.png' },
      { id: 'height', name: '身高', icon: '/static/shengao.png', activeIcon: '/static/shengao_active.png' },
      { id: 'vaccine', name: '疫苗', icon: '/static/yimiao.png', activeIcon: '/static/yimiao_active.png' }
    ],
    formConfigs: {
      milk: { cardTitle: '本次奶量', timeText: '刚刚', defaultVal: '120', unit: 'ml', tags: ['奶瓶','亲喂','配方奶'], placeholder: '吐奶、拍嗝…', btnText: '保存这次记录' },
      poop: { cardTitle: '本次便便', timeText: '08:45', defaultVal: '中', unit: '量', tags: ['黄金色','软糊状','尿布已换'], placeholder: '颜色、形态…', btnText: '保存便便记录' },
      sleep: { cardTitle: '睡眠时长', timeText: '13:20 开始', defaultVal: '2.0', unit: '小时', tags: ['日间小睡','夜间睡眠','安抚入睡'], placeholder: '入睡方式…', btnText: '保存睡眠记录' },
      height: { cardTitle: '成长测量', timeText: '今天', defaultVal: '52.4', unit: 'cm', tags: ['身高','体重 4.1kg','头围 37cm'], placeholder: '测量姿势…', btnText: '保存成长记录' },
      vaccine: { cardTitle: '接种信息', timeText: '7月11日', defaultVal: '乙肝', unit: '第2针', tags: ['已预约','已接种','延后'], placeholder: '接种地点…', btnText: '保存疫苗记录' }
    }
  },
  switchType(e) {
    const id = e.currentTarget.dataset.id
    const cfg = this.data.formConfigs[id]
    this.setData({ currentType: id, recordValue: cfg.defaultVal, note: '', selectedTag: '' })
  },
  async save() {
    if (this.data.saving) return
    this.setData({ saving: true })
    try {
      const babyId = wx.getStorageSync('current_baby_id')
      if (!babyId) { wx.showToast({ title: '请先设置宝宝档案', icon: 'none' }); return }
      const type = this.data.currentType
      await add(type + '_records', { baby_id: babyId, note: this.data.note })
      wx.showToast({ title: '保存成功', icon: 'success' })
    } catch(e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
    this.setData({ saving: false })
  }
})
