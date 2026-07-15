---
name: uni-app
description: Use when developing uni-app pages and components for this baby growth record app. Covers project structure, component conventions, styling patterns, tab navigation, and the custom design system. Do NOT use for general JavaScript/Vue questions unrelated to uni-app.
---

# Uni-App Baby Growth Record

## Project Structure

```
src/
├── App.vue                          # Root component, font loading
├── main.js                          # Entry
├── manifest.json                    # App config (Vue 3, 微信小程序 appid)
├── pages.json                       # Routes, navigationStyle: custom
├── pages/index/index.vue             # Main page — contains CustomTabbar + 5 tab-content components
├── components/
│   ├── CustomNavbar.vue              # Custom top navigation bar
│   ├── CustomTabbar.vue              # Custom bottom tab bar
│   ├── UserHeader.vue                # User greeting header (home page)
│   └── tab-content/
│       ├── home.vue                  # 首页 — milk card + 2x2 grid
│       ├── trend.vue                 # 趋势 — growth charts & stats
│       ├── add.vue                   # 添加记录 — with showBack
│       ├── health.vue                # 健康
│       └── message.vue               # 消息
└── static/
    ├── styles/home.css               # Home page styles
    └── *.png                         # Icons & assets
```

## Tab Navigation

`pages/index/index.vue` renders tab content via `v-if` switching:

```vue
<view class="container">
  <TabHome v-if="current === 'home'" />
  <TabTrend v-if="current === 'trend'" />
  <TabAdd  v-if="current === 'add'" @back="onBack" />
  ...
  <CustomTabbar :current="current" @tabChange="onTabChange" />
</view>
```

- Tab name mapping: `home`, `trend`, `add`, `health`, `message`
- Tab content components live in `components/tab-content/`
- Each tab component is named `TabXxx` (e.g. `TabHome`, `TabTrend`)
- Use `@back` event + `prevTab` for the add page to return to the previous tab

## Page Template Pattern

All tab pages follow this structure:

```vue
<template>
  <view class="page">
    <CustomNavbar/>
    <view class="inner-padding">
      <!-- page content -->
    </view>
  </view>
</template>
```

CSS pattern for scrolling pages:

```css
.page {
  min-height: 100vh;
  background-color: var(--bg-cream);
}
.inner-padding {
  padding: 44rpx 44rpx 100rpx 44rpx;
}
```

For tab pages with `showBack`, emit a `back` event:

```vue
<CustomNavbar showBack title="标题" @back="$emit('back')" />
```

## CustomNavbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showBack` | Boolean | false | Show back arrow |
| `title` | String | "" | Center title text |
| `@back` | event | — | Emitted on back tap |

## Design Tokens (CSS Variables)

Define variables on `.page` to scope them to the component:

```css
--bg-cream: #FAF9F5;
--text-dark: #2D283E;
--text-gray: #8E8A9F;
--card-milk: #EEF0FF;
--card-sleep: #E8E5FF;
--card-poop: #F7E5DE;
--card-height: #EBF4ED;
--card-vaccine: #FFF6D6;
--baby-purple: #8B80F9;
```

Global background: `page { background-color: #fffdf8; }` (in App.vue).

## Styling Conventions

- Use `rpx` units for responsive sizing
- Use BEM-like naming: `.block__element--modifier`
- Card shadows: `box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04)`
- Card border-radius: `56rpx`
- Font weights: 700/800/900 for headings, 600 for body
- Use `box-sizing: border-box` on cards
- Flexbox layout (not float or position where avoidable)
- Page bottom padding: `100rpx` to account for the tab bar (`padding-bottom: 90px` in older pattern)

## Component Import Pattern

```vue
<script>
  import CustomNavbar from "@/components/CustomNavbar.vue"
  export default {
    name: "TabXxx",
    components: { CustomNavbar },
    // data, methods...
  }
</script>
```

## Global Setup

- Vue 3 (`vueVersion: "3"` in manifest)
- Custom navigation (`navigationStyle: "custom"` in pages.json)
- Font: `Zen Maru Gothic` (loaded in App.vue onLaunch)
- Targets: H5, 微信小程序 (appid: `wx827d7c0bb4b80597`)
