/**
 * 全局状态管理
 */
import { reactive } from 'vue'

export const store = reactive({
  babyId: uni.getStorageSync('current_baby_id') || null,
  baby: null,

  setBabyId(id) {
    if (id) {
      this.babyId = id
      uni.setStorageSync('current_baby_id', id)
    }
  },

  setBaby(baby) {
    this.baby = baby
  }
})
