<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding enter-stagger" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-area">
			    <image class="header-icon" src="/static/icon-calendar-header.png" mode="aspectFit"></image>
			    <view class="title-text-group">
			      <text class="title-main">疫苗日历</text>
			      <text class="title-sub">查看疫苗计划，标记接种完成</text>
			    </view>
			  </view>
			  <picker mode="selector" :range="monthLabels" :value="monthIndex" @change="onMonthChange">
			  <view class="age-filter-badge">
			    <text class="age-filter-text">{{ monthLabels[monthIndex] }}</text>
			  </view>
			  </picker>
			</view>

			<view v-if="loading" class="skel-section">
				<view class="skeleton skel-vaccine-card"></view>
				<view class="skeleton skel-vaccine-bar"></view>
				<view class="skeleton skel-vaccine-list"></view>
				<view class="skeleton skel-vaccine-list"></view>
				<view class="skeleton skel-vaccine-list"></view>
			</view>

			<template v-else>
			<!-- 2. 下一针 -->
			<view class="next-vaccine-card shadow-soft enter-h1">
			  <view class="card-header">
			    <text class="card-title">下一针</text>
			    <view class="countdown-badge" v-if="nextVaccine">
			      <text class="countdown-text">{{ nextVaccine.vaccine_name }} · {{ nextVaccine.dose }}</text>
			    </view>
			  </view>

			  <view class="card-body">
			    <view class="vaccine-icon-wrapper">
			      <image class="vaccine-needle-icon" src="/static/icon-needle-orange.png" mode="aspectFit"></image>
			    </view>
			    <view class="vaccine-main" v-if="nextVaccine">
			      <text class="vaccine-big-name">{{ nextVaccine.vaccine_name }}</text>
			      <text class="vaccine-sub">{{ nextVaccine.dose }} · {{ nextVaccine.age_month }}月龄</text>
			      <text class="vaccine-sub" v-if="nextVaccine.scheduled_date">应接种 {{ nextVaccine.scheduled_date }}</text>
			    </view>
			    <view class="vaccine-main" v-else>
			      <text class="vaccine-big-name">暂无待接种</text>
			    </view>
			  </view>
			  <view class="vaccine-note" v-if="nextVaccine">接种前确认无发热腹泻，带好接种本</view>
			</view>

			<!-- 3. 月龄计划 -->
			<view class="plan-section enter-h2">
			  <view class="plan-header">
			    <text class="section-title">月龄计划</text>
			  </view>

			  <view class="plan-list">
			    <view class="milestone-card shadow-soft" v-for="(m, i) in filteredMilestones" :key="m.id">
			      <view class="card-main-row">
			        <view class="card-left">
			          <image class="card-icon" src="/static/icon-vaccine-needle.png" mode="aspectFit"></image>
			          <view class="card-meta">
			            <text class="card-name">{{ m.vaccine_name }} · {{ m.dose || '' }}</text>
			            <text class="card-desc">{{ m.age_month }}月龄</text>
			            <text class="card-desc" v-if="m.scheduled_date">应接种：{{ m.scheduled_date }}</text>
			          </view>
			        </view>
			        <view class="card-right">
			          <text class="status-badge" :class="m.status === 'done' ? 'badge-done' : 'badge-pending'">{{ m.status === 'done' ? '已完成' : '待接种' }}</text>
			        </view>
			      </view>
			      <view class="card-action" v-if="m.status === 'pending'">
			        <view class="btn-mark-done" @tap="markDone(m)">
			          <image class="btn-done-icon" src="/static/icon-done-white.png" mode="aspectFit"></image>
			          <text class="btn-done-text">标记完成</text>
			        </view>
			      </view>
			    </view>
			  </view>
			</view>
			</template>

			<view class="footer-tip">
			  <text class="footer-tip-text">~ 到底啦 ~</text>
			</view>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import { initCloud, update as dbUpdate, getBabyId } from '@/lib/cloud'
	import { haptic } from '@/lib/haptic'
	import { vaccineApi } from '@/lib/api/vaccine'

	export default {
		name: "TabHealth",
		components: { CustomNavbar },
		data() {
			return {
				nextVaccine: null,
			milestones: [],
			monthIndex: 0,
			loading: true,
			monthLabels: ['全部', '0月龄', '1月龄', '2月龄', '3月龄', '4月龄', '5月龄', '6月龄', '8月龄', '12月龄', '18月龄', '24月龄']
			}
		},
		computed: {
			filteredMilestones() {
				if (this.monthIndex === 0) return this.milestones
				const m = parseInt(this.monthLabels[this.monthIndex])
				return this.milestones.filter(item => item.age_month === m)
			}
		},
		mounted() {
			setTimeout(() => this.loadData(), 100)
		},
		async onShow() {
			await this.loadData()
		},
		methods: {
			onMonthChange(e) {
				this.monthIndex = +e.detail.value
			},
			async loadData() {
				try {
					const babyId = getBabyId()
					if (!babyId) return
					await initCloud()
					const list = await vaccineApi.milestones(babyId).catch(() => [])
					this.milestones = list
					// 下一针用 milestones 里第一个 pending 的
			this.nextVaccine = list.find(m => m.status === 'pending') || null
			this.loading = false
		} catch (e) {
			this.loading = false
			console.log('Health loadData error:', e.message)
		}
			},
			async markDone(m) {
				haptic()
				try {
					await dbUpdate('milestones', m.id, { status: 'done' })
					m.status = 'done'
					this.nextVaccine = this.milestones.find(item => item.status === 'pending') || null
					uni.showToast({ title: '已标记完成', icon: 'success' })
				} catch (e) {
					uni.showToast({ title: '操作失败', icon: 'none' })
				}
			}
		}
	}
