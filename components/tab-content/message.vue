<template>
	<view class="page">
		<CustomNavbar title="消息" />
		<view class="content">
			<text class="page-title">消息</text>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	export default {
		name: "TabMessage",
		components: { CustomNavbar }
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
