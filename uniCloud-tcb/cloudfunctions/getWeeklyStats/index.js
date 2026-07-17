// 云函数：获取周统计数据
// 聚合 feed / sleep / poop 最近7天数据

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { babyId, type } = event
  const now = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

  if (type === 'feed') {
    const { data } = await db.collection('feed_records')
      .where({ baby_id: babyId, created_at: _.gte(weekAgo) })
      .get()
    const total = data.reduce((s, r) => s + (r.amount_ml || 0), 0)
    const dailyMap = {}
    data.forEach(r => {
      const d = r.created_at.slice(0, 10)
      dailyMap[d] = (dailyMap[d] || 0) + (r.amount_ml || 0)
    })
    return { total, dailyAvg: Math.round(total / 7), count: data.length, dailyMap }
  }

  if (type === 'sleep') {
    const { data } = await db.collection('sleep_records')
      .where({ baby_id: babyId, start_time: _.gte(weekAgo.toISOString()) })
      .get()
    const totalMin = data.reduce((s, r) => s + (r.duration_min || 0), 0)
    const totalWakes = data.reduce((s, r) => s + (r.wake_count || 0), 0)
    return { totalMin, dailyAvg: +(totalMin / 7).toFixed(1), totalWakes, count: data.length }
  }

  if (type === 'poop') {
    const { data } = await db.collection('poop_records')
      .where({ baby_id: babyId, created_at: _.gte(weekAgo) })
      .get()
    return { total: data.length }
  }

  return { error: 'unknown type' }
}
