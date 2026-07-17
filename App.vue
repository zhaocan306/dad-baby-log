<script>
	import { initCloud } from '@/lib/cloud'

	export default {
		async onLaunch() {
			try {
				await initCloud()
				console.log('Cloud initialized')
				// 自动获取用户 openid 存入缓存
				const { result } = await wx.cloud.callFunction({ name: 'init' })
				if (result?.babyId) {
					uni.setStorageSync('current_baby_id', result.babyId)
				}
			} catch (e) {
				console.log('Cloud init error:', e)
			}
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		font-family: 'MarukoGothicCJKsc', 'Zen Maru Gothic', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		background-color: #fffdf8;
		-webkit-tap-highlight-color: transparent;
	}
</style>
