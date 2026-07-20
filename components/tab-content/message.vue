<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding" scroll-y>

			<!-- 1. 顶部标题区域 -->
			<view class="header-section">
			  <view class="title-text-group">
			    <text class="title-main">我的</text>
			    <text class="title-sub">管理宝宝档案、家庭协作和数据</text>
			  </view>
			  <image class="header-setting-icon" src="/static/icon-setting.png" mode="aspectFit"></image>
			</view>

			<template v-if="loading">
			  <view class="skeleton skel-message-card"></view>
			  <view class="skeleton skel-message-menu"></view>
			  <view class="skeleton skel-message-list"></view>
			  <view class="skeleton skel-message-list"></view>
			</template>

			<template v-else>
			<view class="enter-stagger">
			<!-- 2. 家庭核心数据大卡片 -->
			<view class="card-family shadow-soft">
			  <view class="profile-info-row">
			    <image class="family-avatar" src="/static/family-avatar.png" mode="aspectFit"></image>
			    <view class="profile-meta">
			      <text class="family-name">{{ family?.name || baby?.name || 'cc cc' }} 的家庭</text>
			      <text class="baby-detail">{{ baby?.name || '小鲸鱼' }} · {{ stageText }}{{ baby?.gender === 'female' ? ' · 女宝宝' : baby?.gender === 'male' ? ' · 男宝宝' : '' }}</text>
			      <view class="member-badge">
			        <image class="member-badge-icon" src="/static/icon-group.png" mode="aspectFit"></image>
			        <text class="member-badge-text">{{ (family?.members?.length || 1) }} 位家人同步记录</text>
			      </view>
			    </view>
			  </view>

			  <view class="stats-row">
			    <view class="stat-item">
			      <text class="stat-number">{{ recordDays }}</text>
			      <text class="stat-label">记录天</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number">{{ totalRecords }}</text>
			      <text class="stat-label">条记录</text>
			    </view>
			    <view class="stat-item">
			      <text class="stat-number text-green">已同步</text>
			      <text class="stat-label text-green-light">云备份</text>
			    </view>
			  </view>
			</view>

			<!-- 3. 四个功能入口网格 -->
			<view class="grid-4 mb-6">
			  <navigator url="/pages/baby-profile/baby-profile" open-type="navigate" hover-class="none">
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-baby.png" mode="aspectFit"></image>
			    <text class="menu-label">宝宝档案</text>
			  </view>
			  </navigator>
			  <navigator url="/pages/family-members/family-members" open-type="navigate" hover-class="none">
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-members.png" mode="aspectFit"></image>
			    <text class="menu-label">家庭成员</text>
			  </view>
			  </navigator>
			  <navigator url="/pages/reminder-settings/reminder-settings" open-type="navigate" hover-class="none">
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-notif.png" mode="aspectFit"></image>
			    <text class="menu-label">提醒设置</text>
			  </view>
			  </navigator>
			  <navigator url="/pages/data-export/data-export" open-type="navigate" hover-class="none">
			  <view class="menu-card shadow-mini">
			    <image class="menu-icon" src="/static/menu-export.png" mode="aspectFit"></image>
			    <text class="menu-label">数据导出</text>
			  </view>
			  </navigator>
			</view>

			<!-- 4. 照护设置列表 -->
			<view class="settings-panel shadow-soft">
			  <text class="panel-title">照护设置</text>

			  <view class="setting-list">
			  <navigator url="/pages/growth-standard/growth-standard" open-type="navigate" hover-class="none">
			    <view class="setting-item">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-green-light" src="/static/setting-curve.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">生长曲线标准</text>
			          <text class="setting-sub-title">WHO 女宝宝 0-2 岁标准</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>
			  </navigator>

			  <navigator url="/pages/reminder-settings/reminder-settings" open-type="navigate" hover-class="none">
			    <view class="setting-item">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-amber-light" src="/static/setting-time.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">提醒时间</text>
			          <text class="setting-sub-title">喂奶间隔 3 小时，疫苗提前 2 天</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>
			  </navigator>

			  <navigator url="/pages/data-export/data-export" open-type="navigate" hover-class="none">
			    <view class="setting-item">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-blue-light" src="/static/setting-backup.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">数据备份与导出</text>
			          <text class="setting-sub-title">自动同步，可导出 PDF 给医生</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>
			  </navigator>

			  <navigator url="/pages/privacy-security/privacy-security" open-type="navigate" hover-class="none">
			    <view class="setting-item no-border">
			      <view class="setting-item-left">
			        <image class="setting-icon bg-rose-light" src="/static/setting-privacy.png" mode="aspectFit"></image>
			        <view class="setting-text">
			          <text class="setting-main-title">隐私与安全</text>
			          <text class="setting-sub-title">家庭成员权限、数据可见范围</text>
			        </view>
			      </view>
			      <image class="arrow-icon" src="/static/icon-arrow-right.png" mode="aspectFit"></image>
			    </view>
			  </navigator>
			  </view>
			</view>
			</view>
			</template>

		  </scroll-view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import { initCloud, getUser, add, getBabyId } from '@/lib/cloud'
	import { familyApi } from '@/lib/api/family'
	import { feedApi } from '@/lib/api/feed'
	import { sleepApi } from '@/lib/api/sleep'
	import { poopApi } from '@/lib/api/poop'
	import { heightApi } from '@/lib/api/height'
	import { vaccineApi } from '@/lib/api/vaccine'

	export default {
		name: "TabMessage",
		components: { CustomNavbar },
		computed: {
			stageText() {
				if (!this.baby) return ''
				if (this.baby.birthday) {
					const days = Math.floor((Date.now() - new Date(this.baby.birthday).getTime()) / 86400000)
					return `${days} 天`
				}
				if (this.baby.due_date) {
					const days = Math.ceil((new Date(this.baby.due_date) - Date.now()) / 86400000)
					if (days > 0) return `预产期还有 ${days} 天`
					if (days === 0) return '预产期今天'
					return `已过预产期 ${Math.abs(days)} 天`
				}
				return ''
			}
		},
		data() {
			return {
				family: null,
				baby: null,
				totalRecords: 0,
			recordDays: 0,
			loading: true
			}
		},
		mounted() {
			setTimeout(() => this.loadData(), 100)
		},
		async onShow() {
			await this.loadData()
		},
		methods: {
			async loadData() {
				try {
					await initCloud()
					const babyId = getBabyId()
					if (!babyId) return

					const [family, feeds, sleeps, poops, heights, vaccines] = await Promise.all([
						familyApi.getCurrent().catch(() => null),
						feedApi.list(babyId, { limit: 1000, days: 365 }).catch(() => []),
						sleepApi.list(babyId, { limit: 1000, days: 365 }).catch(() => []),
						poopApi.list(babyId, { limit: 1000, days: 365 }).catch(() => []),
						heightApi.list(babyId, { limit: 100 }).catch(() => []),
						vaccineApi.list(babyId).catch(() => [])
					])

					this.family = family
					if (family?.babies?.length) this.baby = family.babies[0]

					this.totalRecords = feeds.length + sleeps.length + poops.length + heights.length + vaccines.length

					// 确保有家庭成员记录
					if (family && family.id && (!family.members || !family.members.length)) {
						const user = (await getUser()).data.user
						const mid = await add('members', {
							family_id: family.id, user_id: user?.id || 'local', role: 'owner'
						})
						if (mid) family.members = [{ id: mid, user_id: user?.id }]
					}

					// 记录天数（从第一条记录到现在的天数）
					const allDates = [
						...feeds.map(r => r.created_at),
						...sleeps.map(r => r.created_at || r.start_time),
						...poops.map(r => r.created_at),
						...heights.map(r => r.date),
						...vaccines.map(r => r.created_at)
					].filter(Boolean)
					if (allDates.length) {
						const first = new Date(Math.min(...allDates.map(d => new Date(d).getTime())))
						this.recordDays = Math.floor((Date.now() - first.getTime()) / 86400000) || 1
					} else {
						this.recordDays = this.baby?.birthday
							? Math.floor((Date.now() - new Date(this.baby.birthday).getTime()) / 86400000)
							: 0
					}
				} catch (e) {
					console.log('Message loadData error:', e.message)
				}
				this.loading = false
			}
		}
	}
