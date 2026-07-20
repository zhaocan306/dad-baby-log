/**
 * 请求缓存层
 * 防止同一页面短期内重复请求
 */

const cache = new Map()
const pending = new Map()

const TTL = {
  list: 5000,     // 列表数据缓存 5 秒
  stats: 3000,    // 统计数据缓存 3 秒
  detail: 10000   // 详情数据缓存 10 秒
}

export function setTTL(type, ms) {
  TTL[type] = ms
}

export async function cachedQuery(key, fetcher, ttl = TTL.list) {
  // 防抖：同一 key 的请求正在处理中，直接复用
  if (pending.has(key)) return pending.get(key)

  const existing = cache.get(key)
  if (existing && Date.now() - existing.time < ttl) {
    return existing.data
  }

  const promise = fetcher().then(data => {
    cache.set(key, { data, time: Date.now() })
    pending.delete(key)
    return data
  }).catch(err => {
    pending.delete(key)
    throw err
  })

  pending.set(key, promise)
  return promise
}

export function clearCache(key) {
  if (key) {
    cache.delete(key)
    pending.delete(key)
  } else {
    cache.clear()
    pending.clear()
  }
}
