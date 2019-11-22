// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let nowTs = Date.parse(new Date());
  let loginInfo = await db.collection('user_info').where({
    _open_id: wxContext.OPENID
  }).get()
  if (loginInfo.data.length == 0) {
    await db.collection('user_info').add({
      data: {
        _open_id: wxContext.OPENID,
        ctime: nowTs,
        mtime: nowTs
      }
    })
    loginInfo.data[0] = {
      _open_id: wxContext.OPENID
    }
  }
  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: null,
      data: {
        'loginInfo': loginInfo.data[0]
      }
    }
  })
  return res.result
}