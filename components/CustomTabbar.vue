<template>
	<view class="tabbar-wrapper">
		<view class="custom-tabbar">
			<view
				v-for="(item, idx) in tabs"
				:key="item.name"
				class="tab-item"
				:class="{ active: current === item.name, add: item.name === 'add' }"
				@tap="onTabClick(item)"
			>
				<view v-if="item.name === 'add'" class="add-bg" :class="{ 'add-active': current === item.name }"></view>
				<image :src="getIcon(item.name)" mode="aspectFit" :class="['tab-icon', current === item.name && 'tab-icon-active']" />
			</view>
			<view class="active-indicator" :style="indicatorStyle"></view>
		</view>
		<view class="safe-area-spacer"></view>
	</view>
</template>

<script>
	import { haptic } from '@/lib/haptic'

	const TAB_PERCENTS = [11.8, 30.5, 50.0, 69.5, 88.2]

	export default {
		name: "CustomTabbar",
		props: { current: { type: String, default: "home" } },
		data() {
			return {
				tabs: [
					{ name: "home", label: "首页" },
					{ name: "trend", label: "趋势" },
					{ name: "add", label: "添加" },
					{ name: "health", label: "健康" },
					{ name: "message", label: "消息" }
				]
			}
		},
		computed: {
			activeIdx() { return this.tabs.findIndex(t => t.name === this.current) },
			indicatorStyle() {
				const pct = TAB_PERCENTS[this.activeIdx] || 8.8
				return { left: pct + '%' }
			}
		},
		methods: {
			getIcon(name) { return `/static/tabbar/${name}${name === this.current ? '_active' : ''}.png` },
			onTabClick(item) { if (item.name === this.current) return; haptic(); this.$emit("tabChange", item.name) }
		}
	}
</script>

<style scoped>
	.tabbar-wrapper { position: fixed; bottom: 0; left: 0; right: 0; z-index: 5; display: flex; flex-direction: column; align-items: center; }
	.custom-tabbar { box-sizing: border-box; width: 390px; height: 78px; display: flex; justify-content: space-between; align-items: center; padding: 12px 22px; background-color: #fff; border-radius: 34px 34px 0 0; position: relative; }
	.safe-area-spacer { width: 100%; height: 12px; background-color: #fff; }
	.tab-item { position: relative; display: flex; justify-content: center; align-items: center; width: 48px; height: 42px; z-index: 2; }
	.tab-item.add { width: 54px; height: 42px; }
	.add-bg { position: absolute; width: 54px; height: 42px; border-radius: 100px; background-color: #f2f0ff; }
	.add-bg.add-active { background-color: #9b97df; }

	.active-indicator {
		position: absolute;
		bottom: 18px;
		width: 58px;
		height: 42px;
		border-radius: 100px;
		background-color: #9b97df;
		transition: left 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
		z-index: 1;
		transform: translateX(-50%);
	}

	.tab-icon { width: 28px; height: 28px; position: relative; z-index: 2; }
	.tab-icon-active { animation: iconBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
	@keyframes iconBounce { 0% { transform: scale(1); } 40% { transform: scale(1.2); } 100% { transform: scale(1); } }
</style>

