<script>
	export default {
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			uni.loadFontFace({
				family: 'MarukoGothicCJKsc',
				source: 'url("https://cdn.jsdelivr.net/gh/max32002/maruko-gothic@main/webfont/CJK%20SC/MarukoGothicCJKsc-Regular.woff2")',
				global: true,
				success: () => console.log('Maruko Gothic loaded'),
				fail: (err) => console.log('Maruko Gothic failed', err)
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
	@font-face {
		font-family: 'MarukoGothicCJKsc';
		src: url('https://cdn.jsdelivr.net/gh/max32002/maruko-gothic@main/webfont/CJK%20SC/MarukoGothicCJKsc-Regular.woff2') format('woff2');
		font-weight: 400;
		font-display: swap;
	}
	@font-face {
		font-family: 'MarukoGothicCJKsc';
		src: url('https://cdn.jsdelivr.net/gh/max32002/maruko-gothic@main/webfont/CJK%20SC/MarukoGothicCJKsc-Medium.woff2') format('woff2');
		font-weight: 500;
		font-display: swap;
	}
	@font-face {
		font-family: 'MarukoGothicCJKsc';
		src: url('https://cdn.jsdelivr.net/gh/max32002/maruko-gothic@main/webfont/CJK%20SC/MarukoGothicCJKsc-Light.woff2') format('woff2');
		font-weight: 300;
		font-display: swap;
	}
	page {
		font-family: 'MarukoGothicCJKsc', 'Zen Maru Gothic', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		background-color: #fffdf8;
		-webkit-tap-highlight-color: transparent;
	}
</style>
