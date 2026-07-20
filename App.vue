<script>
	import { initCloud, getUser, query, add, store } from '@/lib/cloud'

	export default {
		async onLaunch() {
			try {
				await initCloud()

				const babyId = uni.getStorageSync('current_baby_id')
				if (babyId) return

				const families = await query('families', { limit: 1 })
				let familyId = families?.[0]?.id

				if (!familyId) {
					const user = (await getUser()).data.user
					familyId = await add('families', { name: '我的家庭' })
					await add('members', {
						family_id: familyId, user_id: user.id, role: 'owner'
					})
				}

				const babies = await query('babies', { filter: { family_id: familyId }, limit: 1 })
				if (babies?.length) {
					store.setBabyId(babies[0].id)
					return
				}

				const newBabyId = await add('babies', {
					family_id: familyId, name: '小鲸鱼',
					gender: 'female', birthday: '2026-06-10'
				})
				store.setBabyId(newBabyId)
			} catch (e) {
				console.log('App init error:', e.message)
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
	@font-face {
		font-family: 'MarukoGothicCJKsc';
		src: url('/static/fonts/MarukoGothicCJKsc-Regular-subset.woff2') format('woff2'),
			 url('/static/fonts/MarukoGothicCJKsc-Regular-subset.ttf') format('truetype');
		font-weight: normal;
		font-display: swap;
	}

	:root {
		--bg-cream: #FAF9F5;
		--text-dark: #2D283E;
		--text-gray: #8E8A9F;
		--card-milk: #EEF0FF;
		--card-sleep: #E8E5FF;
		--card-poop: #F7E5DE;
		--card-height: #EBF4ED;
		--card-vaccine: #FFF6D6;
		--baby-purple: #8B80F9;
		--card-bg: #FFFFFF;
	}

	page {
		font-family: 'MarukoGothicCJKsc', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
		background-color: var(--bg-cream);
		-webkit-tap-highlight-color: transparent;
	}

	/* 全局页面入场动画 */
	view.page {
		animation: pageIn 0.3s ease-out;
	}

	@keyframes pageIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* 通用分段入场（子元素逐个上滑） */
	.enter-stagger > * {
		animation: staggerUp 0.4s ease-out both;
	}

	.enter-stagger > *:nth-child(1) { animation-delay: 0s; }
	.enter-stagger > *:nth-child(2) { animation-delay: 0.08s; }
	.enter-stagger > *:nth-child(3) { animation-delay: 0.16s; }
	.enter-stagger > *:nth-child(4) { animation-delay: 0.24s; }
	.enter-stagger > *:nth-child(5) { animation-delay: 0.32s; }
	.enter-stagger > *:nth-child(6) { animation-delay: 0.4s; }

	@keyframes staggerUp {
		from { opacity: 0; transform: translateY(24rpx); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* 列表项逐条滑入 */
	.list-enter > * {
		animation: listIn 0.3s ease-out both;
	}

	.list-enter > *:nth-child(1) { animation-delay: 0s; }
	.list-enter > *:nth-child(2) { animation-delay: 0.04s; }
	.list-enter > *:nth-child(3) { animation-delay: 0.08s; }
	.list-enter > *:nth-child(4) { animation-delay: 0.12s; }
	.list-enter > *:nth-child(5) { animation-delay: 0.16s; }
	.list-enter > *:nth-child(6) { animation-delay: 0.2s; }
	.list-enter > *:nth-child(7) { animation-delay: 0.24s; }
	.list-enter > *:nth-child(8) { animation-delay: 0.28s; }

	@keyframes listIn {
		from { opacity: 0; transform: translateX(-20rpx); }
		to { opacity: 1; transform: translateX(0); }
	}

	/* 删除飞走动画 */
	.record-deleting {
		transform: translateX(60%) !important;
		opacity: 0 !important;
		transition: all 0.25s ease-in !important;
	}

	/* 空状态浮动 */
	.float-anim {
		animation: floatUp 3s ease-in-out infinite;
	}

	@keyframes floatUp {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-12rpx); }
	}
</style>
