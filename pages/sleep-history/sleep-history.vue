<template>
	<view class="page">
		<CustomNavbar showBack @back="goBack" />
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-text-group">
			    <text class="title-main">睡眠历史</text>
			    <text class="title-sub">查看小睡、夜睡和夜醒情况</text>
			  </view>
			  <view class="time-badge">
			    <text class="badge-text">7天</text>
			  </view>
			</view>

			<!-- 2. 本周睡眠统计大卡片 -->
			<view class="card-sleep-summary shadow-soft">
			  <view class="card-header">
			    <view class="title-with-icon">
			      <image class="summary-card-icon" src="/static/icon-sleep-summary.png" mode="aspectFit"></image>
			      <text class="card-title">本周睡眠</text>
			    </view>
			    <view class="status-badge">
			      <text class="status-badge-text">+0.8h</text>
			    </view>
			  </view>

			  <view class="stats-row">
			    <view class="stat-item">
			      <text class="stat-number">110h</text>
			      <text class="stat-label">总时长</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">15.8h</text>
			      <text class="stat-label">日均</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">6次</text>
			      <text class="stat-label">夜醒</text>
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
			    <view class="record-item">
			      <view class="record-left">
			        <image class="record-type-icon" src="/static/list-icon-nap.png" mode="aspectFit"></image>
			        <view class="record-meta">
			          <text class="record-name">日间小睡 · 2小时</text>
			          <text class="record-desc">今天 13:20 · 抱睡后放床</text>
			        </view>
			      </view>
			      <text class="record-time">13:20</text>
			    </view>

			    <view class="record-item">
			      <view class="record-left">
			        <image class="record-type-icon" src="/static/list-icon-night-sleep.png" mode="aspectFit"></image>
			        <view class="record-meta">
			          <text class="record-name">夜间睡眠 · 4.5小时</text>
			          <text class="record-desc">昨晚 22:10 · 夜醒 1 次</text>
			        </view>
			      </view>
			      <text class="record-time">22:10</text>
			    </view>

			    <view class="record-item no-border">
			      <view class="record-left">
			        <image class="record-type-icon" src="/static/list-icon-nap.png" mode="aspectFit"></image>
			        <view class="record-meta">
			          <text class="record-name">晨间回笼觉 · 50分钟</text>
			          <text class="record-desc">昨天 06:40 · 奶后入睡</text>
			        </view>
			      </view>
			      <text class="record-time">06:40</text>
			    </view>
			  </view>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	export default {
		name: "SleepHistory",
		components: { CustomNavbar },
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.page {
		--bg-cream: #FAF9F5;
		--text-dark: #2D283E;
		--text-gray: #8E8A9F;
		--card-sleep: #E8E5FF;
		--baby-purple: #8B80F9;
		--card-height: #EBF4ED;
		--card-poop: #F7E5DE;
		--card-milk: #EEF0FF;
		--card-vaccine: #FFF6D6;

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

	/* ==================== 本周睡眠大卡片 ==================== */
	.card-sleep-summary {
	  background-color: var(--card-sleep);
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
