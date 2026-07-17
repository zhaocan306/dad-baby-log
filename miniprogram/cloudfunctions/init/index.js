// 云函数：初始化示例数据
// 部署后调用一次，创建初始家庭和宝宝

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  // 创建家庭
  const familyRes = await db.collection('families').add({
    data: { name: '我的家庭', created_at: db.serverDate() }
  })
  const familyId = familyRes._id

  // 添加成员（自己）
  await db.collection('members').add({
    data: {
      family_id: familyId, user_id: OPENID,
      role: 'owner', created_at: db.serverDate()
    }
  })

  // 创建默认宝宝
  const babyRes = await db.collection('babies').add({
    data: {
      family_id: familyId, name: '小鲸鱼',
      gender: 'female', birthday: '2026-06-10',
      created_at: db.serverDate()
    }
  })

  return { familyId, babyId: babyRes._id }
}
