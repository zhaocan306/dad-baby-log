<template>
	<view class="page enter-stagger">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">隐私与安全</text>
		</view>

		<view class="card">
			<text class="card-title">数据存储</text>
			<text class="card-text">所有数据存储在 Supabase 云端数据库，使用 HTTPS 加密传输，只有你可以访问。</text>
		</view>

		<view class="card">
			<text class="card-title">数据归属</text>
			<text class="card-text">数据属于你个人，不会与第三方共享。你可以随时在「数据导出」页面查看和导出全部数据。</text>
		</view>

		<view class="card">
			<text class="card-title">删除数据</text>
			<text class="card-text">如果需要删除数据，请在 Supabase 后台操作，或联系开发者。</text>
		</view>
	</view>
</template>

<script>
	export default { name: "PrivacySecurity", methods: { goBack() { uni.navigateBack() } } }
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 40rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; }
	.card { background: #fff; border-radius: 48rpx; padding: 32rpx; margin-bottom: 24rpx; }
	.card-title { font-size: 30rpx; font-weight: 900; margin-bottom: 12rpx; }
	.card-text { font-size: 26rpx; color: #555; line-height: 1.6; }
</style>
