/**
 * 本地推送提醒服务
 * 根据提醒设置 + 实际记录 推送通知
 */

export function scheduleNotifications(baby) {
  const settings = uni.getStorageSync('reminder_settings')
  if (!settings) return
  const s = JSON.parse(settings)

  // 清空旧的提醒
  if (typeof plus !== 'undefined') {
    plus.push.clear()
  }

  if (s.feedEnabled) {
    const lastFeedTime = uni.getStorageSync('_last_feed_time')
    if (lastFeedTime) {
      const mins = (Date.now() - lastFeedTime) / 60000
      const intervalMins = (s.feedInterval || 3) * 60
      if (mins > intervalMins) {
        notify('🍼 喂奶时间', `距离上次喂奶已过 ${Math.round(mins)} 分钟`) 
      }
    }
  }

  if (s.sleepEnabled && baby) {
    const lastSleepEnd = uni.getStorageSync('_last_sleep_end')
    if (lastSleepEnd) {
      const mins = (Date.now() - lastSleepEnd) / 60000
      const thresholdMins = (s.sleepThreshold || 2) * 60
      if (mins > thresholdMins) {
        notify('😴 该哄睡了', `宝宝已清醒 ${Math.round(mins)} 分钟`)
      }
    }
  }

  if (s.vaccineEnabled && baby) {
    // 由疫苗日历页面触发
  }
}

function notify(title, body) {
  if (typeof plus !== 'undefined') {
    plus.push.createMessage(body, title, { title })
  } else {
    uni.showToast({ title: title + ': ' + body, icon: 'none' })
  }
}

export function recordFeedTime() {
  uni.setStorageSync('_last_feed_time', Date.now())
}

export function recordSleepEnd(time) {
  uni.setStorageSync('_last_sleep_end', time || Date.now())
}
