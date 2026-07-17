App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloudbase-d7g94lx217a39e5d8',
      traceUser: true
    })
    console.log('Cloud initialized')
  }
})
