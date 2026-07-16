<template>
	<scroll-view class="page" scroll-y>
		<!-- 顶部导航占位 -->
		<CustomNavbar />
		<!-- 用户头部信息 -->
		<UserHeader name="小鲸鱼的一天" tip="来到这个世界 29 天啦" />

		<!-- 奶量卡片 -->
		<navigator url="/pages/milk-history/milk-history" open-type="navigate" hover-class="none">
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
		</navigator>

		<!-- 2x2 网格卡片 -->
		<view class="grid-wrapper">
			<!-- 睡眠卡片 -->
			<navigator url="/pages/sleep-history/sleep-history" open-type="navigate" hover-class="none">
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
			</navigator>

			<!-- 便便卡片 -->
			<navigator url="/pages/poop-history/poop-history" open-type="navigate" hover-class="none">
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
			</navigator>

			<!-- 身高卡片 -->
			<navigator url="/pages/height-history/height-history" open-type="navigate" hover-class="none">
			<view class="grid-card grid-card--green height-auto">
				<view class="grid-card__header">
					<image class="grid-card__icon-img" src="/static/shengao.png" mode="aspectFit" />
				</view>
				<view class="grid-card__body">
					<text class="grid-card__subtitle">身高 52.4cm</text>
				</view>
				<text class="grid-card__tip">体重 4.1kg · 本周 +180g</text>
			</view>
			</navigator>

			<!-- 疫苗卡片 -->
			<navigator url="/pages/vaccine-history/vaccine-history" open-type="navigate" hover-class="none">
			<view class="grid-card grid-card--yellow height-auto">
				<view class="grid-card__header">
					<image class="grid-card__icon-img" src="/static/yimiao.png" mode="aspectFit" />
				</view>
				<view class="grid-card__body">
					<text class="grid-card__subtitle grid-card__subtitle--yellow">乙肝第 2 针</text>
				</view>
				<text class="grid-card__tip grid-card__tip--yellow">还剩 2 天 · 带接种本</text>
			</view>
			</navigator>
		</view>

		<!-- 5. 最近活动列表 -->
		<view class="recent-activities">
		  <view class="recent-header">
		    <text class="section-title">最近活动</text>
		    <view class="btn-all-wrapper">
		      <text class="btn-text">查看全部</text>
		    </view>
		  </view>

		  <view class="activity-list">
		    <view class="activity-item shadow-mini">
		      <view class="activity-left">
		        <image class="activity-icon-img" src="/static/list-icon-milk-1.png" mode="aspectFit"></image>
		        <view class="activity-meta">
		          <text class="activity-name">奶瓶喂养</text>
		          <text class="activity-desc">120ml · 左侧拍嗝 6 分钟</text>
		        </view>
		      </view>
		      <text class="activity-time">09:20</text>
		    </view>

		    <view class="activity-item shadow-mini">
		      <view class="activity-left">
		        <image class="activity-icon-img" src="/static/list-icon-poop-1.png" mode="aspectFit"></image>
		        <view class="activity-meta">
		          <text class="activity-name">黄金便便</text>
		          <text class="activity-desc">量中 · 软糊状 · 已换尿布</text>
		        </view>
		      </view>
		      <text class="activity-time">08:45</text>
		    </view>
		  </view>
		</view>

		<view class="footer-tip">
		  <text class="footer-tip-text">~ 到底啦 ~</text>
		</view>
	</scroll-view>
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
