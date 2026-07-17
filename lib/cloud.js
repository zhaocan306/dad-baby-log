/**
 * 微信云开发客户端
 */

let db = null

export function initCloud() {
  return new Promise((resolve) => {
    wx.cloud.init({
      env: 'cloudbase-d7g94lx217a39e5d8',
      traceUser: true
    })
    db = wx.cloud.database()
    resolve()
  })
}

export function getDB() {
  if (!db) db = wx.cloud.database()
  return db
}

export const _ = wx.cloud?.database?.()?.command || {}

// 通用查询包装
export async function query(collection, { filter = {}, orderBy, limit: limitCount = 100 } = {}) {
  let q = getDB().collection(collection).where(filter)
  if (orderBy) q = q.orderBy(orderBy.field, orderBy.direction || 'desc')
  if (limitCount) q = q.limit(limitCount)
  const { data } = await q.get()
  return data
}

export async function getById(collection, id) {
  const { data } = await getDB().collection(collection).doc(id).get()
  return data
}

export async function add(collection, data) {
  const res = await getDB().collection(collection).add({ data })
  return res._id
}

export async function update(collection, id, data) {
  await getDB().collection(collection).doc(id).update({ data })
}

export async function remove(collection, id) {
  await getDB().collection(collection).doc(id).remove()
}

export async function callFunction(name, data) {
  const res = await wx.cloud.callFunction({ name, data })
  return res.result
}
