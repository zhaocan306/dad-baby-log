<template>
	<view class="page">
		<CustomNavbar showBack @back="goBack" />
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-text-group">
			    <text class="title-main">喝奶历史</text>
			    <text class="title-sub">按天查看奶量、方式和间隔</text>
			  </view>
			  <view class="time-badge">
			    <text class="badge-text">7天</text>
			  </view>
			</view>

			<!-- 2. 本周总奶量统计大卡片 -->
			<view class="card-milk-summary shadow-soft">
			  <view class="card-header">
			    <view class="title-with-icon">
			      <image class="summary-card-icon" src="/static/icon-milk.png" mode="aspectFit"></image>
			      <text class="card-title">本周总奶量</text>
			    </view>
			    <view class="status-badge">
			      <text class="status-badge-text">+6%</text>
			    </view>
			  </view>

			  <view class="stats-row">
			    <view class="stat-item">
			      <text class="stat-number">{{ stats.total }}L</text>
			      <text class="stat-label">总量</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">{{ stats.dailyAvg }}ml</text>
			      <text class="stat-label">日均</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">{{ stats.count }}次</text>
			      <text class="stat-label">喂养</text>
			    </view>
			  </view>
			</view>

			<!-- 3. 最近记录列表区域 -->
			<view class="recent-records-section">
			  <view class="records-header">
			    <text class="section-title">最近记录</text>
			    <text class="sort-text">按日期</text>
			  </view>

			  <view class="records-list-container shadow-mini">
			    <view class="record-item" v-for="(r, i) in records" :key="r.id" :class="{ 'no-border': i === records.length - 1 }">
			      <view class="record-left">
			        <image class="record-type-icon" src="/static/list-icon-milk-1.png" mode="aspectFit"></image>
			        <view class="record-meta">
			          <text class="record-name">{{ r.type === 'breast' ? '亲喂' : r.type === 'formula' ? '配方奶' : '奶瓶喂养' }} · {{ r.amount_ml || '' }}ml</text>
			          <text class="record-desc">{{ r.created_at?.slice(11, 16) || '' }} · {{ r.note || '' }}</text>
			        </view>
			      </view>
			      <text class="record-time">{{ r.created_at?.slice(11, 16) || '' }}</text>
			    </view>
			  </view>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import { feedApi } from '@/lib/api/feed'

	export default {
		name: "MilkHistory",
		components: { CustomNavbar },
		data() {
			return {
				stats: { total: '3.42', dailyAvg: '488', count: 28 },
				records: []
			}
		},
		async onShow() {
			await this.loadData()
		},
		methods: {
			async loadData() {
				try {
					const babyId = uni.getStorageSync('current_baby_id')
					if (!babyId) return
					const s = await feedApi.weeklyStats(babyId)
					this.stats = {
						total: (s.total / 1000).toFixed(2),
						dailyAvg: String(Math.round(s.dailyAvg)),
						count: s.count
					}
					this.records = await feedApi.list(babyId)
				} catch (e) {
					console.log('MilkHistory loadData error:', e.message)
				}
			},
			goBack() { uni.navigateBack() }
		}
	}
</script>

<style>
	.page {
		--bg-cream: #FAF9F5;
		--text-dark: #2D283E;
		--text-gray: #8E8A9F;
		--card-milk: #EEF0FF;
		--baby-purple: #8B80F9;

		min-height: 100vh;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  padding: 0 44rpx;
	  height: 100%;
	  width: calc(100% - 88rpx);
	}

	/* ==================== 头部区域 ==================== */
	.header-section {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 44rpx;
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

	.time-badge {
	   display: flex;
	   align-items: center;
	  background-color: #FFFFFF;
	  border: 1px solid rgba(142, 138, 159, 0.1);
	  padding: 12rpx 36rpx;
	  border-radius: 100rpx;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	}

	.badge-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	/* ==================== 统计汇总大卡片 ==================== */
	.card-milk-summary {
	  background-color: var(--card-milk);
	  border-radius: 56rpx;
	  padding: 44rpx;
	  margin-bottom: 44rpx;
	  box-sizing: border-box;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 40rpx;
	}

	.title-with-icon {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	}

	.summary-card-icon {
	  width: 64rpx;
	  height: 64rpx;
	  margin-right: 18rpx;
	}

	.card-title {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.status-badge {
	   display: flex;
	   align-items: center;
	  background-color: rgba(255, 255, 255, 0.7);
	  padding: 6rpx 20rpx;
	  border-radius: 100rpx;
	}

	.status-badge-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: var(--text-dark);
	}

	.stats-row {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	}

	.stat-item {
	  flex: 1;
	  background-color: rgba(255, 255, 255, 0.75);
	  border-radius: 36rpx;
	  padding: 24rpx 10rpx;
	  margin: 0 8rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  box-sizing: border-box;
	}

	.stat-item:first-child {
	  margin-left: 0;
	}

	.stat-item:last-child {
	  margin-right: 0;
	}

	.stat-number {
	  font-size: 30rpx;
	  font-weight: 900;
	}

	.stat-label {
	  font-size: 18rpx;
	  color: var(--text-gray);
	  font-weight: 800;
	  margin-top: 6rpx;
	}

	/* ==================== 最近记录列表 ==================== */
	.recent-records-section {
	  display: flex;
	  flex-direction: column;
	}

	.records-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 24rpx;
	  padding: 0 8rpx;
	}

	.section-title {
	  font-size: 36rpx;
	  font-weight: 900;
	}

	.sort-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	.records-list-container {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 12rpx 36rpx;
	  border: 1px solid rgba(243, 241, 255, 0.6);
	  box-sizing: border-box;
	}

	.shadow-mini {
	  box-shadow: 0 4rpx 24rpx rgba(142, 138, 159, 0.015);
	}

	.record-item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 36rpx 0;
	  border-bottom: 2rpx solid #FBFBFC;
	  box-sizing: border-box;
	}

	.no-border {
	  border-bottom: none;
	}

	.record-left {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	}

	.record-type-icon {
	  width: 80rpx;
	  height: 80rpx;
	  margin-right: 24rpx;
	}

	.record-meta {
	  display: flex;
	  flex-direction: column;
	}

	.record-name {
	  font-size: 28rpx;
	  font-weight: 800;
	}

	.record-desc {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 6rpx;
	}

	.record-time {
	  font-size: 24rpx;
	  font-weight: 700;
	  color: var(--text-gray);
	}
</style>
