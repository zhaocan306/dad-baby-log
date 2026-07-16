<template>
	<view class="page">
		<CustomNavbar showBack @back="goBack" />
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-text-group">
			    <text class="title-main">疫苗日程</text>
			    <text class="title-sub">全国通用规则，支持新增和删除里程碑卡片</text>
			  </view>
			</view>

			<!-- 2. 接种计划设置卡片 -->
			<view class="card-settings shadow-soft">
			  <text class="settings-title">接种计划设置</text>
			  <text class="settings-desc">默认按全国通用规则生成里程碑。你可以按需要新增自定义卡片，或删除不需要的卡片。</text>
			  <view class="switch-row">
			    <text class="switch-label">显示自费推荐</text>
			    <image class="switch-img" src="/static/switch-active.png" mode="aspectFit"></image>
			  </view>
			</view>

			<!-- 3. 第一层过滤 Tab -->
			<view class="filter-tabs-row">
			  <view class="tab-capsule active-tab">
			    <text class="capsule-text text-white">全部</text>
			  </view>
			  <view class="tab-capsule">
			    <text class="capsule-text">免费</text>
			  </view>
			  <view class="tab-capsule">
			    <text class="capsule-text">自费</text>
			  </view>
			  <view class="tab-capsule">
			    <text class="capsule-text">待确认</text>
			  </view>
			</view>

			<!-- 4. 第二层过滤 Tab：彩色数字方块 -->
			<view class="grid-stats mb-6">
			  <view class="stat-block bg-green-light">
			    <text class="stat-label text-green">免费</text>
			    <text class="stat-count text-green">22</text>
			  </view>
			  <view class="stat-block bg-poop-light">
			    <text class="stat-label text-poop">自费</text>
			    <text class="stat-count text-poop">29</text>
			  </view>
			  <view class="stat-block bg-blue-light">
			    <text class="stat-label text-blue">待确认</text>
			    <text class="stat-count text-blue">0</text>
			  </view>
			  <view class="stat-block bg-rose-light">
			    <text class="stat-label text-rose">逾期</text>
			    <text class="stat-count text-rose">1</text>
			  </view>
			  <view class="stat-block bg-milk-light">
			    <text class="stat-label text-milk">完成</text>
			    <text class="stat-count text-milk">10</text>
			  </view>
			</view>

			<!-- 5. 接种里程碑列表 -->
			<view class="milestone-section">
			  <view class="milestone-header">
			    <text class="section-title">接种里程碑</text>
			    <view class="btn-add-milestone">
			      <image class="add-icon" src="/static/icon-add-purple.png" mode="aspectFit"></image>
			      <text class="add-text">新增</text>
			    </view>
			  </view>

			  <view class="milestone-list">
			    <view class="milestone-card shadow-soft mb-4">
			      <view class="card-main-row">
			        <view class="card-left-info">
			          <image class="vaccine-icon" src="/static/icon-vaccine-needle.png" mode="aspectFit"></image>
			          <view class="vaccine-meta">
			            <text class="vaccine-name">卡介苗 · 第 1 剂</text>
			            <text class="vaccine-desc">建议里程碑：0 月龄</text>
			            <text class="vaccine-desc">应接种：2026/03/22</text>
			          </view>
			        </view>
			        <view class="card-right-badges">
			          <text class="status-badge bg-rose-badge text-rose-badge">已逾期</text>
			          <text class="status-badge bg-green-badge text-green-badge mt-2">国家免费</text>
			        </view>
			      </view>
			      <view class="action-row mt-4">
			        <view class="btn-mark-done">
			          <image class="btn-done-icon" src="/static/icon-done-white.png" mode="aspectFit"></image>
			          <text class="btn-done-text">标记完成</text>
			        </view>
			      </view>
			    </view>

			    <view class="milestone-card shadow-soft mb-4">
			      <view class="card-main-row">
			        <view class="card-left-info">
			          <image class="vaccine-icon" src="/static/icon-vaccine-needle.png" mode="aspectFit"></image>
			          <view class="vaccine-meta">
			            <text class="vaccine-name">乙肝疫苗 · 第 1 剂</text>
			            <text class="vaccine-desc">建议里程碑：0 月龄</text>
			            <text class="vaccine-desc">应接种：2026/03/22</text>
			          </view>
			        </view>
			        <view class="card-right-badges">
			          <text class="status-badge bg-green-badge text-green-badge">已完成</text>
			        </view>
			      </view>
			      <view class="done-footer-row mt-4">
			        <text class="done-time-text">已于 2026/03/23 <text class="text-green-weight">完成接种</text></text>
			        <view class="btn-modify-date">
			          <text class="modify-text">修改日期</text>
			        </view>
			      </view>
			    </view>

			    <view class="milestone-card shadow-soft">
			      <view class="card-main-row">
			        <view class="card-left-info">
			          <image class="vaccine-icon" src="/static/icon-vaccine-needle.png" mode="aspectFit"></image>
			          <view class="vaccine-meta">
			            <text class="vaccine-name">乙肝疫苗 · 第 2 剂</text>
			            <text class="vaccine-desc">1 月龄 · 预约中 · 国家免费</text>
			          </view>
			        </view>
			        <view class="card-right-badges">
			          <text class="status-badge bg-blue-badge text-blue-badge">待确认</text>
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
		name: "VaccineSchedule",
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
		--baby-purple: #8B80F9;
		--color-green: #047857;
		--color-poop: #8E7C77;
		--color-blue: #2563EB;
		--color-rose: #E11D48;
		--color-milk: #4338CA;
		--card-height: #EBF4ED;
		--card-poop: #F7E5DE;
		--card-milk: #EEF0FF;
		--card-sleep: #E8E5FF;
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
	  align-items: center;
	  margin-bottom: 40rpx;
	}

	.title-text-group {
	  display: flex;
	  flex-direction: column;
	  flex: 1;
	  padding-right: 20rpx;
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
	  line-height: 1.3;
	}

	/* ==================== 接种计划设置卡片 ==================== */
	.card-settings {
	  background-color: #FFFFFF;
	  border-radius: 48rpx;
	  padding: 40rpx;
	  margin-bottom: 40rpx;
	  box-sizing: border-box;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.settings-title {
	  font-size: 32rpx;
	  font-weight: 900;
	  display: block;
	}

	.settings-desc {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  line-height: 1.5;
	  margin-top: 14rpx;
	  display: block;
	}

	.switch-row {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-top: 36rpx;
	  border-top: 2rpx solid #FBFBFC;
	  padding-top: 30rpx;
	}

	.switch-label {
	  font-size: 28rpx;
	  font-weight: 900;
	}

	.switch-img {
	  width: 110rpx;
	  height: 60rpx;
	}

	/* ==================== 过滤 Tab 胶囊 ==================== */
	.filter-tabs-row {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  margin-bottom: 30rpx;
	}

	.tab-capsule {
	  background-color: #FFFFFF;
	  padding: 14rpx 40rpx;
	  border-radius: 100rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  box-sizing: border-box;
	}

	.active-tab {
	  background-color: var(--baby-purple) !important;
	}

	.capsule-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: var(--text-gray);
	}

	.text-white {
	  color: #FFFFFF;
	}

	/* ==================== 彩色数字方块 ==================== */
	.grid-stats {
	  display: grid;
	  grid-template-columns: repeat(5, 1fr);
	  grid-gap: 16rpx;
	}

	.mb-6 {
	  margin-bottom: 44rpx;
	}

	.stat-block {
	  border-radius: 36rpx;
	  padding: 16rpx 4rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  box-sizing: border-box;
	}

	.bg-green-light { background-color: #EBF4ED; }
	.bg-poop-light { background-color: #F7E5DE; }
	.bg-blue-light { background-color: #EEF0FF; }
	.bg-rose-light { background-color: #FFF1F2; }
	.bg-milk-light { background-color: #F3F1FF; }

	.stat-label {
	  font-size: 20rpx;
	  font-weight: 800;
	}

	.stat-count {
	  font-size: 32rpx;
	  font-weight: 900;
	  margin-top: 6rpx;
	}

	.text-green { color: var(--color-green); }
	.text-poop { color: var(--color-poop); }
	.text-blue { color: var(--color-blue); }
	.text-rose { color: var(--color-rose); }
	.text-milk { color: var(--color-milk); }

	/* ==================== 接种里程碑 ==================== */
	.milestone-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 30rpx;
	  padding: 0 4rpx;
	}

	.section-title {
	  font-size: 36rpx;
	  font-weight: 900;
	}

	.btn-add-milestone {
	  background-color: #FFFFFF;
	  border: 1px solid rgba(142, 138, 159, 0.1);
	  padding: 10rpx 28rpx;
	  border-radius: 100rpx;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	}

	.add-icon {
	  width: 22rpx;
	  height: 22rpx;
	  margin-right: 8rpx;
	}

	.add-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	.milestone-list {
	  display: flex;
	  flex-direction: column;
	}

	.mb-4 {
	  margin-bottom: 30rpx;
	}

	.milestone-card {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 40rpx;
	  box-sizing: border-box;
	  border: 1px solid rgba(243, 241, 255, 0.4);
	}

	.card-main-row {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: flex-start;
	}

	.card-left-info {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	}

	.vaccine-icon {
	  width: 80rpx;
	  height: 80rpx;
	  margin-right: 24rpx;
	}

	.vaccine-meta {
	  display: flex;
	  flex-direction: column;
	}

	.vaccine-name {
	  font-size: 30rpx;
	  font-weight: 900;
	  margin-bottom: 6rpx;
	}

	.vaccine-desc {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 4rpx;
	}

	.card-right-badges {
	  display: flex;
	  flex-direction: column;
	  align-items: flex-end;
	}

	.status-badge {
	  font-size: 20rpx;
	  font-weight: 800;
	  padding: 6rpx 20rpx;
	  border-radius: 100rpx;
	  white-space: nowrap;
	}

	.bg-rose-badge { background-color: #FFE4E6; }
	.text-rose-badge { color: var(--color-rose); }
	.bg-green-badge { background-color: #D1FAE5; }
	.text-green-badge { color: var(--color-green); }
	.bg-blue-badge { background-color: #DBEAFE; }
	.text-blue-badge { color: var(--color-blue); }

	.mt-2 { margin-top: 12rpx; }
	.mt-4 { margin-top: 30rpx; }

	.action-row {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	}

	.btn-mark-done {
	  flex: 1;
	  background-color: var(--baby-purple);
	  border-radius: 36rpx;
	  padding: 22rpx 0;
	  display: flex;
	  flex-direction: row;
	  justify-content: center;
	  align-items: center;
	  margin-right: 20rpx;
	  box-shadow: 0 6rpx 20rpx rgba(139, 128, 249, 0.15);
	}

	.btn-done-icon {
	  width: 26rpx;
	  height: 26rpx;
	  margin-right: 10rpx;
	}

	.btn-done-text {
	  font-size: 24rpx;
	  font-weight: 900;
	  color: #FFFFFF;
	}

	.btn-close-icon {
	  width: 80rpx;
	  height: 80rpx;
	  flex-shrink: 0;
	}

	.done-footer-row {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: center;
	  border-top: 2rpx dashed #F3F1FF;
	  padding-top: 24rpx;
	}

	.done-time-text {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 700;
	}

	.text-green-weight {
	  color: var(--color-green);
	  font-weight: 900;
	}

	.btn-modify-date {
	  background-color: #F3F4F6;
	  padding: 8rpx 24rpx;
	  border-radius: 100rpx;
	}

	.modify-text {
	  font-size: 20rpx;
	  font-weight: 800;
	  color: var(--text-dark);
	}
</style>
