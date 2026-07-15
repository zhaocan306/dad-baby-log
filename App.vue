<script>
	export default {
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			uni.loadFontFace({
				family: 'Zen Maru Gothic',
				source: 'url("https://cdn.jsdelivr.net/gh/googlefonts/zen-marugothic@main/fonts/ttf/ZenMaruGothic-Regular.ttf")',
				global: true,
				success: () => console.log('Zen Maru Gothic loaded'),
				fail: (err) => console.log('Zen Maru Gothic failed', err)
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		font-family: 'Zen Maru Gothic', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		background-color: #fffdf8;
	}
</style>
