<template>
	<view class="header">
		<view class="flex">
			<image class="header-img" src="/static/header.png" mode="aspectFit" />
			<view class="header-detail">
				<text class="header-detail-name">{{ name }}</text>
				<text class="header-detail-tip">{{ tip }}</text>
			</view>
		</view>
		<view class="header-notice">
			<image class="header-notice-img" src="/static/notice.png" mode="aspectFit" />
		</view>
	</view>
</template>

<script>
	export default {
		name: "UserHeader",
		props: {
			name: { type: String, default: "" },
			tip: { type: String, default: "" }
		}
	}
</script>

<style scoped>
	.header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		box-sizing: border-box;
	}

	.flex {
		display: flex;
		align-items: center;
	}

	.header-img {
		width: 112rpx;
		height: 112rpx;
		margin-right: 28rpx;
	}

	.header-detail {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 112rpx;
	}

	.header-detail-name {
		font-weight: 900;
		color: #2f2f43;
		font-size: 48rpx;
		letter-spacing: -0.02em;
		line-height: 1.05;
		padding-bottom: 8rpx;
	}

	.header-detail-tip {
		font-weight: 500;
		color: #77758c;
		font-size: 30rpx;
		line-height: 1.2;
	}

	.header-notice {
		width: 108rpx;
		height: 108rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0px 24rpx 48rpx 0px rgba(93, 89, 130, 0.08);
		background-color: #ffffff;
		border-radius: 100rpx;
		border: 1px solid rgba(154, 151, 221, 0.18);
	}

	.header-notice-img {
		width: 52rpx;
		height: 52rpx;
	}
</style>
