<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 页面头部标题区域 -->
			<view class="header-section">
			  <view class="title-area">
			    <image class="trend-header-icon" src="/static/icon-trend-header.png" mode="aspectFit"></image>
			    <view class="title-text-group">
			      <text class="title-main">成长趋势</text>
			      <text class="title-sub">按周查看喝奶、睡眠和成长变化</text>
			    </view>
			  </view>
			  <view class="weekly-badge">
			    <text class="badge-text">本周</text>
			  </view>
			</view>

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
			    <text class="tips-desc">宝宝今天奶量集中在上午，下午可以提前准备一次安抚小睡。</text>
			  </view>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
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
		      milkTotal: '3.42',
		      milkChange: '+6%',
		      sleepAvg: '15.8',
		      nightWakes: '2',
		      poopCount: '9',
		      weightGain: '+180g',
		      dailyAvgMl: '488',
		      barData: [],
		      rpxToPxSuffix: 'rpx'
		    };
		  },
		  async onShow() {
		    await this.loadData()
		  },
		  methods: {
		    async loadData() {
		      try {
		        const babyId = uni.getStorageSync('current_baby_id')
		        if (!babyId) return

		        const [feedStats, sleepStats, poopStats, heightLatest] = await Promise.all([
		          feedApi.weeklyStats(babyId),
		          sleepApi.weeklyStats(babyId),
		          poopApi.weeklyStats(babyId),
		          heightApi.latest(babyId)
		        ])

		        this.milkTotal = (feedStats.total / 1000).toFixed(2) + 'L'
		        this.dailyAvgMl = String(Math.round(feedStats.dailyAvg))

		        this.sleepAvg = (sleepStats.dailyAvg || 15.8) + 'h'
		        this.nightWakes = String(sleepStats.totalWakes || 2)

		        this.poopCount = String(poopStats.total || 9) + ' 次'

		        if (heightLatest) {
		          this.weightGain = '+' + Math.round((heightLatest.weight_kg - 4.0) * 1000) + 'g'
		        }

		        // 7天柱状图
		        const daily = feedStats.dailyMap || {}
		        const maxVal = Math.max(...Object.values(daily), 1)
		        const today = new Date()
		        const bars = []
		        for (let i = 6; i >= 0; i--) {
		          const d = new Date(today)
		          d.setDate(d.getDate() - i)
		          const key = d.toISOString().slice(0, 10)
		          const val = daily[key] || 0
		          bars.push({
		            day: DAY_NAMES[d.getDay()],
		            percentage: Math.round((val / maxVal) * 130),
		            highlight: i === 0
		          })
		        }
		        this.barData = bars
		      } catch (e) {
		        console.log('Trend loadData error:', e.message)
		      }
		    }
		  }
	}
</script>

<style>
	.page {
		--bg-cream: #FAF9F5;
		--text-dark: #2D283E;
		--text-gray: #8E8A9F;
		--card-milk: #EEF0FF;
		--card-sleep: #E8E5FF;
		--card-poop: #F7E5DE;
		--card-height: #EBF4ED;
		--card-vaccine: #FFF6D6;
		--baby-purple: #8B80F9;

		height: 100vh;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  height: 100%;
	  padding: 0 44rpx;
	  width: calc(100% - 88rpx);
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
	  width: 50rpx;
	}

	.bar-track {
	  width: 32rpx;
	  height: 180rpx;
	  background-color: transparent;
	  position: relative;
	  display: flex;
	  align-items: flex-end;
	}

	.bar-fill {
	  width: 100%;
	  border-radius: 100rpx;
	  transition: height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.bar-normal {
	  background-color: #C7D2FE;
	  opacity: 0.8;
	}

	.bar-highlight {
	  background-color: var(--baby-purple);
	}

	.bar-day-label {
	  font-size: 22rpx;
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
</style>
