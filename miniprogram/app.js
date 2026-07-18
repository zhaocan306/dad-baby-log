App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloudbase-d7g94lx217a39e5d8',
      traceUser: true
    })
    this.loadFont()
    this.initFamily()
  },
  loadFont() {
    wx.loadFontFace({
      family: 'MarukoGothicCJKsc',
      source: 'url("https://cdn.jsdelivr.net/gh/max32002/maruko-gothic@main/webfont/CJK%20SC/MarukoGothicCJKsc-Regular.woff2")',
      success: () => console.log('Maruko Gothic loaded'),
      fail: (err) => console.log('Maruko Gothic failed:', err)
    })
  },
  async initFamily() {
    try {
      if (wx.getStorageSync('current_baby_id')) return
      wx.showLoading({ title: '初始化...' })
      const { result } = await wx.cloud.callFunction({ name: 'init' })
      if (result?.babyId) {
        wx.setStorageSync('current_baby_id', result.babyId)
        console.log('Baby ID:', result.babyId)
      }
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      console.log('Init family error:', e)
    }
  }
})
