<template>
	<view class="page enter-stagger">
		<view class="header-section">
			<image src="/static/back.png" mode="aspectFit" class="back-icon" @tap="goBack" />
			<text class="title-main">成长曲线</text>
			<view class="mode-tabs">
				<text :class="['mode-tab', mode === 'height' && 'mode-active']" @tap="switchMode('height')">身高</text>
				<text :class="['mode-tab', mode === 'weight' && 'mode-active']" @tap="switchMode('weight')">体重</text>
				<text :class="['mode-tab', mode === 'head' && 'mode-active']" @tap="switchMode('head')">头围</text>
			</view>
		</view>

		<canvas canvas-id="chartCanvas" class="chart-canvas" @tap="onCanvasTap"></canvas>

		<view class="tooltip" v-if="selectedPoint">
			<text class="tooltip-date">{{ selectedPoint.date }}</text>
			<text class="tooltip-val">{{ mode === 'weight' ? selectedPoint.val + 'kg' : selectedPoint.val + 'cm' }}</text>
		</view>

		<view class="legend">
			<view class="legend-dot" style="background:#8B80F9"></view>
			<text class="legend-text">宝宝数据</text>
		</view>

		<view class="records-summary" v-if="records.length">
			<text class="summary-title">共 {{ records.length }} 次测量</text>
			<view class="summary-row" v-for="(r, i) in [...records].reverse().slice(0, 5)" :key="i">
				<text class="summary-date">{{ r.date }}</text>
				<text class="summary-val">身高 {{ r.height_cm }}cm</text>
				<text class="summary-val">体重 {{ r.weight_kg }}kg</text>
				<text class="summary-val">头围 {{ r.head_cm }}cm</text>
			</view>
		</view>
		<view class="empty-tip" v-else>暂无成长记录，去首页记录吧</view>
	</view>
</template>

<script>
	import { initCloud, getBabyId } from '@/lib/cloud'
	import { heightApi } from '@/lib/api/height'

	const screenWidth = uni.getSystemInfoSync().windowWidth || 375

	export default {
		name: "GrowthChart",
		data() {
			return {
				records: [],
				mode: 'height',
				loaded: false,
				selectedPoint: null,
				pointCoords: []
			}
		},
		async onShow() {
			const babyId = getBabyId()
			if (!babyId) return
			await initCloud()
			this.records = await heightApi.list(babyId, { limit: 100 }).catch(() => [])
			this.$nextTick(() => this.drawChart())
		},
		methods: {
			switchMode(m) {
				this.mode = m
				this.$nextTick(() => this.drawChart())
			},
			drawChart() {
				const data = this.records.filter(r => r[this.fieldKey]).sort((a, b) => new Date(a.date) - new Date(b.date))
				if (!data.length) return

				const rpx = px => px / 750 * screenWidth
				const canvasWidth = Math.round(rpx(690))
				const canvasHeight = Math.round(rpx(460))
				const pad = { top: 40, right: 30, bottom: 50, left: 60 }
				const chartW = canvasWidth - pad.left - pad.right
				const chartH = canvasHeight - pad.top - pad.bottom

				const vals = data.map(r => +r[this.fieldKey])
				const minVal = Math.floor(Math.min(...vals) * 0.95)
				const maxVal = Math.ceil(Math.max(...vals) * 1.05)
				const range = maxVal - minVal || 1

				const xStep = chartW / (data.length - 1 || 1)

				const ctx = uni.createCanvasContext('chartCanvas')

				// 背景
				ctx.setFillStyle('#FFFFFF')
				ctx.fillRect(0, 0, canvasWidth, canvasHeight)

				// 网格�?				ctx.setStrokeStyle('#F0EEF5')
				ctx.setLineWidth(1)
				for (let i = 0; i <= 4; i++) {
					const y = pad.top + (chartH / 4) * i
					ctx.beginPath()
					ctx.moveTo(pad.left, y)
					ctx.lineTo(canvasWidth - pad.right, y)
					ctx.stroke()
				}

				// Y 轴标�?				ctx.setFillStyle('#8E8A9F')
				ctx.setFontSize(11)
				for (let i = 0; i <= 4; i++) {
					const val = maxVal - (range / 4) * i
					const y = pad.top + (chartH / 4) * i
					ctx.fillText(val.toFixed(1), 4, y + 4)
				}

				// X 轴标签（最�?个）
				ctx.setFillStyle('#8E8A9F')
				ctx.setFontSize(10)
				const labelCount = Math.min(data.length, 6)
				const labelStep = Math.max(1, Math.floor((data.length - 1) / (labelCount - 1)))
				for (let i = 0; i < data.length; i += labelStep) {
					const x = pad.left + xStep * i
					const label = data[i].date.slice(5)
					ctx.fillText(label, x - 12, canvasHeight - pad.bottom + 18)
				}
				// 最后一�?				const lastX = pad.left + xStep * (data.length - 1)
				ctx.fillText(data[data.length - 1].date.slice(5), lastX - 12, canvasHeight - pad.bottom + 18)

				// 曲线
				ctx.setStrokeStyle('#8B80F9')
				ctx.setLineWidth(3)
				ctx.beginPath()
				data.forEach((r, i) => {
					const x = pad.left + xStep * i
					const y = pad.top + chartH - ((+r[this.fieldKey] - minVal) / range) * chartH
					i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
				})
				ctx.stroke()

				// 数据�?				const coords = []
				ctx.setFillStyle('#8B80F9')
				data.forEach((r, i) => {
					const x = pad.left + xStep * i
					const y = pad.top + chartH - ((+r[this.fieldKey] - minVal) / range) * chartH
					coords.push({ x, y, date: r.date, val: +r[this.fieldKey] })
					ctx.beginPath()
					ctx.arc(x, y, 5, 0, 2 * Math.PI)
					ctx.fill()
				})
				this.pointCoords = coords

				// 最近一次数据标�?				const last = data[data.length - 1]
				const lx = pad.left + xStep * (data.length - 1)
				const ly = pad.top + chartH - ((+last[this.fieldKey] - minVal) / range) * chartH
				ctx.setFillStyle('#2D283E')
				ctx.setFontSize(13)
				ctx.fillText(last[this.fieldKey] + (this.fieldKey === 'weight_kg' ? 'kg' : 'cm'), lx - 20, ly - 14)

				ctx.draw()
				this.loaded = true
			},
		onCanvasTap(e) {
				const px = e.detail?.x || e.touches?.[0]?.x || 0
				const py = e.detail?.y || e.touches?.[0]?.y || 0
				if (!this.pointCoords.length) return
				let closest = this.pointCoords[0], minDist = Infinity
				this.pointCoords.forEach(p => {
					const d = Math.sqrt((p.x - px) ** 2 + (p.y - py) ** 2)
					if (d < minDist) { minDist = d; closest = p }
				})
				if (minDist < 60) this.selectedPoint = closest
				else this.selectedPoint = null
			},
			goBack() { uni.navigateBack() }
		},
		computed: {
			fieldKey() {
				return this.mode === 'height' ? 'height_cm' : this.mode === 'weight' ? 'weight_kg' : 'head_cm'
			}
		}
	}
