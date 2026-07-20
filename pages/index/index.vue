<template>
	<view class="container" :key="current">
		<TabHome v-if="current === 'home'" />
		<TabTrend v-if="current === 'trend'" />
		<TabAdd v-if="current === 'add'" @back="onBack" />
		<TabHealth v-if="current === 'health'" />
		<TabMessage v-if="current === 'message'" />
		<CustomTabbar :current="current" @tabChange="onTabChange" />
		<AppGuide :show="showGuide" @close="showGuide = false" />
	</view>
</template>

<script>
	import CustomTabbar from "@/components/CustomTabbar.vue"
	import TabHome from "@/components/tab-content/home.vue"
	import TabTrend from "@/components/tab-content/trend.vue"
	import TabAdd from "@/components/tab-content/add.vue"
	import TabHealth from "@/components/tab-content/health.vue"
	import TabMessage from "@/components/tab-content/message.vue"
	import AppGuide from "@/components/AppGuide.vue"

	export default {
		components: { CustomTabbar, TabHome, TabTrend, TabAdd, TabHealth, TabMessage, AppGuide },
		data() {
			return {
				current: "home",
				prevTab: "home",
				showGuide: false
			}
		},
		mounted() {
			this.showGuide = uni.getStorageSync('guide_done') !== 'true'
		},
		methods: {
			onTabChange(name) {
				this.prevTab = this.current
				this.current = name
			},
			onBack() {
				this.current = this.prevTab
			}
		}
	}
</script>

<style>
	.container {
		position: relative;
		width: 100%;
		min-height: 100vh;
		animation: pageIn 0.2s ease-out;
	}

	@keyframes pageIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
