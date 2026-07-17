const { add } = require('../../utils/cloud')
Component({
  properties: { current: { type: String, value: '' } },
  data: {
    currentType: 'milk', recordValue: '120', note: '', selectedTag: '', saving: false,
    recordTypes: [
      { id: 'milk', name: '喝奶', icon: '/static/shuidi.png', activeIcon: '/static/shuidi_active.png' },
      { id: 'poop', name: '便便', icon: '/static/bianbian.png', activeIcon: '/static/bianbian_active.png' },
      { id: 'sleep', name: '睡觉', icon: '/static/shuimian.png', activeIcon: '/static/shuimian_active.png' },
      { id: 'height', name: '身高', icon: '/static/shengao.png', activeIcon: '/static/shengao_active.png' },
      { id: 'vaccine', name: '疫苗', icon: '/static/yimiao.png', activeIcon: '/static/yimiao_active.png' }
    ],
    formConfigs: {
      milk: { cardTitle: '本次奶量', timeText: '刚刚', defaultVal: '120', unit: 'ml', step: 10, tags: ['奶瓶', '亲喂', '配方奶'], placeholder: '吐奶、拍嗝…', btnText: '保存这次记录' },
      poop: { cardTitle: '本次便便', timeText: '08:45', defaultVal: '中', unit: '量', step: null, tags: ['黄金色', '软糊状', '尿布已换'], placeholder: '颜色、形态…', btnText: '保存便便记录' },
      sleep: { cardTitle: '睡眠时长', timeText: '13:20 开始', defaultVal: '2.0', unit: '小时', step: 0.5, tags: ['日间小睡', '夜间睡眠', '安抚入睡'], placeholder: '入睡方式…', btnText: '保存睡眠记录' },
      height: { cardTitle: '成长测量', timeText: '今天', defaultVal: '52.4', unit: 'cm', step: 0.1, tags: ['身高', '体重 4.1kg', '头围 37cm'], placeholder: '测量姿势…', btnText: '保存成长记录' },
      vaccine: { cardTitle: '接种信息', timeText: '7月11日', defaultVal: '乙肝', unit: '第2针', step: null, tags: ['已预约', '已接种', '延后'], placeholder: '接种地点…', btnText: '保存疫苗记录' }
    }
  },
  methods: {
    switchType(e) {
      const id = e.currentTarget.dataset.id
      const cfg = this.data.formConfigs[id]
      this.setData({ currentType: id, recordValue: cfg.defaultVal, note: '', selectedTag: '' })
    },
    increment() {
      const step = this.data.formConfigs[this.data.currentType].step
      if (!step) return
      this.setData({ recordValue: String(+(+this.data.recordValue + step).toFixed(1)) })
    },
    decrement() {
      const step = this.data.formConfigs[this.data.currentType].step
      if (!step) return
      const val = +this.data.recordValue - step
      if (val < 0) return
      this.setData({ recordValue: String(+val.toFixed(1)) })
    },
    selectTag(e) { this.setData({ selectedTag: e.currentTarget.dataset.tag }) },
    onNoteInput(e) { this.setData({ note: e.detail.value }) },
    onSave() {
      wx.showToast({ title: '保存成功', icon: 'success' })
    }
  }
})