</script>

<style>
	.page {
		--baby-purple: #8B80F9;

		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  flex: 1;
	  height: 0;
	  padding: 0 44rpx 160rpx;
	  width: calc(100% - 88rpx);
	}

	.enter-h1 { animation: healthIn 0.4s ease-out both; }
	.enter-h2 { animation: healthIn 0.4s ease-out 0.1s both; }

	.vaccine-note {
	  font-size: 22rpx;
	  color: #B8B5C8;
	  text-align: center;
	  margin-top: 16rpx;
	  padding-top: 14rpx;
	  border-top: 2rpx dashed #F3F1FF;
	}

	@keyframes healthIn {
	  from { opacity: 0; transform: translateY(24rpx); }
	  to { opacity: 1; transform: translateY(0); }
	}

	/* ==================== 头部区域 ==================== */
	.header-section {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 44rpx;
	}

	.title-area {
	  display: flex;
	  align-items: center;
	}

	.header-icon {
	  width: 96rpx;
	  height: 96rpx;
	  margin-right: 20rpx;
	}

	.title-text-group {
	  display: flex;
	  flex-direction: column;
	}

	.title-main {
	  font-size: 38rpx;
	  font-weight: 900;
	  letter-spacing: 1rpx;
	}

	.title-sub {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 6rpx;
	}

	.age-filter-badge {
	  margin-left: auto;
	  background-color: #FFFFFF;
	  border: 1px solid rgba(142, 138, 159, 0.1);
	  padding: 12rpx 36rpx;
	  border-radius: 100rpx;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	  display: flex;
	  align-items: center;
	}

	.age-filter-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: #B45309;
	}

	/* ==================== 下一针卡片 ==================== */
	.next-vaccine-card {
	  background-color: #FFF6D6;
	  border-radius: 56rpx;
	  padding: 44rpx;
	  margin-bottom: 44rpx;
	  box-sizing: border-box;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 36rpx;
	}

	.card-title {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.countdown-badge {
	  background-color: #FFFFFF;
	  padding: 8rpx 24rpx;
	  border-radius: 100rpx;
	  display: flex;
	  align-items: center;
	}

	.countdown-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: #B45309;
	}

	.card-body {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	}

	.vaccine-icon-wrapper {
	  width: 100rpx;
	  height: 100rpx;
	  background-color: #FFFFFF;
	  border-radius: 30rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  margin-right: 24rpx;
	  flex-shrink: 0;
	}

	.vaccine-needle-icon {
	  width: 56rpx;
	  height: 56rpx;
	}

	.vaccine-main {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	}

	.vaccine-big-name {
	  font-size: 36rpx;
	  font-weight: 900;
	  color: #2D283E;
	}

	.vaccine-sub {
	  font-size: 24rpx;
	  color: #8E8A9F;
	  font-weight: 600;
	  margin-top: 8rpx;
	}

	/* ==================== 接种前准备卡片 ==================== */
	.preparation-card {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 44rpx;
	  box-sizing: border-box;
	  border: 1px solid rgba(243, 241, 255, 0.4);
	}

	.mb-6 {
	  margin-bottom: 44rpx;
	}

	.preparation-title {
	  font-size: 32rpx;
	  font-weight: 900;
	  margin-bottom: 30rpx;
	  display: block;
	}

	.prep-list {
	  display: flex;
	  flex-direction: column;
	}

	.prep-item {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  margin-bottom: 24rpx;
	}

	.prep-item:last-child {
	  margin-bottom: 0;
	}

	.prep-icon {
	  width: 36rpx;
	  height: 36rpx;
	  margin-right: 20rpx;
	  flex-shrink: 0;
	}

	.prep-text {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: #3730A3;
	  line-height: 1.2;
	}

	.tip-body {
	  font-size: 26rpx;
	  color: #555;
	  line-height: 1.6;
	  margin-top: 12rpx;
	  white-space: pre-line;
	}

	/* ==================== 月龄计划列表 ==================== */
	.plan-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 24rpx;
	  padding: 0 4rpx;
	}

	.section-title {
	  font-size: 36rpx;
	  font-weight: 900;
	}

	.btn-all-wrapper {
	  background-color: #FFFFFF;
	  padding: 8rpx 28rpx;
	  border-radius: 100rpx;
	  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.015);
	  border: 1px solid rgba(142, 138, 159, 0.08);
	  display: flex;
	  align-items: center;
	}

	.btn-all-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: var(--baby-purple);
	}

	.plan-list-container { display: none; }
	.shadow-mini { display: none; }
	.plan-item { display: none; }
	.plan-action { display: none; }

	.plan-list {
	  display: flex;
	  flex-direction: column;
	  gap: 20rpx;
	}

	.milestone-card {
	  background: #fff;
	  border-radius: 40rpx;
	  padding: 32rpx;
	  border: 1px solid rgba(243, 241, 255, 0.4);
	}

	.card-main-row { display: flex; justify-content: space-between; align-items: flex-start; }
	.card-left { display: flex; flex-direction: row; align-items: center; flex: 1; }
	.card-icon { width: 64rpx; height: 64rpx; margin-right: 20rpx; flex-shrink: 0; }
	.card-meta { display: flex; flex-direction: column; }
	.card-name { font-size: 28rpx; font-weight: 800; }
	.card-desc { font-size: 22rpx; color: #8E8A9F; font-weight: 600; margin-top: 4rpx; }
	.card-right { flex-shrink: 0; }

	.status-badge { font-size: 20rpx; font-weight: 800; padding: 6rpx 18rpx; border-radius: 100rpx; }
	.badge-done { background: #D1FAE5; color: #047857; }
	.badge-pending { background: #DBEAFE; color: #2563EB; }

	.card-action { margin-top: 20rpx; padding-top: 20rpx; border-top: 2rpx dashed #F3F1FF; }

	.btn-mark-done {
	  display: flex; flex-direction: row; align-items: center; justify-content: center;
	  background-color: #8B80F9; border-radius: 32rpx; padding: 18rpx 0;
	  box-shadow: 0 4rpx 16rpx rgba(139, 128, 249, 0.15);
	}
	.btn-done-icon { width: 26rpx; height: 26rpx; margin-right: 8rpx; }
	.btn-done-text { font-size: 24rpx; font-weight: 900; color: #FFFFFF; }

	.footer-tip {
	  display: flex;
	  justify-content: center;
	  padding: 40rpx 0;
	}

	.footer-tip-text {
	  font-size: 24rpx;
	  color: #8E8A9F;
	  font-weight: 600;
	}

	@keyframes shimmer {
		0% { background-position: -400rpx 0; }
		100% { background-position: 400rpx 0; }
	}
	.skeleton { background: linear-gradient(90deg, #EFEDF5 25%, #E5E0FF 50%, #EFEDF5 75%); background-size: 800rpx 100%; animation: shimmer 1.2s infinite ease-in-out; border-radius: 16rpx; }
	.skel-section { display: flex; flex-direction: column; gap: 30rpx; }
	.skel-vaccine-card { height: 200rpx; border-radius: 56rpx; }
	.skel-vaccine-bar { height: 200rpx; border-radius: 56rpx; }
	.skel-vaccine-list { height: 120rpx; border-radius: 40rpx; }
</style>
