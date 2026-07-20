<template>
	<view class="page enter-stagger">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">生长曲线标准</text>
		</view>

		<view class="card">
			<text class="card-title">WHO 儿童生长标准</text>
			<text class="card-text">世界卫生组织（WHO）发布的 0-5 岁儿童生长标准，基于全球多中心母乳喂养儿童数据制定。</text>
		</view>

		<view class="card">
			<text class="card-title">年龄范围</text>
			<text class="card-text">当前标准适用于 0-2 岁女宝宝。系统会根据宝宝的月龄自动匹配对应的百分位曲线。</text>
		</view>

		<view class="card">
			<text class="card-title">指标说明</text>
			<view class="indicator-item"><text class="ind-label">身高</text><text class="ind-desc">反映长期营养状况</text></view>
			<view class="indicator-item"><text class="ind-label">体重</text><text class="ind-desc">反映近期营养状况</text></view>
			<view class="indicator-item"><text class="ind-label">头围</text><text class="ind-desc">反映大脑发育情况</text></view>
		</view>

		<navigator url="/pages/growth-chart/growth-chart" open-type="navigate" hover-class="none">
			<view class="chart-btn">查看宝宝成长曲线</view>
		</navigator>
	</view>
</template>

<script>
	export default { name: "GrowthStandard", methods: { goBack() { uni.navigateBack() } } }
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 40rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; }
	.card { background: #fff; border-radius: 48rpx; padding: 32rpx; margin-bottom: 24rpx; }
	.card-title { font-size: 30rpx; font-weight: 900; margin-bottom: 12rpx; }
	.card-text { font-size: 26rpx; color: #555; line-height: 1.6; }
	.indicator-item { display: flex; justify-content: space-between; padding: 16rpx 0; border-bottom: 2rpx solid #F5F5F5; }
	.ind-label { font-size: 26rpx; font-weight: 800; }
	.ind-desc { font-size: 24rpx; color: #8E8A9F; }
	.chart-btn { margin-top: 24rpx; background: #8B80F9; border-radius: 48rpx; padding: 28rpx 0; text-align: center; font-size: 30rpx; font-weight: 900; color: #fff; box-shadow: 0 12rpx 32rpx rgba(139,128,249,0.22); }
</style>
