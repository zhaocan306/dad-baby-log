<template>
	<view class="custom-navbar">
		<view class="nav-left">
			<image v-if="showBack" src="/static/back.png" mode="aspectFit" class="back-icon" @tap="onBack" />
		</view>
		<view class="nav-center">
			<text v-if="title" class="nav-title">{{ title }}</text>
		</view>
		<view class="nav-right"></view>
	</view>
</template>

<script>
	export default {
		name: "CustomNavbar",
		props: {
			showBack: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ""
			}
		},
		methods: {
			onBack() {
				this.$emit("back")
			}
		}
	}
</script>

<style scoped>
	.custom-navbar {
		box-sizing: border-box;
		width: 100%;
		height: 88px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		padding-top: 44px;
		flex-shrink: 0;
	}

	.nav-left {
		width: 46px;
		height: 46px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.back-icon {
		width: 46px;
		height: 46px;
	}

	.nav-center {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav-title {
		font-size: 36rpx;
		font-weight: 500;
		color: #333;
	}

	.nav-right {
		width: 46px;
		height: 46px;
	}
</style>
