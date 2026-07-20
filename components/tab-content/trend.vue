<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding" scroll-y refresher-enabled refresher-background="#FAF9F5" @refresherrefresh="onRefresh" :refresher-triggered="refreshing">

			<!-- 1. 页面头部标题区域 -->
			<view class="header-section">
			  <view class="title-area">
			    <image class="trend-header-icon" src="/static/icon-trend-header.png" mode="aspectFit"></image>
			    <view class="title-text-group">
			      <text class="title-main">成长趋势</text>
			      <text class="title-sub">按周查看喝奶、睡眠和成长变化</text>
			    </view>
			  </view>
			  <picker class="range-picker" mode="selector" :range="rangeOptions" range-key="label" :value="rangeIndex" @change="onRangeChange">
			  <view class="weekly-badge">
			    <text class="badge-text">{{ rangeOptions[rangeIndex].label }}</text>
			  </view>
			  </picker>
			</view>

			<view class="skel-grid">
			  <view class="skeleton skel-trend-card" v-if="loading"></view>
			  <view class="skeleton skel-trend-card" v-if="loading"></view>
			  <view class="skeleton skel-trend-card" v-if="loading"></view>
			  <view class="skeleton skel-trend-card" v-if="loading"></view>
			</view>

			<template v-if="!loading">
			<view class="enter-stagger">
			<!-- 2. 四个指标小卡片网格布局 -->
			<view class="grid-layout mb-4">
			  <view class="grid-card card-milk shadow-soft">
			    <view class="card-header-icon">
			      <image class="card-icon" src="/static/shuidi.png" mode="aspectFit"></image>
			    </view>
			    <view class="card-value-box">
			      <text class="value-num">{{ milkTotal }}</text>
			      <text class="value-desc">总奶量 · 比上周 {{ milkChange }}</text>
			    </view>
			  </view>

			  <view class="grid-card card-sleep shadow-soft">
			    <view class="card-header-icon">
			      <image class="card-icon" src="/static/shuimian.png" mode="aspectFit"></image>
			    </view>
			    <view class="card-value-box">
			      <text class="value-num">{{ sleepAvg }}</text>
			      <text class="value-desc">日均睡眠 · 夜醒 {{ nightWakes }} 次</text>
			    </view>
			  </view>

			  <view class="grid-card card-poop shadow-soft">
			    <view class="card-header-icon">
			      <image class="card-icon" src="/static/bianbian.png" mode="aspectFit"></image>
			    </view>
			    <view class="card-value-box">
			      <text class="value-num">{{ poopCount }}</text>
			      <text class="value-desc">颜色正常</text>
			    </view>
			  </view>

			  <view class="grid-card card-height shadow-soft">
			    <view class="card-header-icon">
			      <image class="card-icon" src="/static/shengao.png" mode="aspectFit"></image>
			    </view>
			    <view class="card-value-box">
			      <text class="value-num">{{ weightGain }}</text>
			      <text class="value-desc text-green">体重增长稳定</text>
			    </view>
			  </view>
			</view>

			<!-- 3. 7天奶量柱状图大卡片 -->
			<view class="chart-card shadow-soft">
			  <view class="chart-header">
			    <text class="chart-title">7 天奶量</text>
			    <view class="chart-badge">
			      <text class="chart-badge-text">日均 {{ dailyAvgMl }}ml</text>
			    </view>
			  </view>

			  <view class="chart-body">
			    <view class="chart-bar-item" v-for="(item, index) in barData" :key="index">
			      <text class="bar-value">{{ item.value }}ml</text>
			      <view class="bar-track">
			        <view
			          :class="['bar-fill', item.highlight ? 'bar-highlight' : 'bar-normal']"
			          :style="{ height: item.percentage + rpxToPxSuffix }"
			        ></view>
			      </view>
			      <text :class="['bar-day-label', item.highlight ? 'text-highlight' : '']">{{ item.day }}</text>
			    </view>
			  </view>
			</view>

			<!-- 4. 小提示黄色卡片 -->
			<view class="tips-card shadow-soft">
			  <image class="tips-icon" src="/static/icon-tips.png" mode="aspectFit"></image>
			  <view class="tips-content">
			    <text class="tips-title">小提示</text>
			    <text class="tips-desc">{{ tipText }}</text>
			  </view>
			</view>
			</view>
			</template>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import { initCloud, getBabyId } from '@/lib/cloud'
	import { feedApi } from '@/lib/api/feed'
	import { sleepApi } from '@/lib/api/sleep'
	import { poopApi } from '@/lib/api/poop'
	import { heightApi } from '@/lib/api/height'

	const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']

	export default {
		name: "TabTrend",
		components: { CustomNavbar },
		data() {
		    return {
		      milkTotal: '--',
		      milkChange: '+0%',
		      sleepAvg: '--',
		      nightWakes: '0',
		      poopCount: '0',
		      weightGain: '--',
		      dailyAvgMl: '0',
		      barData: [],
		      selectedBar: -1,
			loading: true,
			refreshing: false,
		      rpxToPxSuffix: 'rpx',
		      rangeIndex: 0,
		      rangeOptions: [
		        { label: '本周', days: 7 },
		        { label: '本月', days: 30 },
		        { label: '近三月', days: 90 }
		      ],
		      _alive: false
		    };
		},
		  mounted() {
		    this._alive = true
		    setTimeout(() => this.loadData(), 100)
		  },
		  beforeUnmount() {
		    this._alive = false
		  },
		  async onShow() {
		    await this.loadData()
		  },
		  methods: {
		    onRangeChange(e) { this.rangeIndex = +e.detail.value; this.loadData() },
		async loadData() {
		      try {
		        const babyId = getBabyId()
		        if (!babyId) { this.loading = false; return }
		        await initCloud()

		        const days = this.rangeOptions[this.rangeIndex].days
		        const [feeds, sleeps, poops, heights] = await Promise.all([
		          feedApi.list(babyId, { limit: 500, days }).catch(() => []),
		          sleepApi.list(babyId, { limit: 500, days }).catch(() => []),
		          poopApi.list(babyId, { limit: 500, days }).catch(() => []),
		          heightApi.list(babyId, { limit: 2 }).catch(() => [])
		        ])
		        const feedStats = feeds.length ? {
		          total: feeds.reduce((s, r) => s + (r.amount_ml || 0), 0),
		          dailyAvg: Math.round(feeds.reduce((s, r) => s + (r.amount_ml || 0), 0) / days),
		          count: feeds.length,
		          dailyMap: feeds.reduce((m, r) => { const d = (r.created_at || '').slice(0, 10); if (d) m[d] = (m[d] || 0) + (r.amount_ml || 0); return m }, {})
		        } : null
		        const sleepStats = sleeps.length ? {
		          dailyAvg: sleeps.reduce((s, r) => s + (r.duration_min || 0), 0) / 60 / days,
		          totalWakes: sleeps.reduce((s, r) => s + (r.wake_count || 0), 0),
		          count: sleeps.length
		        } : null
		        const poopStats = poops.length ? { total: poops.length } : null

		        // 奶量
		        if (feedStats) {
		          this.dailyAvgMl = String(Math.round(feedStats.dailyAvg || 0))
		        }

		        // 睡眠
		        if (sleepStats) {
		          this.nightWakes = String(sleepStats.totalWakes || 0)
		        }

		        // 便便
		        this.poopCount = String(poopStats?.total ?? 0) + ' 次'

		        // 体重增长
		        if (heights?.length >= 2) {
		          const diff = (heights[0].weight_kg - heights[1].weight_kg) * 1000
		          this.weightGain = (diff >= 0 ? '+' : '') + Math.round(diff) + 'g'
		        } else if (heights?.length === 1) {
		          this.weightGain = heights[0].weight_kg + 'kg'
		        }

		        // 7天柱状图
		        const daily = feedStats?.dailyMap || {}
		        const vals = Object.values(daily)
		        const maxVal = Math.max(...vals, 1)
		        const today = new Date()
		        const bars = []
		        for (let i = 6; i >= 0; i--) {
		          const d = new Date(today)
		          d.setDate(d.getDate() - i)
		          const key = d.toISOString().slice(0, 10)
		          const val = daily[key] || 0
		          bars.push({
		            day: DAY_NAMES[d.getDay()],
		            value: val,
		            percentage: Math.round((val / maxVal) * 130),
		            highlight: i === 0
		          })
		        }
		        this.barData = bars

		        this.applyAnimations(feedStats, sleepStats, poopStats)

		        // 动态提示
		        if (feedStats?.count > 10) {
		          this.tipText = '宝宝喝奶规律良好，继续保持哦'
		        } else if (sleepStats?.dailyAvg > 12) {
		          this.tipText = '宝宝睡眠充足，发育加分'
		        } else if (feedStats?.count > 0) {
		          this.tipText = '坚持记录，趋势会越来越清晰'
		        }
		      } catch (e) {
		        console.log('Trend loadData error:', e.message)
		      }
		      this.loading = false
		    },
		    async onRefresh() {
		      this.refreshing = true
		      await this.loadData()
		      this.refreshing = false
		    },
		    animateNum(from, to, setter, duration = 500) {
		      if (!this._alive) return
		      const start = Date.now()
		      const step = () => {
		        if (!this._alive) return
		        const elapsed = Date.now() - start
		        const progress = Math.min(elapsed / duration, 1)
		        const spring = 1 - Math.pow(1 - progress, 3) + 0.12 * Math.sin(progress * Math.PI * 2.5) * (1 - progress)
		        const val = from + (to - from) * Math.max(0, Math.min(1, spring))
		        setter(to < 100 ? Math.round(val * 10) / 10 : Math.round(val))
		        if (progress < 1 && this._alive) setTimeout(step, 16)
		      }
		      step()
		    },
		    applyAnimations(feedStats, sleepStats, poopStats) {
		      if (feedStats) {
		        const prev = parseFloat(this.milkTotal) || 0
		        const target = feedStats.total ? feedStats.total / 1000 : 0
		        this.animateNum(prev, target, v => this.milkTotal = v.toFixed(2) + 'L')
		      }
		      if (sleepStats?.dailyAvg) {
		        this.animateNum(parseFloat(this.sleepAvg) || 0, sleepStats.dailyAvg, v => this.sleepAvg = v + 'h')
		        this.animateNum(parseInt(this.nightWakes) || 0, sleepStats.totalWakes || 0, v => this.nightWakes = String(Math.round(v)))
		      }
		      if (poopStats) {
		        this.animateNum(parseInt(this.poopCount) || 0, poopStats.total || 0, v => this.poopCount = String(Math.round(v)) + ' 次')
		      }
		    }
		  }
	}
