<template>
	<view class="page enter-stagger">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">提醒设置</text>
		</view>

		<view class="setting-group">
			<view class="setting-row">
				<view class="s-left">
					<text class="s-label">喂奶提醒</text>
					<text class="s-desc">间隔 {{ feedInterval }} 小时提醒</text>
				</view>
				<switch :checked="feedEnabled" @change="feedEnabled = !feedEnabled" color="#8B80F9" />
			</view>
			<view class="setting-row" v-if="feedEnabled">
				<text class="s-label">喂奶间隔</text>
				<view class="s-counter">
					<text class="s-btn" @tap="feedInterval = Math.max(1, feedInterval - 0.5)">−</text>
					<text class="s-val">{{ feedInterval }}h</text>
					<text class="s-btn" @tap="feedInterval = Math.min(6, feedInterval + 0.5)">+</text>
				</view>
			</view>

			<view class="setting-row">
				<view class="s-left">
					<text class="s-label">睡眠提醒</text>
					<text class="s-desc">超过 {{ sleepThreshold }}h 未睡提醒</text>
				</view>
				<switch :checked="sleepEnabled" @change="sleepEnabled = !sleepEnabled" color="#8B80F9" />
			</view>
			<view class="setting-row" v-if="sleepEnabled">
				<text class="s-label">清醒阈值</text>
				<view class="s-counter">
					<text class="s-btn" @tap="sleepThreshold = Math.max(0.5, sleepThreshold - 0.5)">−</text>
					<text class="s-val">{{ sleepThreshold }}h</text>
					<text class="s-btn" @tap="sleepThreshold = Math.min(4, sleepThreshold + 0.5)">+</text>
				</view>
			</view>

			<view class="setting-row">
				<view class="s-left">
					<text class="s-label">疫苗提醒</text>
					<text class="s-desc">提前 {{ vaccineDays }} 天提醒</text>
				</view>
				<switch :checked="vaccineEnabled" @change="vaccineEnabled = !vaccineEnabled" color="#8B80F9" />
			</view>
			<view class="setting-row" v-if="vaccineEnabled">
				<text class="s-label">提前天数</text>
				<view class="s-counter">
					<text class="s-btn" @tap="vaccineDays = Math.max(1, vaccineDays - 1)">−</text>
					<text class="s-val">{{ vaccineDays }}天</text>
					<text class="s-btn" @tap="vaccineDays = Math.min(14, vaccineDays + 1)">+</text>
				</view>
			</view>
		</view>

		<view class="save-btn" @tap="save">保存设置</view>
	</view>
</template>

<script>
	export default {
		name: "ReminderSettings",
		data() {
			return {
				feedEnabled: false, feedInterval: 3,
				sleepEnabled: false, sleepThreshold: 2,
				vaccineEnabled: false, vaccineDays: 2
			}
		},
		onShow() {
			const saved = uni.getStorageSync('reminder_settings')
			if (saved) Object.assign(this, JSON.parse(saved))
		},
		methods: {
			save() {
				uni.setStorageSync('reminder_settings', JSON.stringify({
					feedEnabled: this.feedEnabled, feedInterval: this.feedInterval,
					sleepEnabled: this.sleepEnabled, sleepThreshold: this.sleepThreshold,
					vaccineEnabled: this.vaccineEnabled, vaccineDays: this.vaccineDays
				}))
				uni.showToast({ title: '已保存', icon: 'success' })
			},
			goBack() { uni.navigateBack() }
		}
	}
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 40rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; }

	.setting-group { background: #fff; border-radius: 48rpx; padding: 32rpx; }
	.setting-row { display: flex; align-items: center; justify-content: space-between; padding: 24rpx 0; border-bottom: 2rpx solid #FBFBFC; }
	.setting-row:last-child { border-bottom: none; }
	.s-left { display: flex; flex-direction: column; }
	.s-label { font-size: 28rpx; font-weight: 800; }
	.s-desc { font-size: 22rpx; color: #8E8A9F; font-weight: 600; margin-top: 4rpx; }
	.s-counter { display: flex; align-items: center; gap: 16rpx; }
	.s-btn { width: 48rpx; height: 48rpx; background: #F3F1FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32rpx; font-weight: 700; color: #8B80F9; }
	.s-val { width: 80rpx; text-align: center; font-size: 30rpx; font-weight: 800; }

	.save-btn { margin-top: 40rpx; background: #8B80F9; border-radius: 48rpx; padding: 30rpx 0; text-align: center; font-size: 30rpx; font-weight: 900; color: #fff; box-shadow: 0 12rpx 32rpx rgba(139,128,249,0.22); }
</style>
