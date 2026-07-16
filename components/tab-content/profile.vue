<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-text-group">
			    <text class="title-main">我的</text>
			    <text class="title-sub">管理宝宝档案、家庭协作和数据</text>
			  </view>
			  <image class="header-setting-icon" src="/static/icon-setting.png" mode="aspectFit"></image>
			</view>

			<!-- 2. 家庭核心数据大卡片 -->
			<view class="card-family shadow-soft">
			  <view class="profile-info-row">
			    <image class="family-avatar" src="/static/family-avatar.png" mode="aspectFit"></image>
			    <view class="profile-meta">
			      <text class="family-name">cc cc 的家庭</text>
			      <text class="baby-detail">小鲸鱼 · 29 天 · 女宝宝</text>
			      <view class="member-badge">
			        <image class="member-badge-icon" src="/static/icon-group.png" mode="aspectFit"></image>
			        <text class="member-badge-text">3 位家人同步记录</text>
			      </view>
			    </view>
			  </view>

			  <view class="stats-row">
			    <view class="stat-item">
			      <text class="stat-number">29</text>
			      <text class="stat-label">记录天</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">186</text>
			      <text class="stat-label">条记录</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number text-green">已同步</text>
			      <text class="stat-label text-green-light">云备份</text>
			    </view>
			  </view>
			</view>

			<!-- 3. 四个功能入口网格 -->
			<view class="grid-4 mb-6">
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-baby.png" mode="aspectFit"></image>
			    <text class="menu-label">宝宝档案</text>
			  </view>
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-members.png" mode="aspectFit"></image>
			    <text class="menu-label">家庭成员</text>
			  </view>
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-notif.png" mode="aspectFit"></image>
			    <text class="menu-label">提醒设置</text>
			  </view>
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-export.png" mode="aspectFit"></image>
			    <text class="menu-label">数据导出</text>
			  </view>
			</view>

			<!-- 4. 照护设置列表 -->
			<view class="settings-panel shadow-soft">
			  <text class="panel-title">照护设置</text>

			  <view class="setting-list">
			    <view class="setting-item">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-green-light" src="/static/setting-curve.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">生长曲线标准</text>
			          <text class="setting-sub-title">WHO 女宝宝 0-2 岁标准</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>

			    <view class="setting-item">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-amber-light" src="/static/setting-time.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">提醒时间</text>
			          <text class="setting-sub-title">喂奶间隔 3 小时，疫苗提前 2 天</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>

			    <view class="setting-item">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-blue-light" src="/static/setting-backup.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">数据备份与导出</text>
			          <text class="setting-sub-title">自动同步，可导出 PDF 给医生</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>

			    <view class="setting-item no-border">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-rose-light" src="/static/setting-privacy.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">隐私与安全</text>
			          <text class="setting-sub-title">家庭成员权限、数据可见范围</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>
			  </view>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	export default {
		name: "TabProfile",
		components: { CustomNavbar }
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

		min-height: 100vh;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  padding: 0 44rpx;
	  height: 100%;
	  width: calc(100% - 88rpx);
	}

	/* ==================== 头部标题区 ==================== */
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

	.header-setting-icon {
	  width: 88rpx;
	  height: 88rpx;
	}

	/* ==================== 家庭信息大卡片 ==================== */
	.card-family {
	  background-color: var(--card-milk);
	  border-radius: 56rpx;
	  padding: 44rpx;
	  margin-bottom: 40rpx;
	  box-sizing: border-box;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.profile-info-row {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  margin-bottom: 40rpx;
	}

	.family-avatar {
	  width: 112rpx;
	  height: 112rpx;
	  border-radius: 50%;
	  margin-right: 28rpx;
	}

	.profile-meta {
	  display: flex;
	  flex-direction: column;
	}

	.family-name {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.baby-detail {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 4rpx;
	}

	.member-badge {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  align-self: flex-start;
	  background-color: rgba(255, 255, 255, 0.7);
	  padding: 6rpx 18rpx;
	  border-radius: 100rpx;
	  margin-top: 10rpx;
	}

	.member-badge-icon {
	  width: 22rpx;
	  height: 22rpx;
	  margin-right: 8rpx;
	}

	.member-badge-text {
	  font-size: 18rpx;
	  color: var(--baby-purple);
	  font-weight: 800;
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

	.text-green { color: #10B981; }
	.text-green-light { color: rgba(16, 185, 129, 0.7); }

	/* ==================== 四个功能入口网格 ==================== */
	.grid-4 {
	  display: grid;
	  grid-template-columns: repeat(4, 1fr);
	  grid-gap: 20rpx;
	}

	.mb-6 {
	  margin-bottom: 44rpx;
	}

	.menu-card {
	  background-color: #FFFFFF;
	  border-radius: 40rpx;
	  padding: 28rpx 8rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  border: 1px solid rgba(243, 241, 255, 0.5);
	  box-sizing: border-box;
	}

	.shadow-mini {
	  box-shadow: 0 4rpx 16rpx rgba(142, 138, 159, 0.02);
	}

	.menu-icon {
	  width: 52rpx;
	  height: 52rpx;
	  margin-bottom: 12rpx;
	}

	.menu-label {
	  font-size: 20rpx;
	  font-weight: 800;
	}

	/* ==================== 照护设置列表面板 ==================== */
	.settings-panel {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 44rpx;
	  border: 1px solid rgba(243, 241, 255, 0.5);
	  box-sizing: border-box;
	}

	.panel-title {
	  font-size: 32rpx;
	  font-weight: 900;
	  margin-bottom: 24rpx;
	  display: block;
	}

	.setting-list {
	  display: flex;
	  flex-direction: column;
	}

	.setting-item {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: center;
	  padding: 24rpx 0;
	  border-bottom: 2rpx solid #FBFBFC;
	}

	.no-border {
	  border-bottom: none;
	}

	.setting-item-left {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  flex: 1;
	  padding-right: 20rpx;
	}

	.setting-icon {
	  width: 64rpx;
	  height: 64rpx;
	  border-radius: 50%;
	  padding: 10rpx;
	  box-sizing: border-box;
	  margin-right: 24rpx;
	  flex-shrink: 0;
	}

	.bg-green-light { background-color: var(--card-height); }
	.bg-amber-light { background-color: var(--card-vaccine); }
	.bg-blue-light { background-color: var(--card-milk); }
	.bg-rose-light { background-color: var(--card-poop); }

	.setting-text {
	  display: flex;
	  flex-direction: column;
	}

	.setting-main-title {
	  font-size: 26rpx;
	  font-weight: 900;
	}

	.setting-sub-title {
	  font-size: 18rpx;
	  color: var(--text-gray);
	  font-weight: 700;
	  margin-top: 6rpx;
	}

	.arrow-icon {
	  width: 14rpx;
	  height: 24rpx;
	  flex-shrink: 0;
	}
</style>
