<template>
	<view class="page">
		<!-- 顶部导航占位 -->
		<CustomNavbar />
		<!-- 用户头部信息 -->
		<UserHeader name="小鲸鱼的一天" tip="来到这个世界 29 天啦" />

		<!-- 奶量卡片 -->
		<view class="milk-card">
			<view class="milk-card__header">
				<view class="milk-card__icon">
					<image src="/static/shuidi.png" />
				</view>
				<text class="milk-card__title">总奶量</text>
				<view class="milk-card__tag">+8%</view>
			</view>

			<view class="milk-card__content">
				<text class="milk-card__value">520</text>
				<text class="milk-card__unit">毫升</text>
			</view>

			<view class="milk-card__decoration">
				<image class="milk-card__decoration-img" src="/static/naiping.png" />
			</view>
		</view>

		<!-- 2x2 网格卡片 -->
		<view class="grid-wrapper">
			<!-- 睡眠卡片 -->
			<view class="grid-card grid-card--purple">
				<view class="grid-card__header">
					<view class="grid-card__icon">
						<image class="grid-card__icon-img" src="/static/shuimian.png" mode="aspectFit" />
					</view>
					<text class="grid-card__title grid-card__title--purple">睡眠</text>
				</view>
				<view class="grid-card__body">
					<text class="grid-card__value">6.5 小时</text>
				</view>
				<view class="grid-card__pill">
					<text class="grid-card__pill-text">下次小睡 14:30</text>
				</view>
			</view>

			<!-- 便便卡片 -->
			<view class="grid-card grid-card--pink">
				<view class="grid-card__header">
					<view class="grid-card__icon">
						<image class="grid-card__icon-img" src="/static/bianbian.png" mode="aspectFit" />
					</view>
					<text class="grid-card__title grid-card__title--pink">便便</text>
				</view>
				<view class="grid-card__poop-body">
					<view class="grid-card__poop-box">
						<image class="grid-card__poop-img" src="/static/niaobu.png" mode="aspectFit" />
					</view>
				</view>
			</view>

			<!-- 身高卡片 -->
			<view class="grid-card grid-card--green height-auto">
				<view class="grid-card__header">
					<image class="grid-card__icon-img" src="/static/shengao.png" mode="aspectFit" />
				</view>
				<view class="grid-card__body">
					<text class="grid-card__subtitle">身高 52.4cm</text>
				</view>
				<text class="grid-card__tip">体重 4.1kg · 本周 +180g</text>
			</view>

			<!-- 疫苗卡片 -->
			<view class="grid-card grid-card--yellow height-auto">
				<view class="grid-card__header">
					<image class="grid-card__icon-img" src="/static/yimiao.png" mode="aspectFit" />
				</view>
				<view class="grid-card__body">
					<text class="grid-card__subtitle grid-card__subtitle--yellow">乙肝第 2 针</text>
				</view>
				<text class="grid-card__tip grid-card__tip--yellow">还剩 2 天 · 带接种本</text>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import UserHeader from "@/components/UserHeader.vue"
	export default {
		name: "TabHome",
		components: {
			CustomNavbar,
			UserHeader
		}
	}
</script>

<style>
	@import url("../../static/styles/home.css");
</style>
