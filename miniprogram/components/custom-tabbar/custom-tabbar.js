Component({
  properties: { current: { type: String, value: 'home' } },
  data: {
    tabs: [
      { name: 'home', label: '首页', icon: '/static/tabbar/home.png', activeIcon: '/static/tabbar/home_active.png' },
      { name: 'trend', label: '趋势', icon: '/static/tabbar/trend.png', activeIcon: '/static/tabbar/trend_active.png' },
      { name: 'add', label: '添加', icon: '/static/tabbar/add.png', activeIcon: '/static/tabbar/add_active.png' },
      { name: 'health', label: '健康', icon: '/static/tabbar/health.png', activeIcon: '/static/tabbar/health_active.png' },
      { name: 'message', label: '消息', icon: '/static/tabbar/message.png', activeIcon: '/static/tabbar/message_active.png' }
    ]
  },
  methods: {
    onTabClick(e) {
      const name = e.currentTarget.dataset.name
      if (name === this.data.current) return
      this.triggerEvent('tabChange', { name })
    }
  }
})
