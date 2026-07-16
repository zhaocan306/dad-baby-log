# Supabase + Netlify 部署指南

## 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com) → 点击 **New project**
2. 填写项目名称 `dad-baby-log`，设置数据库密码
3. 选择区域（建议选 Singapore `ap-southeast-1` 离国内最近）
4. 等待项目创建完成（约 2 分钟）

## 2. 执行数据库迁移

1. 进入项目 → **SQL Editor**
2. 打开 `lib/migration.sql`，复制全部内容
3. 粘贴到 SQL Editor → 点击 **Run**
4. 确认 9 张表创建成功

## 3. 获取 API 密钥

1. 进入 **Project Settings** → **API**
2. 复制 `Project URL` 和 `anon public key`
3. 打开项目 `lib/supabase.js`，替换：
```js
const SUPABASE_URL = '你的 Project URL'
const SUPABASE_ANON_KEY = '你的 anon key'
```

## 4. 微信小程序白名单

微信小程序后台 → 开发 → 开发管理 → 服务器域名：
- request 合法域名：添加 `https://你的项目.supabase.co`

## 5. 部署到 Netlify

```bash
# 构建 H5
uni build -p h5

# 输出目录: dist/build/h5
# 在 Netlify 中设置:
#   - 构建命令: uni build -p h5
#   - 发布目录: dist/build/h5
#   - 环境变量: SUPABASE_URL, SUPABASE_ANON_KEY
```

## 6. 启用认证（可选）

Supabase → Authentication → Settings：
- 开启 **Email + Password** 登录
- （可选）开启手机号 / 微信登录
