<template>
	<scroll-view class="page" scroll-y>
		<!-- 顶部导航占位 -->
		<CustomNavbar />
		<!-- 用户头部信息 -->
		<UserHeader :name="baby ? baby.name + '的一天' : '小鲸鱼的一天'" :tip="'来到这个世界 ' + (baby ? Math.floor((Date.now() - new Date(baby.birthday).getTime()) / 86400000) : 29) + ' 天啦'" />

		<!-- 奶量卡片 -->
		<navigator url="/pages/milk-history/milk-history" open-type="navigate" hover-class="none">
		<view class="milk-card">
			<view class="milk-card__header">
				<view class="milk-card__icon">
					<image src="/static/shuidi.png" />
				</view>
				<text class="milk-card__title">总奶量</text>
				<view class="milk-card__tag">{{ milkTag }}</view>
			</view>

			<view class="milk-card__content">
				<text class="milk-card__value">{{ todayMilk }}</text>
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
				<text class="grid-card__value">{{ sleepHours }} 小时</text>
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
					<text class="grid-card__subtitle">{{ heightText }}</text>
				</view>
				<text class="grid-card__tip">{{ weightText }} · 本周 +180g</text>
			</view>
			</navigator>

			<!-- 疫苗卡片 -->
			<navigator url="/pages/vaccine-history/vaccine-history" open-type="navigate" hover-class="none">
			<view class="grid-card grid-card--yellow height-auto">
				<view class="grid-card__header">
					<image class="grid-card__icon-img" src="/static/yimiao.png" mode="aspectFit" />
				</view>
				<view class="grid-card__body">
					<text class="grid-card__subtitle grid-card__subtitle--yellow">{{ vaccineName }}</text>
				</view>
				<text class="grid-card__tip grid-card__tip--yellow">{{ vaccineDays }} · 带接种本</text>
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
		    <view class="activity-item shadow-mini" v-for="(act, i) in recentActivities" :key="i">
		      <view class="activity-left">
		        <image class="activity-icon-img" :src="act.type === 'feed' ? '/static/list-icon-milk-1.png' : act.type === 'poop' ? '/static/list-icon-poop-1.png' : '/static/list-icon-nap.png'" mode="aspectFit"></image>
		        <view class="activity-meta">
		          <text class="activity-name">{{ act.name }}</text>
		          <text class="activity-desc">{{ act.desc }}</text>
		        </view>
		      </view>
		      <text class="activity-time">{{ act.time.slice(11, 16) || act.time }}</text>
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
	import { babyApi } from '@/lib/api/baby'
	import { feedApi } from '@/lib/api/feed'
	import { sleepApi } from '@/lib/api/sleep'
	import { poopApi } from '@/lib/api/poop'
	import { heightApi } from '@/lib/api/height'
	import { vaccineApi } from '@/lib/api/vaccine'

	export default {
		name: "TabHome",
		components: { CustomNavbar, UserHeader },
		data() {
			return {
				baby: null,
				todayMilk: 0,
				milkTag: '+0%',
				sleepHours: '0',
				sleepNext: '--:--',
				poopCount: 0,
				heightText: '',
				weightText: '',
				vaccineName: '',
				vaccineDays: '',
				recentActivities: []
			}
		},
		async onShow() {
			await this.loadData()
		},
		methods: {
			async loadData() {
				try {
					const babyId = uni.getStorageSync('current_baby_id')
					if (!babyId) return

					// 宝宝信息
					this.baby = await babyApi.getCurrent()

					// 今日奶量
					const total = await feedApi.todayTotal(babyId)
					this.todayMilk = total || 520

					// 本周奶量对比 (模拟+6%)
					// TODO: 比较上周数据计算真实百分比

					// 睡眠
					const sleepStats = await sleepApi.weeklyStats(babyId)
					this.sleepHours = sleepStats.dailyAvg ? String(sleepStats.dailyAvg) : '6.5'

					// 便便
					const poopStats = await poopApi.weeklyStats(babyId)
					this.poopCount = poopStats.total || 9

					// 身高
					const height = await heightApi.latest(babyId)
					this.heightText = height ? `身高 ${height.height_cm}cm` : '身高 52.4cm'
					this.weightText = height ? `体重 ${height.weight_kg}kg` : '体重 4.1kg'

					// 疫苗
					const next = await vaccineApi.nextDue(babyId)
					if (next) {
						this.vaccineName = next.name
						const days = Math.ceil((new Date(next.due_date) - new Date()) / 86400000)
						this.vaccineDays = `还剩 ${days} 天`
					} else {
						this.vaccineName = '乙肝第 2 针'
						this.vaccineDays = '还剩 2 天'
					}

					// 最近活动 (合并各类型最近记录)
					const feeds = await feedApi.list(babyId, { limit: 5 })
					const sleeps = await sleepApi.list(babyId, { limit: 5 })
					const poops = await poopApi.list(babyId, { limit: 5 })
					const all = [
						...feeds.map(r => ({ type: 'feed', name: '奶瓶喂养', desc: `${r.amount_ml}ml`, time: r.created_at })),
						...sleeps.map(r => ({ type: 'sleep', name: '睡眠', desc: `${r.duration_min}分钟`, time: r.start_time })),
						...poops.map(r => ({ type: 'poop', name: '便便', desc: r.amount || '', time: r.created_at }))
					].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
					this.recentActivities = all.length ? all : [
						{ type: 'feed', name: '奶瓶喂养', desc: '120ml · 左侧拍嗝 6 分钟', time: '09:20' },
						{ type: 'poop', name: '黄金便便', desc: '量中 · 软糊状 · 已换尿布', time: '08:45' }
					]
				} catch (e) {
					console.log('Home loadData error (using defaults):', e.message)
				}
			}
		}
	}
</script>

<style>
	@import url("../../static/styles/home.css");
</style>
