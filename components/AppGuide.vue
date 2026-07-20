<template>
	<view class="guide-overlay" v-if="show" @tap="next">
		<view class="guide-bubble" :style="bubbleStyle">
			<text class="guide-title">{{ steps[currentStep].title }}</text>
			<text class="guide-desc">{{ steps[currentStep].desc }}</text>
			<view class="guide-progress">
				<view v-for="(s, i) in steps" :key="i" :class="['guide-dot', i === currentStep && 'guide-dot-active']"></view>
			</view>
			<text class="guide-next">{{ currentStep < steps.length - 1 ? '点击继续' : '开始使用' }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "AppGuide",
		props: {
			show: { type: Boolean, default: false }
		},
		data() {
			return {
				currentStep: 0,
				steps: [
					{ title: '🏠 首页', desc: '一眼看清宝宝今天的奶量、睡眠和疫苗情况' },
					{ title: '📈 成长趋势', desc: '查看奶量趋势、睡眠规律和体重增长曲线' },
					{ title: '➕ 新增记录', desc: '记录喝奶、睡觉、便便、身高和疫苗接种' },
					{ title: '💉 健康日历', desc: '疫苗月龄提醒，标记接种完成' },
					{ title: '👤 我的', desc: '宝宝档案、提醒设置、数据导出都在这里' }
				]
			}
		},
		computed: {
			bubbleStyle() {
				return { animationDelay: '0.2s' }
			}
		},
		methods: {
			next() {
				if (this.currentStep < this.steps.length - 1) {
					this.currentStep++
				} else {
					uni.setStorageSync('guide_done', 'true')
					this.$emit('close')
				}
			}
		}
	}
</script>

<style>
	.guide-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		z-index: 9999;
		background: rgba(45, 40, 62, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		animation: guideFadeIn 0.3s ease-out;
	}

	@keyframes guideFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.guide-bubble {
		background: #fff;
		border-radius: 48rpx;
		padding: 52rpx 44rpx;
		margin: 0 60rpx;
		width: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
		animation: guidePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes guidePop {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	.guide-title {
		font-size: 40rpx;
		font-weight: 900;
		color: #2D283E;
		margin-bottom: 16rpx;
	}

	.guide-desc {
		font-size: 28rpx;
		color: #8E8A9F;
		text-align: center;
		line-height: 1.5;
		margin-bottom: 36rpx;
	}

	.guide-progress {
		display: flex;
		gap: 12rpx;
		margin-bottom: 24rpx;
	}

	.guide-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: #D1CCFB;
		transition: all 0.2s;
	}

	.guide-dot-active {
		width: 32rpx;
		border-radius: 100rpx;
		background: #8B80F9;
	}

	.guide-next {
		font-size: 24rpx;
		font-weight: 700;
		color: #8B80F9;
	}
</style>
