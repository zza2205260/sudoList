// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let userInfo = event.userInfo.data;
  const nowTs = Date.parse(new Date())
  await db.collection('user_info').where({
      _open_id: wxContext.OPENID
    })
    .update({
      data: {
        avatarUrl: userInfo.avatarUrl,
        city: userInfo.city,
        country: userInfo.country,
        gender: userInfo.gender,
        nickName: userInfo.nickName,
        province: userInfo.province,
        mtime: nowTs
      }
    })
  return cloud.callFunction({
    name: 'comReturn',
    data: {
      error: null,
      data: {
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        nickName: userInfo.nickName
      }
    }
  })
}