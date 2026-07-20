<template>
	<view class="page">
		<scroll-view class="inner-padding enter-stagger" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			  <view class="title-text-group">
			    <text class="title-main">便便历史</text>
			    <text class="title-sub">记录次数、颜色、形态和尿布情况</text>
			  </view>
			  <picker class="range-picker" mode="selector" :range="rangeOptions" range-key="label" :value="rangeIndex" @change="onRangeChange">
			    <view class="time-badge">
			      <text class="badge-text">{{ rangeLabel }}</text>
			    </view>
			  </picker>
			</view>

			<!-- 2. 统计卡片 -->
			<view class="card-poop-summary shadow-soft">
			  <view class="card-header">
			    <view class="title-with-icon">
			      <image class="summary-card-icon" src="/static/icon-poop-smile.png" mode="aspectFit"></image>
			      <text class="card-title">{{ statsTitle }}</text>
			    </view>
			  </view>

			  <view class="stats-row">
			    <view class="stat-item">
			      <text class="stat-number">{{ stats.total }}次</text>
			      <text class="stat-label">总次数</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">中量</text>
			      <text class="stat-label">常见量</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">{{ stats.golden }}次</text>
			      <text class="stat-label">金黄色</text>
			    </view>
			  </view>
			</view>

			<!-- 3. 最近记录列表区域 -->
			<view class="recent-records-section">
			  <view class="records-header">
			    <text class="section-title">最近记录</text>
			    <text class="sort-text">按日期</text>
			  </view>

			  <view class="records-list-container shadow-mini" v-if="records.length">
			    <view class="date-group" v-for="(group, gi) in groups" :key="gi">
			      <text class="date-header">{{ group[0].slice(5) }}<text class="date-weekday">{{ getWeekday(group[0]) }}</text></text>
			    <view class="record-swipe" v-for="(r, i) in group[1]" :key="r.id">
			      <view class="record-delete" @tap.stop="delRecord(r.id)">删除</view>
			      <view
			        :class="['record-item', { 'no-border': i === records.length - 1, 'record-swipe-open': swipedId === r.id }]"
			        @touchstart="swipeStart($event, r.id)"
			        @touchmove="swipeMove($event, r.id)"
			        @touchend="swipeEnd"
			        @tap.stop="editRecord(r)"
			      >
			        <view class="record-left">
			          <image class="record-type-icon" src="/static/list-icon-poop-1.png" mode="aspectFit"></image>
			          <view class="record-meta">
			            <text class="record-name">便便{{ r.amount === 'little' ? '·少量' : r.amount === 'middle' ? '·中量' : r.amount === 'large' ? '·大量' : '' }}</text>
			            <text class="record-desc">{{ fmtDate(r.created_at) }}{{ r.color ? ' · ' + r.color : '' }}{{ r.texture ? ' · ' + r.texture : '' }}</text>
			          </view>
			        </view>
			        <text class="record-time">{{ fmtTime(r.created_at) }}</text>
			      </view>
			    </view>
			    </view>
			  </view>
			  <view class="empty-state" v-else>
			    <text class="empty-title">今天还没有便便 💩</text>
			    <text class="empty-desc">小鲸鱼的便便情况怎么样？</text>
			  </view>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import { poopApi } from '@/lib/api/poop'
	import { remove, update as dbUpdate, getBabyId } from '@/lib/cloud'
	import { haptic } from '@/lib/haptic'

	export default {
		name: "PoopHistory",
		data() {
			return {
				stats: { total: 0, golden: 0 },
				records: [],
				rangeIndex: 1,
				swipedId: null,
				swipeStartX: 0,
				rangeOptions: [
					{ label: '昨天', days: 1, title: '昨日便便' },
					{ label: '近7天', days: 7, title: '本周便便' },
					{ label: '近一月', days: 30, title: '本月便便' }
				]
			}
		},
		computed: {
			rangeLabel() { return this.rangeOptions[this.rangeIndex].label },
			rangeDays() { return this.rangeOptions[this.rangeIndex].days },
			statsTitle() { return this.rangeOptions[this.rangeIndex].title },
			groups() {
				const map = {}
				this.records.forEach(r => {
					const key = (r.created_at || '').slice(0, 10)
					if (!map[key]) map[key] = []
					map[key].push(r)
				})
				return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
			},
		},
		async onShow() {
			await this.loadData()
		},
		methods: {
			onRangeChange(e) {
				this.rangeIndex = +e.detail.value
				this.loadData()
			},
			async loadData() {
				try {
					const babyId = getBabyId()
					if (!babyId) return

					const records = await poopApi.list(babyId, { limit: 500, days: this.rangeDays })
					this.records = records

					this.stats = {
						total: records.length,
						golden: records.filter(r => r.color === '黄金色' || r.color === '金黄色').length
					}
				} catch (e) {
					console.log('PoopHistory loadData error:', e.message)
				}
			},
			swipeStart(e, id) {
				this.swipeStartX = e.touches[0].clientX
				this.swipedId = null
			},
			swipeMove(e, id) {
				const dx = e.touches[0].clientX - this.swipeStartX
				if (dx < -60) this.swipedId = id
				if (dx > 60) this.swipedId = null
			},
			swipeEnd() {},
			editRecord(r) {
				uni.showActionSheet({ itemList: ['少量', '中量', '大量'], success: res => {
					const map = ['little', 'middle', 'large']
					dbUpdate('poop_records', r.id, { amount: map[res.tapIndex] }).then(() => {
						r.amount = map[res.tapIndex]; uni.showToast({ title: '已更新', icon: 'success' })
					}).catch(() => uni.showToast({ title: '更新失败', icon: 'none' }))
				}})
			},
			async delRecord(id) {
				uni.showModal({ title: '确认删除', content: '删除后无法恢复，确定吗？', success: async (res) => {
				if (!res.confirm) return
				try { haptic(); await remove('poop_records', id); this.records = this.records.filter(r => r.id !== id); this.swipedId = null; uni.showToast({ title: '已删除', icon: 'success' }) }
				catch (e) { uni.showToast({ title: '删除失败', icon: 'none' }) }
				}})
			},
			getWeekday(v) { return ' 周' + ['日','一','二','三','四','五','六'][new Date(v).getDay()] },
			goBack() { uni.navigateBack() },
			fmtDate(v) {
				if (!v) return ''
				const d = new Date(v)
				return (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0')
			},
			fmtTime(v) {
				if (!v) return ''
				const d = new Date(v)
				return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
			},
		}
	}
</script>

<style>
	.page { min-height: 100vh; background: var(--bg-cream); color: var(--text-dark); }
	.inner-padding { padding: 0 44rpx; height: 100%; width: calc(100% - 88rpx); }
	.header-section { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 44rpx; gap: 16rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.range-picker { margin-left: auto; }
	.title-text-group { display: flex; flex-direction: column; }
	.title-main { font-size: 38rpx; font-weight: 900; letter-spacing: 1rpx; }
	.title-sub { font-size: 22rpx; color: var(--text-gray); font-weight: 600; margin-top: 6rpx; }
	.time-badge { display: flex; align-items: center; margin-left: auto; background: #fff; border: 1px solid rgba(142,138,159,0.1); padding: 12rpx 36rpx; border-radius: 100rpx; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015); }
	.badge-text { font-size: 24rpx; font-weight: 800; color: var(--baby-purple); }
	.card-poop-summary { background: var(--card-poop); border-radius: 56rpx; padding: 44rpx; margin-bottom: 44rpx; }
	.shadow-soft { box-shadow: 0 8rpx 32rpx rgba(142,138,159,0.04); }
	.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40rpx; }
	.title-with-icon { display: flex; flex-direction: row; align-items: center; }
	.summary-card-icon { width: 64rpx; height: 64rpx; margin-right: 18rpx; }
	.card-title { font-size: 32rpx; font-weight: 900; }
	.stats-row { display: flex; flex-direction: row; justify-content: space-between; }
	.stat-item { flex: 1; background: rgba(255,255,255,0.75); border-radius: 36rpx; padding: 24rpx 10rpx; margin: 0 8rpx; display: flex; flex-direction: column; align-items: center; }
	.stat-item:first-child { margin-left: 0; }
	.stat-item:last-child { margin-right: 0; }
	.stat-number { font-size: 30rpx; font-weight: 900; }
	.stat-label { font-size: 18rpx; color: var(--text-gray); font-weight: 800; margin-top: 6rpx; }
	.recent-records-section { display: flex; flex-direction: column; }
	.records-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; padding: 0 8rpx; }
	.section-title { font-size: 36rpx; font-weight: 900; }
	.sort-text { font-size: 24rpx; font-weight: 800; color: var(--baby-purple); }
	.records-list-container { background: #fff; border-radius: 56rpx; padding: 12rpx 36rpx; border: 1px solid rgba(243,241,255,0.6); }
	.record-swipe { position: relative; overflow: hidden; }
	.date-header { font-size: 24rpx; font-weight: 800; color: var(--baby-purple); padding: 24rpx 0 10rpx 0; }
	.date-weekday { font-weight: 600; color: var(--text-gray); font-size: 22rpx; }
	.record-delete { position: absolute; right: 0; top: 0; bottom: 0; width: 140rpx; background: #E11D48; color: #fff; font-size: 26rpx; font-weight: 800; display: flex; align-items: center; justify-content: center; border-radius: 0 28rpx 28rpx 0; }
	.record-item { display: flex; justify-content: space-between; align-items: center; padding: 36rpx 0; border-bottom: 2rpx solid #FBFBFC; position: relative; z-index: 1; background: #fff; transition: transform 0.2s; }
	.record-swipe-open { transform: translateX(-140rpx); }
	.no-border { border-bottom: none; }
	.record-left { display: flex; flex-direction: row; align-items: center; }
	.record-type-icon { width: 80rpx; height: 80rpx; margin-right: 24rpx; }
	.record-meta { display: flex; flex-direction: column; }
	.record-name { font-size: 28rpx; font-weight: 800; }
	.record-desc { font-size: 22rpx; color: var(--text-gray); font-weight: 600; margin-top: 6rpx; }
	.record-time { font-size: 24rpx; font-weight: 700; color: var(--text-gray); }
	.empty-state { background: #fff; border-radius: 56rpx; padding: 80rpx 40rpx; display: flex; flex-direction: column; align-items: center; }
	.empty-title { font-size: 28rpx; font-weight: 800; color: var(--text-dark); margin-bottom: 8rpx; }
	.empty-desc { font-size: 24rpx; color: var(--text-gray); font-weight: 600; }
</style>
