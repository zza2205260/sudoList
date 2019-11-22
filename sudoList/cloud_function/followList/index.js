// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const responseData = {
    followList: []
  }
  let error = null;

  let followList = await db.collection('follow').where({
    _open_id: wxContext.OPENID
  }).get()
  responseData.followList = followList.data
  return cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
}