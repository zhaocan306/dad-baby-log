const DB = wx.cloud.database()
const _ = DB.command

export function getDB() { return DB }
export { _ }

export async function query(collection, { filter = {}, orderBy, limit: limitCount = 100 } = {}) {
  let q = DB.collection(collection).where(filter)
  if (orderBy) q = q.orderBy(orderBy.field, orderBy.direction || 'desc')
  if (limitCount) q = q.limit(limitCount)
  const { data } = await q.get()
  return data
}

export async function add(collection, data) {
  const res = await DB.collection(collection).add({ data })
  return res._id
}

export async function callFunction(name, data) {
  const res = await wx.cloud.callFunction({ name, data })
  return res.result
}
