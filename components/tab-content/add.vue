<template>
	<view class="page">
		<CustomNavbar/>
		<scroll-view class="inner-padding" scroll-y>

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
			    <view class="time-badge">
			      <image class="time-icon" src="/static/icon-time-clock.png" mode="aspectFit"></image>
			      <text class="time-badge-text">{{ currentConfig.timeText }}</text>
			    </view>
			  </view>

			  <view class="counter-container">
			    <view class="counter-btn-wrapper btn-minus" @tap="decrement">
			      <text class="counter-symbol">—</text>
			    </view>
			    <view class="value-display">
			      <text class="value-text">{{ recordValue }}</text>
			      <text class="value-unit" v-if="currentConfig.unit">{{ currentConfig.unit }}</text>
			    </view>
			    <view class="counter-btn-wrapper btn-plus" @tap="increment">
			      <text class="counter-symbol">＋</text>
			    </view>
			  </view>

			  <view class="tags-group-row">
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
</template>

<script>
	import CustomNavbar from "@/components/CustomNavbar.vue"
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
		      recordValue: '120',
		      note: '',
		      saving: false,
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
		  methods: {
		    switchType(typeId) {
		      this.currentType = typeId
		      this.recordValue = this.formConfigs[typeId].defaultVal
		      this.note = ''
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
		        const babyId = uni.getStorageSync('current_baby_id')
		        if (!babyId) {
		          uni.showToast({ title: '请先设置宝宝档案', icon: 'none' })
		          return
		        }
		        const payload = { baby_id: babyId, note: this.note }
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
		              height_cm: +this.recordValue, date: new Date().toISOString().slice(0, 10)
		            })
		            break
		          case 'vaccine':
		            Object.assign(payload, {
		              name: this.recordValue, dose: this.currentConfig.unit,
		              status: this.selectedTag === '已接种' ? 'done' : this.selectedTag === '已预约' ? 'booked' : 'pending'
		            })
		            break
		        }

		        await api.create(payload)
		        uni.showToast({ title: '保存成功', icon: 'success' })
		        this.switchType(this.currentType)
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
		--bg-cream: #FAF9F5;
		--text-dark: #2D283E;
		--text-gray: #8E8A9F;
		--baby-purple: #8B80F9;
		--baby-purple-light: #D1CCFB;
		--card-milk: #EEF0FF;
		--card-poop: #F7E5DE;
		--card-sleep: #E8E5FF;
		--card-height: #EBF4ED;
		--card-vaccine: #FFF6D6;
		--bg-milk: #EEF0FF;
		--bg-poop: #F7E5DE;
		--bg-sleep: #E8E5FF;
		--bg-height: #EBF4ED;
		--bg-vaccine: #FFF6D6;

		min-height: 100vh;
		background-color: var(--bg-cream);
		color: var(--text-dark);
	}

	.inner-padding {
	  padding: 0 44rpx;
	  height: 100%;
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

	.value-text {
	  font-size: 64rpx;
	  font-weight: 900;
	  letter-spacing: -1rpx;
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
