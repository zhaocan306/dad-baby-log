<template>
	<view class="page">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">数据导出</text>
		</view>

		<view class="export-card">
			<text class="export-title">数据概览</text>
			<text class="export-subtitle">当前共 {{ totalRecords }} 条记录</text>
			<view class="stat-grid">
				<view class="stat-box"><text class="stat-num">{{ counts.feed }}</text><text class="stat-lbl">喝奶</text></view>
				<view class="stat-box"><text class="stat-num">{{ counts.sleep }}</text><text class="stat-lbl">睡眠</text></view>
				<view class="stat-box"><text class="stat-num">{{ counts.poop }}</text><text class="stat-lbl">便便</text></view>
				<view class="stat-box"><text class="stat-num">{{ counts.height }}</text><text class="stat-lbl">身高</text></view>
				<view class="stat-box"><text class="stat-num">{{ counts.vaccine }}</text><text class="stat-lbl">疫苗</text></view>
			</view>
		</view>

		<view class="export-card">
			<text class="export-title">最近记录</text>
			<view class="record-line" v-for="(r, i) in recent" :key="i">
				<text class="rl-type">{{ r.typeLabel }}</text>
				<text class="rl-detail">{{ r.detail }}</text>
				<text class="rl-time">{{ r.time.slice(0, 10) }}</text>
			</view>
			<view class="empty-tip" v-if="!recent.length">暂无记录</view>
		</view>
	</view>
</template>

<script>
	import { getBabyId } from '@/lib/cloud'
	import { feedApi } from '@/lib/api/feed'
	import { sleepApi } from '@/lib/api/sleep'
	import { poopApi } from '@/lib/api/poop'
	import { heightApi } from '@/lib/api/height'
	import { vaccineApi } from '@/lib/api/vaccine'

	export default {
		name: "DataExport",
		data() { return { counts: { feed: 0, sleep: 0, poop: 0, height: 0, vaccine: 0 }, totalRecords: 0, recent: [] } },
		async onShow() {
			const babyId = getBabyId()
			if (!babyId) return
			const [feeds, sleeps, poops, heights, vaccines] = await Promise.all([
				feedApi.list(babyId, { limit: 500, days: 365 }).catch(() => []),
				sleepApi.list(babyId, { limit: 500, days: 365 }).catch(() => []),
				poopApi.list(babyId, { limit: 500, days: 365 }).catch(() => []),
				heightApi.list(babyId, { limit: 100 }).catch(() => []),
				vaccineApi.list(babyId).catch(() => [])
			])
			this.counts = { feed: feeds.length, sleep: sleeps.length, poop: poops.length, height: heights.length, vaccine: vaccines.length }
			this.totalRecords = feeds.length + sleeps.length + poops.length + heights.length + vaccines.length
			const all = [
				...feeds.map(r => ({ typeLabel: '喝奶', detail: r.amount_ml + 'ml', time: r.created_at })),
				...sleeps.map(r => ({ typeLabel: '睡觉', detail: Math.round(r.duration_min) + '分钟', time: r.start_time })),
				...poops.map(r => ({ typeLabel: '便便', detail: r.amount || '', time: r.created_at })),
				...heights.map(r => ({ typeLabel: '身高', detail: r.height_cm + 'cm', time: r.date })),
				...vaccines.map(r => ({ typeLabel: '疫苗', detail: r.name, time: r.created_at }))
			].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 20)
			this.recent = all
		},
		methods: { goBack() { uni.navigateBack() } }
	}
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 40rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; }
	.export-card { background: #fff; border-radius: 48rpx; padding: 32rpx; margin-bottom: 30rpx; }
	.export-title { font-size: 30rpx; font-weight: 900; }
	.export-subtitle { font-size: 22rpx; color: #8E8A9F; font-weight: 600; margin-top: 6rpx; }
	.stat-grid { display: flex; gap: 16rpx; margin-top: 24rpx; }
	.stat-box { flex: 1; background: #F5F4FA; border-radius: 24rpx; padding: 16rpx 0; text-align: center; }
	.stat-num { font-size: 36rpx; font-weight: 900; }
	.stat-lbl { font-size: 20rpx; color: #8E8A9F; font-weight: 700; margin-top: 4rpx; }
	.record-line { display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 2rpx solid #FBFBFC; }
	.rl-type { font-size: 24rpx; font-weight: 800; width: 60rpx; }
	.rl-detail { flex: 1; font-size: 24rpx; color: #8E8A9F; }
	.rl-time { font-size: 22rpx; color: #8E8A9F; }
	.empty-tip { text-align: center; padding: 40rpx 0; color: #8E8A9F; }
</style>