</script>

<style>
	.page {
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

	/* ==================== 头部标题区 ==================== */
	.header-section {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 44rpx;
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

	.header-setting-icon {
	  width: 88rpx;
	  height: 88rpx;
	}

	/* ==================== 家庭信息大卡片 ==================== */
	.card-family {
	  background-color: var(--card-milk);
	  border-radius: 56rpx;
	  padding: 44rpx;
	  margin-bottom: 40rpx;
	  box-sizing: border-box;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.profile-info-row {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  margin-bottom: 40rpx;
	}

	.family-avatar {
	  width: 112rpx;
	  height: 112rpx;
	  border-radius: 50%;
	  margin-right: 28rpx;
	}

	.profile-meta {
	  display: flex;
	  flex-direction: column;
	}

	.family-name {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.baby-detail {
	  font-size: 22rpx;
	  color: var(--text-gray);
	  font-weight: 600;
	  margin-top: 4rpx;
	}

	.member-badge {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  align-self: flex-start;
	  background-color: rgba(255, 255, 255, 0.7);
	  padding: 6rpx 18rpx;
	  border-radius: 100rpx;
	  margin-top: 10rpx;
	}

	.member-badge-icon {
	  width: 22rpx;
	  height: 22rpx;
	  margin-right: 8rpx;
	}

	.member-badge-text {
	  font-size: 18rpx;
	  color: var(--baby-purple);
	  font-weight: 800;
	}

	.stats-row {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	}

	.stat-item {
	  flex: 1;
	  background-color: rgba(255, 255, 255, 0.75);
	  border-radius: 36rpx;
	  padding: 24rpx 10rpx;
	  margin: 0 8rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  box-sizing: border-box;
	}

	.stat-item:first-child {
	  margin-left: 0;
	}

	.stat-item:last-child {
	  margin-right: 0;
	}

	.stat-number {
	  font-size: 30rpx;
	  font-weight: 900;
	}

	.stat-label {
	  font-size: 18rpx;
	  color: var(--text-gray);
	  font-weight: 800;
	  margin-top: 6rpx;
	}

	.text-green { color: #10B981; }
	.text-green-light { color: rgba(16, 185, 129, 0.7); }

	/* ==================== 四个功能入口网格 ==================== */
	.grid-4 {
	  display: grid;
	  grid-template-columns: repeat(4, 1fr);
	  grid-gap: 20rpx;
	}

	.mb-6 {
	  margin-bottom: 44rpx;
	}

	.menu-card {
	  background-color: #FFFFFF;
	  border-radius: 40rpx;
	  padding: 28rpx 8rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  border: 1px solid rgba(243, 241, 255, 0.5);
	  box-sizing: border-box;
	}

	.shadow-mini {
	  box-shadow: 0 4rpx 16rpx rgba(142, 138, 159, 0.02);
	}

	.menu-icon {
	  width: 52rpx;
	  height: 52rpx;
	  margin-bottom: 12rpx;
	}

	.menu-label {
	  font-size: 20rpx;
	  font-weight: 800;
	}

	/* ==================== 照护设置列表面板 ==================== */
	.settings-panel {
	  background-color: #FFFFFF;
	  border-radius: 56rpx;
	  padding: 44rpx;
	  border: 1px solid rgba(243, 241, 255, 0.5);
	  box-sizing: border-box;
	}

	.panel-title {
	  font-size: 32rpx;
	  font-weight: 900;
	  margin-bottom: 24rpx;
	  display: block;
	}

	.setting-list {
	  display: flex;
	  flex-direction: column;
	}

	.setting-item {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: center;
	  padding: 24rpx 0;
	  border-bottom: 2rpx solid #FBFBFC;
	}

	.no-border {
	  border-bottom: none;
	}

	.setting-item-left {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  flex: 1;
	  padding-right: 20rpx;
	}

	.setting-icon {
	  width: 64rpx;
	  height: 64rpx;
	  border-radius: 50%;
	  padding: 10rpx;
	  box-sizing: border-box;
	  margin-right: 24rpx;
	  flex-shrink: 0;
	}

	.bg-green-light { background-color: var(--card-height); }
	.bg-amber-light { background-color: var(--card-vaccine); }
	.bg-blue-light { background-color: var(--card-milk); }
	.bg-rose-light { background-color: var(--card-poop); }

	.setting-text {
	  display: flex;
	  flex-direction: column;
	}

	.setting-main-title {
	  font-size: 26rpx;
	  font-weight: 900;
	}

	.setting-sub-title {
	  font-size: 18rpx;
	  color: var(--text-gray);
	  font-weight: 700;
	  margin-top: 6rpx;
	}

	.arrow-icon {
	  width: 14rpx;
	  height: 24rpx;
	  flex-shrink: 0;
	}

	@keyframes shimmer {
		0% { background-position: -400rpx 0; }
		100% { background-position: 400rpx 0; }
	}
	.skeleton { background: linear-gradient(90deg, #EFEDF5 25%, #E5E0FF 50%, #EFEDF5 75%); background-size: 800rpx 100%; animation: shimmer 1.2s infinite ease-in-out; border-radius: 16rpx; }
	.skel-message-card { height: 320rpx; border-radius: 56rpx; margin-bottom: 30rpx; }
	.skel-message-menu { height: 160rpx; border-radius: 40rpx; margin-bottom: 30rpx; }
	.skel-message-list { height: 100rpx; border-radius: 56rpx; margin-bottom: 20rpx; }
</style>
