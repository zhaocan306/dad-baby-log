<template>
	<view class="page">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">宝宝档案</text>
		</view>

		<view class="form-card">
			<view class="form-item">
				<text class="form-label">名字</text>
				<input class="form-input" v-model="name" placeholder="输入宝宝名字" />
			</view>
			<view class="form-item">
				<text class="form-label">性别</text>
				<view class="gender-group">
					<view :class="['gender-btn', gender === 'female' && 'gender-active']" @tap="gender = 'female'"><text>女宝宝</text></view>
					<view :class="['gender-btn', gender === 'male' && 'gender-active']" @tap="gender = 'male'"><text>男宝宝</text></view>
				</view>
			</view>
			<view class="form-item">
				<text class="form-label">阶段</text>
				<view class="stage-group">
					<view :class="['stage-btn', stage === 'pregnant' && 'stage-active']" @tap="stage = 'pregnant'"><text>怀孕中</text></view>
					<view :class="['stage-btn', stage === 'born' && 'stage-active']" @tap="stage = 'born'"><text>已出生</text></view>
				</view>
			</view>
			<view class="form-item" v-if="stage === 'born'">
				<text class="form-label">出生日期</text>
				<picker mode="date" :value="birthday" @change="e => birthday = e.detail.value">
					<view class="date-picker">{{ birthday || '选择日期' }}</view>
				</picker>
			</view>
			<view class="form-item" v-if="stage === 'pregnant'">
				<text class="form-label">预产期</text>
				<picker mode="date" :value="dueDate" @change="e => dueDate = e.detail.value">
					<view class="date-picker">{{ dueDate || '选择预产期' }}</view>
				</picker>
			</view>
		</view>
		<view class="save-btn" @tap="save">保存</view>
	</view>
</template>

<script>
	import { babyApi } from '@/lib/api/baby'
	import { getBabyId } from '@/lib/cloud'

	export default {
		name: "BabyProfile",
		data() { return { name: '', gender: 'female', stage: 'born', birthday: '', dueDate: '' } },
		async onShow() {
			const id = getBabyId()
			const baby = await babyApi.getCurrent(id)
			if (baby) { this.name = baby.name || ''; this.gender = baby.gender || 'female'; this.birthday = baby.birthday || ''; this.dueDate = baby.due_date || ''; this.stage = baby.birthday ? 'born' : 'pregnant' }
		},
		methods: {
			async save() {
				if (!this.name.trim()) { uni.showToast({ title: '请输入宝宝名字', icon: 'none' }); return }
				if (this.stage === 'pregnant' && !this.dueDate) { uni.showToast({ title: '请选择预产期', icon: 'none' }); return }
				if (this.stage === 'born' && !this.birthday) { uni.showToast({ title: '请选择出生日期', icon: 'none' }); return }
				try {
					const id = getBabyId()
					const payload = { name: this.name.trim(), gender: this.gender }
					if (this.stage === 'born') { payload.birthday = this.birthday; payload.due_date = null }
					else { payload.due_date = this.dueDate; payload.birthday = null }
					await babyApi.update(id, payload)
					uni.showToast({ title: '保存成功', icon: 'success' })
					setTimeout(() => uni.navigateBack(), 800)
				} catch (e) { uni.showToast({ title: '保存失败: ' + e.message, icon: 'none' }) }
			},
			goBack() { uni.navigateBack() }
		}
	}
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 48rpx; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; }
	.form-card { background: #fff; border-radius: 48rpx; padding: 40rpx; }
	.form-item { margin-bottom: 36rpx; }
	.form-item:last-child { margin-bottom: 0; }
	.form-label { font-size: 28rpx; font-weight: 800; color: #8E8A9F; margin-bottom: 16rpx; }
	.form-input { background: #F5F4FA; border-radius: 24rpx; padding: 24rpx 28rpx; font-size: 30rpx; font-weight: 700; color: #2D283E; }
	.gender-group, .stage-group { display: flex; gap: 20rpx; }
	.gender-btn, .stage-btn { flex: 1; padding: 24rpx 0; text-align: center; background: #F5F4FA; border-radius: 24rpx; font-size: 28rpx; font-weight: 700; color: #8E8A9F; }
	.gender-active, .stage-active { background: #8B80F9; color: #fff; }
	.date-picker { background: #F5F4FA; border-radius: 24rpx; padding: 24rpx 28rpx; font-size: 30rpx; font-weight: 700; color: #2D283E; }
	.save-btn { margin-top: 48rpx; background: #8B80F9; border-radius: 48rpx; padding: 32rpx 0; text-align: center; font-size: 30rpx; font-weight: 900; color: #fff; box-shadow: 0 12rpx 32rpx rgba(139,128,249,0.22); }
</style>
