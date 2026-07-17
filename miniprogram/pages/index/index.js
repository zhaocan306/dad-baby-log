Page({
  data: { current: 'home', prevTab: 'home' },
  onTabChange(e) {
    const name = e.detail.name
    this.setData({ prevTab: this.data.current, current: name })
  },
  onBack() {
    this.setData({ current: this.data.prevTab })
  }
})
