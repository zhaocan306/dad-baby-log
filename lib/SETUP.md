# Supabase 部署指南

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
3. 打开 `lib/supabase.js`，替换：
```js
const SUPABASE_URL = 'https://你的项目.supabase.co'
const SUPABASE_ANON_KEY = '你的 anon key'
```

## 4. 配置匿名登录

Supabase → Authentication → Settings → Auth providers：
- 开启 **Allow anonymous sign-ins**

## 5. 构建 App

```bash
# 安装依赖
npm install
# 或
yarn install

# 构建 H5
npm run build:h5

# 构建 app
npm run build:app
```

## 6. 运行

在 HBuilderX 中打开项目，选择运行到浏览器或手机。
