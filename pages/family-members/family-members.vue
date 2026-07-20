<template>
	<view class="page enter-stagger">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">家庭成员</text>
		</view>

		<view class="family-card">
			<text class="family-card-title">{{ familyName }} 的家庭</text>
			<text class="family-card-count">{{ members.length }} 位成员</text>
		</view>

		<view class="member-list">
			<view class="member-item" v-for="m in members" :key="m.id">
				<image class="member-avatar" src="/static/family-avatar.png" mode="aspectFit"></image>
				<view class="member-info">
				<text class="member-name">{{ m.user_id === 'local' ? '我' : m.user_id?.slice(0, 8) }}</text>
				<text class="member-role">{{ m.role === 'owner' ? '创建者' : '成员' }}</text>
				</view>
			</view>
			<view class="empty-tip" v-if="!members.length">暂无家庭成员数据</view>
		</view>
	</view>
</template>

<script>
	import { query } from '@/lib/cloud'

	export default {
		name: "FamilyMembers",
		data() {
			return {
				members: [],
				familyName: '我的'
			}
		},
		async onShow() {
			const families = await query('families', { limit: 1 }).catch(() => [])
			const family = families?.[0]
			if (family) {
				this.familyName = family.name
				this.members = await query('members', { filter: { family_id: family.id } }).catch(() => [])
			}
		},
		methods: {
			goBack() { uni.navigateBack() }
		}
	}
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 40rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; }

	.family-card { background: #EEF0FF; border-radius: 48rpx; padding: 40rpx; margin-bottom: 40rpx; }
	.family-card-title { font-size: 34rpx; font-weight: 900; }
	.family-card-count { font-size: 24rpx; color: #8E8A9F; font-weight: 600; margin-top: 8rpx; }

	.member-item { background: #fff; border-radius: 32rpx; padding: 28rpx 32rpx; display: flex; align-items: center; margin-bottom: 20rpx; }
	.member-avatar { width: 80rpx; height: 80rpx; border-radius: 50%; margin-right: 24rpx; }
	.member-info { display: flex; flex-direction: column; }
	.member-name { font-size: 30rpx; font-weight: 800; }
	.member-role { font-size: 22rpx; color: #8E8A9F; font-weight: 600; margin-top: 4rpx; }
	.empty-tip { text-align: center; padding: 60rpx 0; color: #8E8A9F; font-size: 26rpx; font-weight: 600; }
</style>
