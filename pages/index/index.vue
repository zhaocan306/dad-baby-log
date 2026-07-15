<template>
	<view class="container">
		<TabHome v-if="current === 'home'" />
		<TabTrend v-if="current === 'trend'" />
		<TabAdd v-if="current === 'add'" @back="onBack" />
		<TabHealth v-if="current === 'health'" />
		<TabMessage v-if="current === 'message'" />
		<CustomTabbar :current="current" @tabChange="onTabChange" />
	</view>
</template>

<script>
	import CustomTabbar from "@/components/CustomTabbar.vue"
	import TabHome from "@/components/tab-content/home.vue"
	import TabTrend from "@/components/tab-content/trend.vue"
	import TabAdd from "@/components/tab-content/add.vue"
	import TabHealth from "@/components/tab-content/health.vue"
	import TabMessage from "@/components/tab-content/message.vue"

	export default {
		components: { CustomTabbar, TabHome, TabTrend, TabAdd, TabHealth, TabMessage },
		data() {
			return {
				current: "home",
				prevTab: "home"
			}
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
	}
</style>
