<template>
	<view class="tabbar-wrapper">
		<view class="custom-tabbar">
			<view
				v-for="item in tabs"
				:key="item.name"
				class="tab-item"
				:class="{ active: current === item.name, add: item.name === 'add' }"
				@tap="onTabClick(item)"
			>
				<view v-if="current === item.name && item.name !== 'add'" class="active-bg"></view>
				<view v-if="item.name === 'add'" class="add-bg" :class="{ 'add-active': current === item.name }"></view>
				<image :src="getIcon(item.name)" mode="aspectFit" class="tab-icon" />
			</view>
		</view>
		<view class="safe-area-spacer"></view>
	</view>
</template>

<script>
	export default {
		name: "CustomTabbar",
		props: {
			current: {
				type: String,
				default: "home"
			}
		},
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
		methods: {
			getIcon(name) {
				if (name === this.current) {
					return `/static/tabbar/${name}_active.png`
				}
				return `/static/tabbar/${name}.png`
			},
			onTabClick(item) {
				if (item.name === this.current) return
				this.$emit("tabChange", item.name)
			}
		}
	}
</script>

<style scoped>
	.tabbar-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.custom-tabbar {
		box-sizing: border-box;
		width: 390px;
		height: 78px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 22px;
		background-color: #fff;
		border-radius: 34px 34px 0 0;
	}

	.safe-area-spacer {
		width: 100%;
		height: 12px;
		background-color: #fff;
	}

	.tab-item {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 48px;
		height: 42px;
	}

	.tab-item.add {
		width: 54px;
		height: 42px;
	}

	.add-bg,
	.active-bg {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		border-radius: 100px;
	}

	.add-bg {
		width: 54px;
		height: 42px;
		background-color: #f2f0ff;
	}

	.add-bg.add-active {
		background-color: #9b97df;
	}

	.active-bg {
		width: 58px;
		height: 42px;
		background-color: #9b97df;
	}

	.tab-icon {
		width: 28px;
		height: 28px;
		position: relative;
		z-index: 1;
	}
</style>
