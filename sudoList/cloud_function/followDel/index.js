// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  let error = null;
  const responseData = {}

  const wxContext = cloud.getWXContext()
  let {
    delFollowId
  } = event;
  db.collection('follow').where({
    _open_id: wxContext.OPENID,
    followOpenId: delFollowId
  }).remove();
  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
  return res.result
}