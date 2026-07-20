/**
 * 触感反馈工具
 * 在支持的设备上触发轻微震动
 */

export function haptic(style = 'light') {
  try {
    if (style === 'medium') uni.vibrateLong()
    else uni.vibrateShort()
  } catch (_) {
    // 不支持的环境静默失败
  }
}