</script>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  flex: 1;
	  height: 0;
	  padding: 0 44rpx;
	  width: calc(100% - 88rpx);
	}

	.enter-header { animation: trendSlide 0.4s ease-out both; }
	.enter-card1 { animation: trendSlide 0.4s ease-out 0.08s both; }
	.enter-card2 { animation: trendSlide 0.4s ease-out 0.16s both; }
	.enter-card3 { animation: trendSlide 0.4s ease-out 0.24s both; }

	@keyframes trendSlide {
	  from { opacity: 0; transform: translateY(30rpx); }
	  to { opacity: 1; transform: translateY(0); }
	}

	/* ==================== 头部信息区 ==================== */
	.header-section {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 44rpx;
	}

	.title-area {
	  display: flex;
	  align-items: center;
	}

	.trend-header-icon {
	  width: 96rpx;
	  height: 96rpx;
	  margin-right: 20rpx;
	}

	.title-text-group {
	  display: flex;
	  flex-direction: column;
	}

	.title-main {
	  font-size: 38rpx;
	  font-weight: 900;
	  letter-spacing: 1rpx;
	}

	.title-sub {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 6rpx;
	}

	.range-picker { margin-left: auto; }

	.weekly-badge {
	  background-color: #FFFFFF;
	  border: 1px solid rgba(142, 138, 159, 0.1);
	  padding: 12rpx 36rpx;
	  border-radius: 100rpx;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	  display: flex;
	  align-items: center;
	}

	.badge-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	/* ==================== 2x2 指标网格卡片 ==================== */
	.grid-layout {
	  display: grid;
	  grid-template-columns: 1fr 1fr;
	  grid-gap: 30rpx;
	}

	.mb-4 {
	  margin-bottom: 30rpx;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.grid-card {
	  border-radius: 56rpx;
	  padding: 40rpx;
	  height: 236rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: space-between;
	  box-sizing: border-box;
	}

	.card-milk { background-color: var(--card-milk); }
	.card-sleep { background-color: var(--card-sleep); }
	.card-poop { background-color: var(--card-poop); }
	.card-height { background-color: var(--card-height); }

	.card-header-icon {
	  display: flex;
	  align-items: center;
	}

	.card-icon {
	  width: 48rpx;
	  height: 48rpx;
	}

	.card-value-box {
	  display: flex;
	  flex-direction: column;
	}

	.value-num {
	  font-size: 48rpx;
	  font-weight: bold;
	}

	.value-desc {
	  font-size: 20rpx;
	  color: var(--text-gray);
	  font-weight: 700;
	  margin-top: 6rpx;
	}

	.text-green {
	  color: #047857;
	}

	/* ==================== 7天奶量大图表卡片 ==================== */
	.chart-card {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 44rpx;
	  margin-bottom: 30rpx;
	  box-sizing: border-box;
	}

	.chart-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 50rpx;
	}

	.chart-title {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.chart-badge {
	  background-color: var(--card-sleep);
	  padding: 8rpx 24rpx;
	  border-radius: 100rpx;
	  display: flex;
	  align-items: center;
	}

	.chart-badge-text {
	  font-size: 20rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	.chart-body {
	  height: 240rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: flex-end;
	  padding: 0 10rpx;
	}

	.chart-bar-item {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  width: 90rpx;
	}

	.bar-value {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	  margin-bottom: 8rpx;
	  white-space: nowrap;
	}

	.bar-track {
	  width: 40rpx;
	  height: 180rpx;
	  background-color: #F5F4FA;
	  border-radius: 100rpx;
	  position: relative;
	  display: flex;
	  align-items: flex-end;
	}

	.bar-fill {
	  width: 100%;
	  border-radius: 100rpx;
	  transition: height 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
	  min-height: 8rpx;
	}

	.bar-normal {
	  background: linear-gradient(180deg, #D1CCFB, #C7C2F0);
	  opacity: 1;
	}

	.bar-highlight {
	  background: linear-gradient(180deg, #8B80F9, #7B70E8);
	  box-shadow: 0 4rpx 16rpx rgba(139, 128, 249, 0.35);
	}

	.bar-day-label {
	  font-size: 24rpx;
	  font-weight: 700;
	  color: var(--text-gray);
	  margin-top: 16rpx;
	}

	.text-highlight {
	  color: var(--baby-purple);
	  font-weight: 900;
	}

	/* ==================== 底部黄色小提示卡片 ==================== */
	.tips-card {
	  background-color: var(--card-vaccine);
	  border-radius: 56rpx;
	  padding: 40rpx;
	  display: flex;
	  flex-direction: row;
	  align-items: flex-start;
	  box-sizing: border-box;
	}

	.tips-icon {
	  width: 64rpx;
	  height: 64rpx;
	  margin-right: 24rpx;
	  flex-shrink: 0;
	}

	.tips-content {
	  display: flex;
	  flex-direction: column;
	  flex: 1;
	}

	.tips-title {
	  font-size: 28rpx;
	  font-weight: 900;
	  color: #78350F;
	}

	.tips-desc {
	  font-size: 22rpx;
	  color: rgba(120, 53, 15, 0.8);
	  font-weight: 600;
	  margin-top: 8rpx;
	  line-height: 1.5;
	}

	@keyframes shimmer {
	  0% { background-position: -400rpx 0; }
	  100% { background-position: 400rpx 0; }
	}

	.skeleton {
	  background: linear-gradient(90deg, #EFEDF5 25%, #E5E0FF 50%, #EFEDF5 75%);
	  background-size: 800rpx 100%;
	  animation: shimmer 1.2s infinite ease-in-out;
	  border-radius: 16rpx;
	}

	.skel-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr;
	  grid-gap: 30rpx;
	  margin-bottom: 30rpx;
	}

	.skel-trend-card {
	  height: 236rpx;
	  border-radius: 56rpx;
	}
</style>
