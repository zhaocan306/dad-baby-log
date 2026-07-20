<template>
	<view class="page">
		<CustomNavbar />
		<scroll-view class="page-scroll" scroll-y refresher-enabled refresher-background="#fffdf8" @refresherrefresh="onRefresh" :refresher-triggered="refreshing">
		<UserHeader :name="baby ? baby.name + '的一天' : '小鲸鱼的一天'" :tip="stageTip" />
		<template v-if="loading">
			<view class="skeleton skel-milk"></view>
			<view class="skel-grid">
				<view class="skeleton skel-card"></view>
				<view class="skeleton skel-card"></view>
				<view class="skeleton skel-card"></view>
				<view class="skeleton skel-card"></view>
			</view>
			<view class="skel-list">
				<view class="skeleton skel-item"></view>
				<view class="skeleton skel-item"></view>
				<view class="skeleton skel-item"></view>
			</view>
		</template>
		<template v-else>
		<view class="enter-stagger">

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
					<text class="grid-card__pill-text">下次小睡 {{ sleepNext }}</text>
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
				<view class="grid-card__body" v-if="heightText !== '暂无记录'">
					<text class="grid-card__subtitle">{{ heightText }}</text>
				</view>
				<view class="grid-card__body grid-card__body--empty" v-else>
					<text class="grid-card__empty-text">暂无记录</text>
				</view>
				<text class="grid-card__tip" v-if="weightText">{{ weightText }} · 本周 +180g</text>
				<text class="grid-card__tip grid-card__tip--empty" v-else>去记录身高体重</text>
			</view>
			</navigator>

			<!-- 疫苗卡片 -->
			<navigator url="/pages/vaccine-history/vaccine-history" open-type="navigate" hover-class="none">
			<view class="grid-card grid-card--yellow height-auto">
				<view class="grid-card__header">
					<image class="grid-card__icon-img" src="/static/yimiao.png" mode="aspectFit" />
				</view>
				<view class="grid-card__body" v-if="vaccineName !== '暂无计划'">
					<text class="grid-card__subtitle grid-card__subtitle--yellow">{{ vaccineName }}</text>
				</view>
				<view class="grid-card__body grid-card__body--empty" v-else>
					<text class="grid-card__empty-text">暂无计划</text>
				</view>
				<text class="grid-card__tip grid-card__tip--yellow" v-if="vaccineDays !== '点击设置'">{{ vaccineDays }}</text>
				<text class="grid-card__tip grid-card__tip--empty" v-else>去设置疫苗计划</text>
			</view>
			</navigator>
		</view>

		<!-- 5. 最近活动列表 -->
		<view class="recent-activities enter-activities">
		  <view class="records-header">
		    <text class="section-title">最近记录</text>
		    <text class="sort-text">按日期</text>
		  </view>

		  <view class="activity-list" v-if="recentActivities.length">
		    <view class="activity-item shadow-mini" v-for="(act, i) in recentActivities" :key="i">
		      <view class="activity-left">
		        <image class="activity-icon-img" :src="act.type === 'feed' ? '/static/list-icon-milk-1.png' : act.type === 'poop' ? '/static/list-icon-poop-1.png' : '/static/list-icon-nap.png'" mode="aspectFit"></image>
		        <view class="activity-meta">
		          <text class="activity-name">{{ act.name }}</text>
		          <text class="activity-desc">{{ act.desc }}</text>
		        </view>
		      </view>
		      <text class="activity-time">{{ fmtTime(act.time) }}</text>
		    </view>
		  </view>
		  <view class="activity-empty" v-else>
		    <view class="activity-empty-icon">
		      <text class="activity-empty-emoji float-anim">📋</text>
		    </view>
		    <text class="activity-empty-title">还没有记录</text>
		    <text class="activity-empty-text">点下方「添加」开始记录小鲸鱼的成长吧 🐋</text>
		</view>
		</view>
		</view>

		<view class="footer-tip">
		  <text class="footer-tip-text">~ 到底啦 ~</text>
		</view>
		</template>
	</scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import UserHeader from "@/components/UserHeader.vue"
	import { initCloud, query, add, getBabyId, store } from '@/lib/cloud'
	import { babyApi } from '@/lib/api/baby'
	import { feedApi } from '@/lib/api/feed'
	import { sleepApi } from '@/lib/api/sleep'
	import { poopApi } from '@/lib/api/poop'
	import { heightApi } from '@/lib/api/height'
	import { vaccineApi } from '@/lib/api/vaccine'

	export default {
		name: "TabHome",
		components: { CustomNavbar, UserHeader },
		computed: {
			stageTip() {
				if (!this.baby) return '小鲸鱼的一天'
				if (this.baby.birthday) {
					const days = Math.floor((Date.now() - new Date(this.baby.birthday).getTime()) / 86400000)
					return `来到这个世界 ${days} 天啦`
				}
				if (this.baby.due_date) {
					const days = Math.ceil((new Date(this.baby.due_date) - Date.now()) / 86400000)
					if (days > 0) return `距离预产期还有 ${days} 天`
					if (days === 0) return '今天是预产期'
					return `已超过预产期 ${Math.abs(days)} 天`
				}
				return ''
			}
		},
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
				recentActivities: [],
			refreshing: false,
			loading: true,
			_alive: false
			}
		},
		mounted() {
			this._alive = true
			setTimeout(() => this.loadData(), 100)
		},
		beforeUnmount() {
			this._alive = false
		},
		async onShow() {
			await this.loadData()
		},
		methods: {
		async loadData() {
			try {
			let babyId = getBabyId()
			if (!babyId) {
				babyId = await this.ensureBaby()
				if (!babyId) return
			}
			await initCloud()

			const [onlineBaby, total, sleepStats, poopStats, height] = await Promise.all([
				babyApi.getCurrent(babyId).catch(() => null),
				feedApi.todayTotal(babyId).catch(() => null),
				sleepApi.weeklyStats(babyId).catch(() => null),
				poopApi.weeklyStats(babyId).catch(() => null),
				heightApi.latest(babyId).catch(() => null)
			])

			if (onlineBaby) this.baby = onlineBaby
			if (total !== null) this.animateNum(Number(this.todayMilk) || 0, total || 0, v => this.todayMilk = v)
			if (sleepStats) this.animateNum(Number(this.sleepHours) || 0, sleepStats.dailyAvg || 0, v => this.sleepHours = String(v), 400)
			if (poopStats) this.animateNum(Number(this.poopCount) || 0, poopStats.total || 0, v => this.poopCount = v, 300)

			this.heightText = height ? `身高 ${height.height_cm}cm` : '暂无记录'
			this.weightText = height ? `体重 ${height.weight_kg}kg` : ''

			const milestones = await query('milestones', {
				filter: { baby_id: babyId, status: 'pending' },
				orderBy: { field: 'age_month', direction: 'asc' },
				limit: 1
			}).catch(() => [])
			const next = milestones?.[0]
			if (next) {
				this.vaccineName = next.vaccine_name + ' · ' + (next.dose || '')
				if (onlineBaby?.birthday) {
					const due = new Date(onlineBaby.birthday)
					due.setMonth(due.getMonth() + next.age_month)
					const days = Math.ceil((due - new Date()) / 86400000)
					this.vaccineDays = days > 0 ? `还剩 ${days} 天` : days === 0 ? '今天到期' : `已过 ${Math.abs(days)} 天`
				} else {
					this.vaccineDays = `${next.age_month}月龄接种`
				}
			} else {
				this.vaccineName = '暂无计划'
				this.vaccineDays = '点击设置'
			}
			const fmtDateFn = v => {
				if (!v) return ''
				const d = new Date(v)
				return (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0')
			}
			const [feeds, sleeps, poops] = await Promise.all([
				feedApi.list(babyId, { limit: 5 }).catch(() => []),
				sleepApi.list(babyId, { limit: 5 }).catch(() => []),
				poopApi.list(babyId, { limit: 5 }).catch(() => [])
			])
			const all = [
				...feeds.map(r => ({
					type: 'feed',
					name: (r.type === 'breast' ? '亲喂' : r.type === 'formula' ? '配方奶' : '奶瓶喂养') + ' · ' + (r.amount_ml || '') + 'ml',
					desc: fmtDateFn(r.created_at) + (r.note ? ' · ' + r.note : ''),
					time: r.created_at
				})),
				...sleeps.map(r => ({
					type: 'sleep',
					name: (r.type === 'night' ? '夜间睡眠' : r.type === 'morning' ? '晨间回笼觉' : '日间小睡') + ' · ' + (Math.round(r.duration_min / 60 * 10) / 10 || '') + '小时',
					desc: fmtDateFn(r.start_time) + (r.note ? ' · ' + r.note : ''),
					time: r.start_time
				})),
				...poops.map(r => ({
					type: 'poop',
					name: '便便' + (r.amount ? ' · ' : '') + (r.amount === 'little' ? '少量' : r.amount === 'middle' ? '中量' : r.amount === 'large' ? '大量' : ''),
					desc: fmtDateFn(r.created_at) + (r.color || r.texture ? ' · ' : '') + (r.color || '') + (r.texture ? ' ' + r.texture : ''),
					time: r.created_at
				}))
			].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
			this.recentActivities = all

			if (sleeps?.length) {
				const latest = sleeps[0]
				const nextTime = new Date(new Date(latest.end_time || latest.start_time).getTime() + 90 * 60000)
				const h = String(nextTime.getHours()).padStart(2, '0')
				const m = String(nextTime.getMinutes()).padStart(2, '0')
				this.sleepNext = h + ':' + m
			}
			} catch (e) {
				console.log('Home loadData error:', e.message)
			}
			this.loading = false
		},
			async ensureBaby() {
			await initCloud()
			const families = await query('families', { limit: 1 }).catch(() => [])
			let familyId = families?.[0]?.id
			if (!familyId) {
				familyId = await add('families', { name: '我的家庭' }).catch(() => null)
			}
			if (!familyId) return null
			const babies = await query('babies', { filter: { family_id: familyId }, limit: 1 }).catch(() => [])
				if (babies?.length) {
					store.setBabyId(babies[0].id)
					return babies[0].id
				}
				const newId = await add('babies', {
					family_id: familyId, name: '小鲸鱼',
					gender: 'female', birthday: '2026-06-10'
				}).catch(() => null)
				if (newId) store.setBabyId(newId)
			return newId
		},
			async onRefresh() {
				this.refreshing = true
				await this.loadData()
				this.refreshing = false
			},
			fmtTime(v) {
				if (!v) return ''
				const d = new Date(v)
				return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
			},
			animateNum(from, to, setter, duration = 500) {
				if (!this._alive) return
				const start = Date.now()
				const step = () => {
					if (!this._alive) return
					const elapsed = Date.now() - start
					const progress = Math.min(elapsed / duration, 1)
					const spring = 1 - Math.pow(1 - progress, 3) + 0.12 * Math.sin(progress * Math.PI * 2.5) * (1 - progress)
					const val = from + (to - from) * Math.max(0, Math.min(1, spring))
					setter(to < 100 ? Math.round(val * 10) / 10 : Math.round(val))
					if (progress < 1 && this._alive) setTimeout(step, 16)
				}
				step()
			},
		},
}
</script>

<style>
	@import url("../../static/styles/home.css");
</style>
