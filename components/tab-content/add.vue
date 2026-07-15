<template>
	<view class="page">
		<CustomNavbar showBack title="添加记录" @back="onBack" />
		<view class="content">
			<text class="page-title">添加记录</text>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	export default {
		name: "TabAdd",
		components: { CustomNavbar },
		methods: {
			onBack() {
				this.$emit("back")
			}
		}
	}
</script>

<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 90px;
	}
	.page-title {
		font-size: 48rpx;
		color: #333;
	}
</style>
