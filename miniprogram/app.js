App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloudbase-d7g94lx217a39e5d8',
      traceUser: true
    })
    this.loadFont()
  },
  loadFont() {
    wx.loadFontFace({
      family: 'MarukoGothicCJKsc',
      source: 'url("https://cdn.jsdelivr.net/gh/max32002/maruko-gothic@main/webfont/CJK%20SC/MarukoGothicCJKsc-Regular.woff2")',
      success: () => console.log('Maruko Gothic loaded'),
      fail: (err) => console.log('Maruko Gothic failed:', err)
    })
  }
})
