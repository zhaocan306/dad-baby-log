<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding enter-stagger" scroll-y>

			<!-- 1. 标题行 + 通知铃铛 -->
			<view class="title-row">
			  <text class="title-main">新增记录</text>
			  <image class="notif-btn-icon" src="/static/icon-bell-purple.png" mode="aspectFit"></image>
			</view>

			<!-- 2. 核心五大类型 Tab 导航栏 -->
			<view class="tabs-row">
			  <view
			    v-for="tab in recordTypes"
			    :key="tab.id"
			    @tap="switchType(tab.id)"
			    :class="['tab-item-box', currentType === tab.id ? 'active-tab-' + tab.id : '']"
			  >
			    <image class="tab-icon" :src="currentType === tab.id ? tab.activeIcon : tab.icon" mode="aspectFit"></image>
			    <text :class="['tab-text', currentType === tab.id ? 'text-white-force' : '']">{{ tab.name }}</text>
			  </view>
			</view>

			<!-- 3. 动态核心表单卡片区域 -->
			<view class="form-card shadow-soft" :class="['bg-card-' + currentType]">
			  <view class="form-card-header">
			    <text class="form-card-title">{{ currentConfig.cardTitle }}</text>
			    <picker mode="time" :value="recordTime" @change="onTimeChange">
			    <view class="time-badge">
			      <image class="time-icon" src="/static/icon-time-clock.png" mode="aspectFit"></image>
			      <text class="time-badge-text">{{ recordTime }}</text>
			    </view>
			    </picker>
			  </view>

			  <view class="counter-container" v-if="currentType !== 'height' && currentType !== 'vaccine'">
			    <view class="counter-btn-wrapper btn-minus" @tap="decrement">
			      <text class="counter-symbol">—</text>
			    </view>
			    <view class="value-display">
			      <input class="value-input" v-model="recordValue" type="text" />
			      <text class="value-unit" v-if="currentConfig.unit">{{ currentConfig.unit }}</text>
			    </view>
			    <view class="counter-btn-wrapper btn-plus" @tap="increment">
			      <text class="counter-symbol">＋</text>
			    </view>
			  </view>

			  <view class="height-fields" v-if="currentType === 'height'">
			    <view class="hf-item">
			      <text class="hf-label">身高</text>
			      <view class="hf-input-row">
			        <input class="hf-input" v-model="heightValue" type="digit" placeholder="0" />
			        <text class="hf-unit">cm</text>
			      </view>
			    </view>
			    <view class="hf-item">
			      <text class="hf-label">体重</text>
			      <view class="hf-input-row">
			        <input class="hf-input" v-model="weightValue" type="digit" placeholder="0" />
			        <text class="hf-unit">kg</text>
			      </view>
			    </view>
			    <view class="hf-item">
			      <text class="hf-label">头围</text>
			      <view class="hf-input-row">
			        <input class="hf-input" v-model="headValue" type="digit" placeholder="0" />
			        <text class="hf-unit">cm</text>
			      </view>
			    </view>
			  </view>

			  <view class="vaccine-fields" v-if="currentType === 'vaccine'">
			    <view class="hf-item">
			      <text class="hf-label">名称</text>
			      <view class="hf-input-row">
			        <input class="hf-input" v-model="vaccineName" type="text" placeholder="例如：乙肝疫苗" />
			      </view>
			    </view>
			    <view class="hf-item">
			      <text class="hf-label">针次</text>
			      <view class="hf-input-row">
			        <text class="hf-prefix">第</text>
			        <input class="hf-input" v-model="vaccineDose" type="number" placeholder="2" />
			        <text class="hf-suffix">针</text>
			      </view>
			    </view>
			    <view class="hf-item" v-if="selectedTag === '已预约'">
			      <text class="hf-label">日期</text>
			      <picker mode="date" :value="vaccineDate" @change="e => vaccineDate = e.detail.value">
			        <view class="hf-input-row">
			          <view class="hf-input hf-date">{{ vaccineDate || '选择日期' }}</view>
			        </view>
			      </picker>
			    </view>
			  </view>

			  <view class="tags-group-row" v-if="currentType !== 'height'">
			    <view
			      v-for="(tag, idx) in currentConfig.tags"
			      :key="idx"
			      @tap="selectedTag = tag"
			      :class="['tag-item', selectedTag === tag ? 'tag-active-' + currentType : '', idx === 0 && !selectedTag ? 'tag-active-' + currentType : '']"
			    >
			      <text :class="['tag-text', selectedTag === tag ? 'text-active-' + currentType : '', idx === 0 && !selectedTag ? 'text-active-' + currentType : '']">{{ tag }}</text>
			    </view>
			  </view>

			  <view class="memo-area-box">
			    <text class="memo-title">备注</text>
			    <textarea
			      class="memo-textarea"
			      v-model="note"
			      :placeholder="currentConfig.placeholder"
			      placeholder-class="textarea-placeholder"
			      fixed="true"
			    />
			  </view>
			</view>

			<!-- 4. 保存提交按钮区域 -->
			<view class="save-button shadow-purple" @tap="save">
			  <image class="save-btn-icon" src="/static/icon-save-plus.png" mode="aspectFit"></image>
			  <text class="save-btn-text">{{ saving ? '保存中...' : currentConfig.btnText }}</text>
			</view>

		  </scroll-view>
	</view>

	<!-- 保存成功庆祝动画 -->
	<view class="success-overlay" v-if="showSuccess" @tap="showSuccess = false">
		<view class="success-circle">
			<text class="success-check">✓</text>
		</view>
		<view class="particle p1"></view>
		<view class="particle p2"></view>
		<view class="particle p3"></view>
		<view class="particle p4"></view>
		<view class="particle p5"></view>
		<view class="particle p6"></view>
	</view>
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
	import { initCloud, query, add, store } from '@/lib/cloud'
	import { recordFeedTime, recordSleepEnd } from '@/lib/notify'
	import { haptic } from '@/lib/haptic'
	import { feedApi } from '@/lib/api/feed'
	import { sleepApi } from '@/lib/api/sleep'
	import { poopApi } from '@/lib/api/poop'
	import { heightApi } from '@/lib/api/height'
	import { vaccineApi } from '@/lib/api/vaccine'

	const apis = {
	  milk: feedApi, poop: poopApi, sleep: sleepApi, height: heightApi, vaccine: vaccineApi
	}

	export default {
		name: "TabAdd",
		components: { CustomNavbar },
		data() {
		    return {
		      currentType: 'milk',
		      recordValue: '120',
		      note: '',
		      selectedTag: '',
		      saving: false,
		      showSuccess: false,
		      recordTime: '',
		      heightValue: '',
		      weightValue: '',
		      headValue: '',
		      vaccineName: '',
		      vaccineDose: '',
		      vaccineDate: '',
		      recordTypes: [
		        { id: 'milk', name: '喝奶', icon: '/static/shuidi.png', activeIcon: '/static/shuidi_active.png' },
		        { id: 'poop', name: '便便', icon: '/static/bianbian.png', activeIcon: '/static/bianbian_active.png' },
		        { id: 'sleep', name: '睡觉', icon: '/static/shuimian.png', activeIcon: '/static/shuimian_active.png' },
		        { id: 'height', name: '身高', icon: '/static/shengao.png', activeIcon: '/static/shengao_active.png' },
		        { id: 'vaccine', name: '疫苗', icon: '/static/yimiao.png', activeIcon: '/static/yimiao_active.png' }
		      ],
		      formConfigs: {
		        milk: {
		          cardTitle: '本次奶量', timeText: '刚刚', defaultVal: '120', unit: 'ml', step: 10,
		          tags: ['奶瓶', '亲喂', '配方奶'], placeholder: '吐奶、拍嗝、宝宝情绪都可以记在这里', btnText: '保存这次记录'
		        },
		        poop: {
		          cardTitle: '本次便便', timeText: '08:45', defaultVal: '中', unit: '量', step: null,
		          tags: ['黄金色', '软糊状', '尿布已换'], placeholder: '颜色、形态、是否有奶瓣或红屁屁都可以记在这里', btnText: '保存便便记录'
		        },
		        sleep: {
		          cardTitle: '睡眠时长', timeText: '13:20 开始', defaultVal: '2.0', unit: '小时', step: 0.5,
		          tags: ['日间小睡', '夜间睡眠', '安抚入睡'], placeholder: '入睡方式、是否夜醒、环境光线都可以记在这里', btnText: '保存睡眠记录'
		        },
		        height: {
		          cardTitle: '成长测量', timeText: '今天', defaultVal: '52.4', unit: 'cm', step: 0.1,
		          tags: ['身高', '体重 4.1kg', '头围 37cm'], placeholder: '测量姿势、是否空腹、医生建议都可以记在这里', btnText: '保存成长记录'
		        },
		        vaccine: {
		          cardTitle: '接种信息', timeText: '7月11日', defaultVal: '乙肝', unit: '第2针', step: null,
		          tags: ['已预约', '已接种', '延后'], placeholder: '接种地点、批号、留观反应和体温变化都可以记在这里', btnText: '保存疫苗记录'
		        }
		      }
		    };
		  },
		computed: {
		    currentConfig() {
		      return this.formConfigs[this.currentType];
		    }
		  },
		  mounted() {
		    this.setNow()
		  },
		  methods: {
		setNow() {
		      const now = new Date()
		      const h = String(now.getHours()).padStart(2, '0')
		      const m = String(now.getMinutes()).padStart(2, '0')
		      this.recordTime = h + ':' + m
		    },
		    onTimeChange(e) {
		      this.recordTime = e.detail.value
		    },
		switchType(typeId) {
		      this.currentType = typeId
		      this.recordValue = this.formConfigs[typeId].defaultVal
		      this.note = ''
		      this.heightValue = ''
		      this.weightValue = ''
		      this.headValue = ''
		      this.vaccineName = ''
		      this.vaccineDose = ''
		      this.vaccineDate = ''
		      this.setNow()
		    },
		    increment() {
		      const step = this.currentConfig.step
		      if (!step) return
		      this.recordValue = String(+(+this.recordValue + step).toFixed(1))
		    },
		    decrement() {
		      const step = this.currentConfig.step
		      if (!step) return
		      const val = +this.recordValue - step
		      if (val < 0) return
		      this.recordValue = String(+val.toFixed(1))
		    },
		    async save() {
		      if (this.saving) return
		      this.saving = true
		      try {
		        let babyId = store.babyId
		        if (!babyId) {
		          try {
		            await initCloud()
		            const families = await query('families', { limit: 1 }).catch(() => [])
		            let familyId = families?.[0]?.id
		            if (!familyId) {
		              familyId = await add('families', { name: '我的家庭' })
		            }
		            const babies = await query('babies', { filter: { family_id: familyId }, limit: 1 }).catch(() => [])
		            if (babies?.length) {
		              babyId = babies[0].id
		            } else {
		              babyId = await add('babies', {
		                family_id: familyId, name: '小鲸鱼',
		                gender: 'female', birthday: '2026-06-10'
		              })
		            }
		            store.setBabyId(babyId)
		          } catch (e) {
		            uni.showToast({ title: '初始化失败: ' + e.message, icon: 'none' })
		            return
		          }
		        }
		        const [h, m] = this.recordTime.split(':')
		        const now = new Date()
		        now.setHours(+h, +m, 0, 0)
		        const payload = { baby_id: babyId, note: this.note, created_at: now.toISOString() }
		        const api = apis[this.currentType]

		        switch (this.currentType) {
		          case 'milk':
		            Object.assign(payload, {
		              type: this.selectedTag === '亲喂' ? 'breast' : this.selectedTag === '配方奶' ? 'formula' : 'bottle',
		              amount_ml: +this.recordValue
		            })
		            break
		          case 'poop':
		            Object.assign(payload, {
		              amount: this.recordValue === '少' ? 'little' : this.recordValue === '中' ? 'middle' : 'large',
		              color: this.selectedTag || null, diaper_changed: true
		            })
		            break
		          case 'sleep':
		            Object.assign(payload, {
		              type: this.selectedTag === '夜间睡眠' ? 'night' : this.selectedTag === '晨间回笼觉' ? 'morning' : 'nap',
		              start_time: new Date().toISOString(),
		              end_time: new Date(Date.now() + (+this.recordValue * 3600000)).toISOString()
		            })
		            break
		          case 'height':
		            Object.assign(payload, {
		              height_cm: this.heightValue ? +this.heightValue : null,
		              weight_kg: this.weightValue ? +this.weightValue : null,
		              head_cm: this.headValue ? +this.headValue : null,
		              date: new Date().toISOString().slice(0, 10)
		            })
		            break
		          case 'vaccine':
		            Object.assign(payload, {
		              name: this.vaccineName || '疫苗',
		              dose: this.vaccineDose ? '第' + this.vaccineDose + '针' : null,
		              status: this.selectedTag === '已接种' ? 'done' : this.selectedTag === '已预约' ? 'booked' : 'pending',
		              due_date: this.vaccineDate || null
		            })
		            break
		        }

		        await api.create(payload)
		        if (this.currentType === 'milk') recordFeedTime()
		        if (this.currentType === 'sleep') recordSleepEnd(payload.end_time)
		        haptic('medium')
		        this.showSuccess = true
		        setTimeout(() => { this.showSuccess = false; this.switchType(this.currentType) }, 1000)
		      } catch (e) {
		        uni.showToast({ title: '保存失败: ' + e.message, icon: 'none' })
		      } finally {
		        this.saving = false
		      }
		    }
		  }
	}
