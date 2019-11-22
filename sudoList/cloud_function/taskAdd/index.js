// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const responseData = {
    data: {}
  }
  let error = null;
  let nowTs = Date.parse(new Date())
  let data = await db.collection('task').add({
    data: {
      _open_id: wxContext.OPENID,
      title: event.title,
      ctime: nowTs,
      mtime: nowTs
    }
  })
  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
  return res.result
}