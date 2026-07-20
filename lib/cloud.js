import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase'
import { cachedQuery } from './cache'
import { store } from './store'

export function getBabyId() {
  if (store.babyId) return store.babyId
  const id = uni.getStorageSync('current_baby_id')
  if (id) store.babyId = id
  return id
}

let _authToken = null
let _userId = null
let _initPromise = null

function api(method, url, body, extraHeaders) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timeout')), 15000)
    uni.request({
      url: SUPABASE_URL + url,
      method,
      timeout: 10000,
      header: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (_authToken || SUPABASE_ANON_KEY),
        ...extraHeaders
      },
      data: body,
      success: (res) => {
        clearTimeout(timer)
        if (res.statusCode >= 400) {
          reject(new Error(res.data?.message || res.data?.msg || JSON.stringify(res.data)))
        } else {
          resolve(res.data)
        }
      },
      fail: (err) => {
        clearTimeout(timer)
        reject(err)
      }
    })
  })
}

function genId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>
    (c === 'x' ? Math.random() * 16 | 0 : (Math.random() * 16 | 0) & 3 | 8).toString(16)
  )
}

export async function initCloud() {
  if (_authToken) return
  if (_initPromise) return await _initPromise
  _initPromise = (async () => {
    try {
      const data = await api('POST', '/auth/v1/signup', {})
      _authToken = data?.access_token
      _userId = data?.user?.id
    } catch (_) {
      _authToken = SUPABASE_ANON_KEY
    }
    if (!_userId) _userId = genId()
  })()
  await _initPromise
}

export const _ = {
  gte: (val) => ({ __op: 'gte', val }),
  lte: (val) => ({ __op: 'lte', val }),
  in: (arr) => ({ __op: 'in', val: arr })
}

function buildUrl(collection, { filter = {}, orderBy, limit: limitCount } = {}) {
  let url = '/rest/v1/' + collection + '?select=*'
  for (const [key, val] of Object.entries(filter)) {
    if (val && typeof val === 'object' && '__op' in val) {
      const op = val.__op === 'in' ? 'in' : val.__op
      const v = val.__op === 'in'
        ? '(' + val.val.map(encodeURIComponent).join(',') + ')'
        : encodeURIComponent(val.val)
      url += '&' + key + '=' + op + '.' + v
    } else {
      url += '&' + key + '=eq.' + encodeURIComponent(val)
    }
  }
  if (orderBy) {
    url += '&order=' + orderBy.field + '.' + (orderBy.direction === 'asc' ? 'asc' : 'desc')
  }
  if (limitCount) url += '&limit=' + limitCount
  return url
}

export async function query(collection, opts = {}) {
  const url = buildUrl(collection, opts)
  const key = collection + ':' + url
  return await cachedQuery(key, () => api('GET', url))
}

export async function getById(collection, id) {
  const data = await api('GET', '/rest/v1/' + collection + '?id=eq.' + id + '&select=*')
  return data?.[0] || null
}

export async function add(collection, record) {
  const data = await api('POST', '/rest/v1/' + collection + '?select=id', record, {
    Prefer: 'return=representation'
  })
  return data?.[0]?.id
}

export async function update(collection, id, record) {
  await api('PATCH', '/rest/v1/' + collection + '?id=eq.' + id, record)
}

export async function remove(collection, id) {
  await api('DELETE', '/rest/v1/' + collection + '?id=eq.' + id)
}

export async function signInAnonymously() {
  await initCloud()
  return { user: { id: _userId } }
}

export async function getUser() {
  await initCloud()
  return { data: { user: { id: _userId } } }
}

export const supabase = {
  auth: { getUser }
}

export { store }