</script>

<style>
	.page { min-height: 100vh; background: #FAF9F5; padding: 88rpx 44rpx 0; color: #2D283E; }
	.header-section { display: flex; align-items: center; gap: 16rpx; margin-bottom: 30rpx; flex-wrap: wrap; }
	.back-icon { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.title-main { font-size: 38rpx; font-weight: 900; flex-shrink: 0; }
	.mode-tabs { display: flex; background: #EFEDF5; border-radius: 100rpx; margin-left: auto; }
	.mode-tab { padding: 12rpx 32rpx; font-size: 24rpx; font-weight: 800; border-radius: 100rpx; color: #8E8A9F; }
	.mode-active { background: #8B80F9; color: #fff; }

	.chart-canvas { width: 690rpx; height: 460rpx; background: #fff; border-radius: 40rpx; margin-bottom: 24rpx; }

	.tooltip {
	  background: #2D283E;
	  border-radius: 20rpx;
	  padding: 16rpx 28rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  margin: -20rpx auto 20rpx;
	  width: fit-content;
	}
	.tooltip-date { font-size: 22rpx; color: #B8B5C8; }
	.tooltip-val { font-size: 32rpx; font-weight: 900; color: #fff; }

	.legend { display: flex; align-items: center; gap: 8rpx; margin-bottom: 30rpx; padding-left: 20rpx; }
	.legend-dot { width: 20rpx; height: 20rpx; border-radius: 50%; }
	.legend-text { font-size: 22rpx; color: #8E8A9F; font-weight: 600; }

	.records-summary { background: #fff; border-radius: 40rpx; padding: 28rpx; }
	.summary-title { font-size: 28rpx; font-weight: 800; margin-bottom: 16rpx; }
	.summary-row { display: flex; justify-content: space-between; padding: 16rpx 0; border-bottom: 2rpx solid #FBFBFC; font-size: 22rpx; }
	.summary-date { font-weight: 700; width: 120rpx; }
	.summary-val { color: #8E8A9F; font-weight: 600; }
	.empty-tip { text-align: center; padding: 80rpx 0; color: #8E8A9F; font-size: 26rpx; font-weight: 600; }
</style>
