/**
 * Supabase client for uni-app
 * 使用 uni.request 兼容 H5 / 微信小程序 / 其他端
 */

// 优先读取环境变量 (Vite), 否则使用 .env.example 中的占位值
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://rseulottjokscbvrvesx.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ap1YBGlvcXVeOpFV6cA0SQ_aokX3UJI'

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Prefer': 'return=representation'
}

function getAuthHeader() {
  const session = uni.getStorageSync('supabase_session')
  if (session?.access_token) {
    return { 'Authorization': `Bearer ${session.access_token}` }
  }
  return {}
}

function mergeHeaders(extra = {}) {
  return { ...headers, ...getAuthHeader(), ...extra }
}

function handleResponse(res) {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    return res.data
  }
  throw new Error(`Supabase error ${res.statusCode}: ${JSON.stringify(res.data)}`)
}

export const supabase = {
  // ==================== 通用查询 ====================
  from(table) {
    const baseUrl = `${SUPABASE_URL}/rest/v1/${table}`

    return {
      // SELECT
      select(columns = '*') {
        return {
          async eq(field, value) {
            const url = `${baseUrl}?select=${columns}&${field}=eq.${encodeURIComponent(value)}`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          async in(field, values) {
            const url = `${baseUrl}?select=${columns}&${field}=in.(${values.map(v => encodeURIComponent(v)).join(',')})`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          async gte(field, value) {
            const url = `${baseUrl}?select=${columns}&${field}=gte.${encodeURIComponent(value)}`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          async lte(field, value) {
            const url = `${baseUrl}?select=${columns}&${field}=lte.${encodeURIComponent(value)}`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          async order(field, { ascending = true } = {}) {
            const url = `${baseUrl}?select=${columns}&order=${field}.${ascending ? 'asc' : 'desc'}`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          async limit(count) {
            const url = `${baseUrl}?select=${columns}&limit=${count}`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          async single() {
            const url = `${baseUrl}?select=${columns}&limit=1`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            const data = handleResponse(res)
            return data[0] || null
          },
          async all() {
            const url = `${baseUrl}?select=${columns}`
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          },
          // 链式调用构建器
          _query: columns,
          _filters: [],
          _order: null,
          _limit: null,
          eq(field, value) {
            this._filters.push(`${field}=eq.${encodeURIComponent(value)}`)
            return this
          },
          in(field, values) {
            this._filters.push(`${field}=in.(${values.map(v => encodeURIComponent(v)).join(',')})`)
            return this
          },
          gte(field, value) {
            this._filters.push(`${field}=gte.${encodeURIComponent(value)}`)
            return this
          },
          lte(field, value) {
            this._filters.push(`${field}=lte.${encodeURIComponent(value)}`)
            return this
          },
          order(field, { ascending = true } = {}) {
            this._order = `&order=${field}.${ascending ? 'asc' : 'desc'}`
            return this
          },
          limit(count) {
            this._limit = `&limit=${count}`
            return this
          },
          async single() {
            this._limit = '&limit=1'
            const data = await this.all()
            return data[0] || null
          },
          async all() {
            let url = `${baseUrl}?select=${this._query}`
            if (this._filters.length) url += '&' + this._filters.join('&')
            if (this._order) url += this._order
            if (this._limit) url += this._limit
            const [res] = await uni.request({ url, method: 'GET', header: mergeHeaders() })
            return handleResponse(res)
          }
        }
      },

      // INSERT
      async insert(data) {
        const url = baseUrl
        const [res] = await uni.request({
          url, method: 'POST',
          header: mergeHeaders(),
          data: Array.isArray(data) ? data : [data]
        })
        return handleResponse(res)
      },

      // UPDATE
      update(data) {
        const url = baseUrl
        return {
          async eq(field, value) {
            const [res] = await uni.request({
              url: `${url}?${field}=eq.${encodeURIComponent(value)}`,
              method: 'PATCH',
              header: mergeHeaders(),
              data
            })
            return handleResponse(res)
          }
        }
      },

      // DELETE
      delete() {
        const url = baseUrl
        return {
          async eq(field, value) {
            const [res] = await uni.request({
              url: `${url}?${field}=eq.${encodeURIComponent(value)}`,
              method: 'DELETE',
              header: mergeHeaders()
            })
            return handleResponse(res)
          }
        }
      }
    }
  },

  // ==================== 认证 ====================
  auth: {
    async signUp({ email, password }) {
      const [res] = await uni.request({
        url: `${SUPABASE_URL}/auth/v1/signup`,
        method: 'POST',
        header: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
        data: { email, password }
      })
      return handleResponse(res)
    },

    async signIn({ email, password }) {
      const [res] = await uni.request({
        url: `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        method: 'POST',
        header: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
        data: { email, password }
      })
      const session = handleResponse(res)
      if (session.access_token) {
        uni.setStorageSync('supabase_session', session)
      }
      return session
    },

    async signOut() {
      uni.removeStorageSync('supabase_session')
    },

    getSession() {
      return uni.getStorageSync('supabase_session') || null
    },

    isAuthenticated() {
      return !!this.getSession()?.access_token
    }
  },

  // ==================== Storage ====================
  storage: {
    async upload(bucket, path, file) {
      const [res] = await uni.request({
        url: `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
        method: 'POST',
        header: {
          ...getAuthHeader(),
          'Content-Type': file.type || 'application/octet-stream'
        },
        data: file
      })
      return handleResponse(res)
    },
    getPublicUrl(bucket, path) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
    }
  }
}
