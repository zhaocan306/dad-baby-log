<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-area">
			    <image class="header-icon" src="/static/icon-calendar-header.png" mode="aspectFit"></image>
			    <view class="title-text-group">
			      <text class="title-main">疫苗日历</text>
			      <text class="title-sub">按月龄提醒，不错过关键接种</text>
			    </view>
			  </view>
			  <view class="age-filter-badge">
			    <text class="age-filter-text">1月龄</text>
			  </view>
			</view>

			<!-- 2. 下一针气泡提醒卡片 -->
			<view class="next-vaccine-card shadow-soft">
			  <view class="card-header">
			    <text class="card-title">下一针</text>
			    <view class="countdown-badge">
			      <text class="countdown-text">还剩 2 天</text>
			    </view>
			  </view>

			  <view class="card-body">
			    <view class="vaccine-icon-wrapper">
			      <image class="vaccine-needle-icon" src="/static/icon-needle-orange.png" mode="aspectFit"></image>
			    </view>
			    <view class="vaccine-info-meta">
			      <text class="vaccine-name">乙肝疫苗第 2 针</text>
			      <text class="vaccine-details">7月11日 10:00 · 社区卫生服务中心</text>
			    </view>
			  </view>
			</view>

			<!-- 3. 接种前准备卡片 -->
			<view class="preparation-card shadow-soft mb-6">
			  <text class="preparation-title">接种前准备</text>
			  <view class="prep-list">
			    <view class="prep-item">
			      <image class="prep-icon" src="/static/icon-prep-1.png" mode="aspectFit"></image>
			      <text class="prep-text">带好预防接种本和医保卡</text>
			    </view>
			    <view class="prep-item">
			      <image class="prep-icon" src="/static/icon-prep-2.png" mode="aspectFit"></image>
			      <text class="prep-text">观察体温，发热或腹泻需延后</text>
			    </view>
			    <view class="prep-item">
			      <image class="prep-icon" src="/static/icon-prep-3.png" mode="aspectFit"></image>
			      <text class="prep-text">接种后留观 30 分钟再离开</text>
			    </view>
			  </view>
			</view>

			<!-- 4. 月龄计划历史列表 -->
			<view class="plan-section">
			  <view class="plan-header">
			    <text class="section-title">月龄计划</text>
			    <navigator url="/pages/vaccine-schedule/vaccine-schedule" open-type="navigate" hover-class="none">
			    <view class="btn-all-wrapper">
			      <text class="btn-all-text">全部</text>
			    </view>
			    </navigator>
			  </view>

			  <view class="plan-list-container shadow-mini">
			    <view class="plan-item">
			      <view class="plan-item-left">
			        <image class="list-status-icon" src="/static/list-icon-done.png" mode="aspectFit"></image>
			        <view class="plan-meta">
			          <text class="plan-name">卡介苗 · 乙肝第 1 针</text>
			          <text class="plan-desc">出生 24 小时内 · 已完成</text>
			        </view>
			      </view>
			    </view>

			    <view class="plan-item">
			      <view class="plan-item-left">
			        <image class="list-status-icon" src="/static/list-icon-pending.png" mode="aspectFit"></image>
			        <view class="plan-meta">
			          <text class="plan-name">乙肝第 2 针</text>
			          <text class="plan-desc">1月龄 · 预约中</text>
			        </view>
			      </view>
			    </view>

			    <view class="plan-item no-border">
			      <view class="plan-item-left">
			        <image class="list-status-icon" src="/static/list-icon-future.png" mode="aspectFit"></image>
			        <view class="plan-meta">
			          <text class="plan-name">脊灰灭活疫苗</text>
			          <text class="plan-desc">2月龄 · 待预约</text>
			        </view>
			      </view>
			    </view>
			  </view>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	export default {
		name: "TabHealth",
		components: { CustomNavbar }
	}
</script>

<style>
	.page {
		--bg-cream: #FAF9F5;
		--text-dark: #2D283E;
		--text-gray: #8E8A9F;
		--baby-purple: #8B80F9;

		height: 100vh;
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

	.title-area {
	  display: flex;
	  align-items: center;
	}

	.header-icon {
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

	.age-filter-badge {
	  background-color: #FFFFFF;
	  border: 1px solid rgba(142, 138, 159, 0.1);
	  padding: 12rpx 36rpx;
	  border-radius: 100rpx;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	  display: flex;
	  align-items: center;
	}

	.age-filter-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: #B45309;
	}

	/* ==================== 下一针卡片 ==================== */
	.next-vaccine-card {
	  background-color: #FFF6D6;
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
	  margin-bottom: 36rpx;
	}

	.card-title {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.countdown-badge {
	  background-color: #FFFFFF;
	  padding: 8rpx 24rpx;
	  border-radius: 100rpx;
	  display: flex;
	  align-items: center;
	}

	.countdown-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: #B45309;
	}

	.card-body {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	}

	.vaccine-icon-wrapper {
	  width: 120rpx;
	  height: 120rpx;
	  background-color: #FFFFFF;
	  border-radius: 36rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  margin-right: 28rpx;
	  flex-shrink: 0;
	}

	.vaccine-needle-icon {
	  width: 64rpx;
	  height: 64rpx;
	}

	.vaccine-info-meta {
	  display: flex;
	  flex-direction: column;
	  flex: 1;
	}

	.vaccine-name {
	  font-size: 34rpx;
	  font-weight: 900;
	  line-height: 1.2;
	}

	.vaccine-details {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 700;
	  margin-top: 12rpx;
	  line-height: 1.4;
	}

	/* ==================== 接种前准备卡片 ==================== */
	.preparation-card {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 44rpx;
	  box-sizing: border-box;
	  border: 1px solid rgba(243, 241, 255, 0.4);
	}

	.mb-6 {
	  margin-bottom: 44rpx;
	}

	.preparation-title {
	  font-size: 32rpx;
	  font-weight: 900;
	  margin-bottom: 30rpx;
	  display: block;
	}

	.prep-list {
	  display: flex;
	  flex-direction: column;
	}

	.prep-item {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  margin-bottom: 24rpx;
	}

	.prep-item:last-child {
	  margin-bottom: 0;
	}

	.prep-icon {
	  width: 36rpx;
	  height: 36rpx;
	  margin-right: 20rpx;
	  flex-shrink: 0;
	}

	.prep-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: #3730A3;
	  line-height: 1.2;
	}

	/* ==================== 月龄计划列表 ==================== */
	.plan-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 24rpx;
	  padding: 0 4rpx;
	}

	.section-title {
	  font-size: 36rpx;
	  font-weight: 900;
	}

	.btn-all-wrapper {
	  background-color: #FFFFFF;
	  padding: 8rpx 28rpx;
	  border-radius: 100rpx;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	  border: 1px solid rgba(142, 138, 159, 0.08);
	  display: flex;
	  align-items: center;
	}

	.btn-all-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	.plan-list-container {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 12rpx 36rpx;
	  border: 1px solid rgba(243, 241, 255, 0.6);
	  box-sizing: border-box;
	}

	.shadow-mini {
	  box-shadow: 0 4rpx 24rpx rgba(142, 138, 159, 0.015);
	}

	.plan-item {
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

	.plan-item-left {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	}

	.list-status-icon {
	  width: 80rpx;
	  height: 80rpx;
	  margin-right: 24rpx;
	  flex-shrink: 0;
	}

	.plan-meta {
	  display: flex;
	  flex-direction: column;
	}

	.plan-name {
	  font-size: 28rpx;
	  font-weight: 800;
	}

	.plan-desc {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 6rpx;
	}
</style>