</script>

<style>
	.page {
		--baby-purple-light: #D1CCFB;
		--bg-milk: #EEF0FF;
		--bg-poop: #F7E5DE;
		--bg-sleep: #E8E5FF;
		--bg-height: #EBF4ED;
		--bg-vaccine: #FFF6D6;

		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  flex: 1;
	  height: 0;
	  padding: 0 44rpx;
	  width: calc(100% - 88rpx);
	}

	/* ==================== 标题行 ==================== */
	.title-row {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 44rpx;
	}

	.title-main {
	  font-size: 38rpx;
	  font-weight: 900;
	  letter-spacing: 1rpx;
	}

	.notif-btn-icon {
	  width: 88rpx;
	  height: 88rpx;
	}

	/* ==================== 类型 Tab 栏 ==================== */
	.tabs-row {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  margin-bottom: 44rpx;
	}

	.tab-item-box {
	  flex: 1;
	  background-color: #FFFFFF;
	  border: 1px solid rgba(142, 138, 159, 0.08);
	  border-radius: 40rpx;
	  padding: 24rpx 10rpx;
	  margin: 0 6rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  box-sizing: border-box;
	}

	.tab-item-box:first-child { margin-left: 0; }
	.tab-item-box:last-child { margin-right: 0; }

	.tab-icon {
	  width: 48rpx;
	  height: 48rpx;
	  margin-bottom: 8rpx;
	}

	.tab-text {
	  font-size: 20rpx;
	  font-weight: 800;
	  color: var(--text-gray);
	}

	.text-white-force {
	  color: #FFFFFF !important;
	}

	.active-tab-milk { background-color: var(--baby-purple) !important; border-color: var(--baby-purple) !important; }
	.active-tab-poop { background-color: #A392D8 !important; border-color: #A392D8 !important; }
	.active-tab-sleep { background-color: var(--baby-purple) !important; border-color: var(--baby-purple) !important; }
	.active-tab-height { background-color: var(--baby-purple) !important; border-color: var(--baby-purple) !important; }
	.active-tab-vaccine { background-color: var(--baby-purple) !important; border-color: var(--baby-purple) !important; }

	/* ==================== 动态表单卡片 ==================== */
	.form-card {
	  border-radius: 56rpx;
	  padding: 44rpx;
	  margin-bottom: 44rpx;
	  box-sizing: border-box;
	}

	.shadow-soft {
	  box-shadow: 0 8rpx 32rpx rgba(142, 138, 159, 0.04);
	}

	.bg-card-milk { background-color: var(--bg-milk); }
	.bg-card-poop { background-color: var(--bg-poop); }
	.bg-card-sleep { background-color: var(--bg-sleep); }
	.bg-card-height { background-color: var(--bg-height); }
	.bg-card-vaccine { background-color: var(--bg-vaccine); }

	.form-card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 44rpx;
	}

	.form-card-title {
	  font-size: 32rpx;
	  font-weight: 900;
	}

	.time-badge {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: center;
	  background-color: rgba(255, 255, 255, 0.7);
	  padding: 8rpx 24rpx;
	  border-radius: 100rpx;
	}

	.time-icon {
	  width: 24rpx;
	  height: 24rpx;
	  margin-right: 8rpx;
	}

	.time-badge-text {
	  font-size: 22rpx;
	  font-weight: 800;
	  color: var(--text-dark);
	}

	.counter-container {
	  background-color: #FFFFFF;
	  border-radius: 44rpx;
	  padding: 24rpx 36rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 40rpx;
	  box-sizing: border-box;
	}

	.counter-btn-wrapper {
	  width: 80rpx;
	  height: 80rpx;
	  border-radius: 50%;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}

	.btn-minus {
	  background-color: var(--baby-purple-light);
	}

	.btn-plus {
	  background-color: var(--baby-purple);
	}

	.counter-symbol {
	  font-size: 32rpx;
	  font-weight: 900;
	  line-height: 1;
	}

	.btn-minus .counter-symbol { color: var(--baby-purple); }
	.btn-plus .counter-symbol { color: #FFFFFF; }

	.value-display {
	  display: flex;
	  align-items: baseline;
	  justify-content: center;
	}

	.value-input {
	  font-size: 64rpx;
	  font-weight: 900;
	  letter-spacing: -1rpx;
	  width: 180rpx;
	  text-align: center;
	  background: transparent;
	  color: var(--text-dark);
	}

	.value-unit {
	  font-size: 24rpx;
	  font-weight: 800;
	  color: var(--text-gray);
	  margin-left: 8rpx;
	}

	.tags-group-row {
	  display: flex;
	  flex-direction: row;
	  margin-bottom: 40rpx;
	}

	.tag-item {
	  background-color: rgba(255, 255, 255, 0.55);
	  padding: 14rpx 36rpx;
	  border-radius: 100rpx;
	  margin-right: 16rpx;
	  box-sizing: border-box;
	  display: flex;
	  align-items: center;
	}

	.tag-text {
	  font-size: 24rpx;
	  color: var(--text-gray);
	  font-weight: 800;
	}

	.tag-active-milk, .tag-active-sleep, .tag-active-height, .tag-active-vaccine {
	  background-color: #FFFFFF !important;
	  border: 2rpx solid var(--baby-purple);
	}
	.tag-active-poop {
	  background-color: #FFFFFF !important;
	  border: 2rpx solid #A392D8;
	}

	.text-active-milk, .text-active-sleep, .text-active-height, .text-active-vaccine { color: var(--baby-purple) !important; font-weight: 900; }
	.text-active-poop { color: #A392D8 !important; font-weight: 900; }

	.height-fields, .vaccine-fields {
	  display: flex;
	  flex-direction: column;
	  gap: 24rpx;
	  margin-bottom: 40rpx;
	}

	.hf-item {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  background: rgba(255,255,255,0.7);
	  border-radius: 28rpx;
	  padding: 20rpx 28rpx;
	}

	.hf-label {
	  width: 80rpx;
	  font-size: 28rpx;
	  font-weight: 800;
	  color: var(--text-dark);
	}

	.hf-input-row {
	  flex: 1;
	  display: flex;
	  align-items: center;
	  gap: 8rpx;
	}

	.hf-input {
	  flex: 1;
	  height: 56rpx;
	  background: #fff;
	  border-radius: 16rpx;
	  text-align: center;
	  font-size: 30rpx;
	  font-weight: 900;
	  color: var(--text-dark);
	}

	.hf-unit {
	  font-size: 24rpx;
	  font-weight: 700;
	  color: var(--text-gray);
	}

	.hf-prefix, .hf-suffix {
	  font-size: 30rpx;
	  font-weight: 700;
	  color: var(--text-dark);
	  flex-shrink: 0;
	}

	.hf-date {
	  display: flex;
	  align-items: center;
	  font-size: 28rpx;
	  font-weight: 700;
	  color: var(--text-gray);
	}

	.memo-area-box {
	  background-color: rgba(255, 255, 255, 0.65);
	  border-radius: 40rpx;
	  padding: 30rpx 36rpx;
	  box-sizing: border-box;
	}

	.memo-title {
	  font-size: 24rpx;
	  font-weight: 900;
	  color: var(--text-gray);
	}

	.memo-textarea {
	  width: 100%;
	  height: 120rpx;
	  font-size: 24rpx;
	  font-weight: 600;
	  color: var(--text-dark);
	  margin-top: 14rpx;
	  line-height: 1.4;
	}

	.textarea-placeholder {
		color: var(--text-gray);
		font-weight: 600;
		opacity: 0.7;
	}

	/* 保存成功庆祝动画 */
	.success-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(250,249,245,0.85);
		animation: overlayIn 0.2s ease-out;
	}

	@keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }

	.success-circle {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		background: #10B981;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: circlePop 0.4s cubic-bezier(0.34,1.56,0.64,1);
	}

	@keyframes circlePop {
		0% { transform: scale(0) }
		100% { transform: scale(1) }
	}

	.success-check {
		font-size: 72rpx;
		color: #fff;
		font-weight: 700;
		animation: checkDraw 0.3s ease-out 0.15s both;
	}

	@keyframes checkDraw {
		from { opacity: 0; transform: scale(0.5) }
		to { opacity: 1; transform: scale(1) }
	}

	.particle {
		position: fixed;
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		top: 50%; left: 50%;
		animation: particleFly 0.7s ease-out forwards;
	}

	.p1 { background: #8B80F9; animation-delay: 0.1s; }
	.p2 { background: #F59E0B; animation-delay: 0.15s; }
	.p3 { background: #10B981; animation-delay: 0.2s; }
	.p4 { background: #EF4444; animation-delay: 0.12s; }
	.p5 { background: #3B82F6; animation-delay: 0.18s; }
	.p6 { background: #EC4899; animation-delay: 0.22s; }

	@keyframes particleFly {
		0% { transform: translate(0, 0) scale(1); opacity: 1; }
		100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
	}

	.p1 { --dx: -120rpx; --dy: -180rpx; }
	.p2 { --dx: 140rpx; --dy: -140rpx; }
	.p3 { --dx: 100rpx; --dy: 160rpx; }
	.p4 { --dx: -150rpx; --dy: 100rpx; }
	.p5 { --dx: 180rpx; --dy: -60rpx; }
	.p6 { --dx: -90rpx; --dy: 160rpx; }

	/* ==================== 保存按钮 ==================== */
	.save-button {
	  background-color: var(--baby-purple);
	  border-radius: 48rpx;
	  padding: 32rpx 0;
	  display: flex;
	  flex-direction: row;
	  justify-content: center;
	  align-items: center;
	  box-sizing: border-box;
	}

	.shadow-purple {
	  box-shadow: 0 12rpx 32rpx rgba(139, 128, 249, 0.22);
	}

	.save-btn-icon {
	  width: 36rpx;
	  height: 36rpx;
	  margin-right: 12rpx;
	}

	.save-btn-text {
	  font-size: 30rpx;
	  font-weight: 900;
	  color: #FFFFFF;
	}
</style>
