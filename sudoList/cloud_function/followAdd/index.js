// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

const errorNotAddFollowSelf = [-200, '不能关注自己']
const errorHadFollow = [-200, '该用户已经关注']


const checkIsFollow = async(openId, followOpenId) => {
  /**
   * 检查是否关注过
   */
  let followData = await db.collection('follow').where({
    _open_id: openId,
    followOpenId: followOpenId
  }).get()
  if (followData.data.length > 0) {
    return true
  } else {
    return false
  }
}


// 云函数入口函数
exports.main = async(event, context) => {
  let error = null;
  let responseData = {}
  const wxContext = cloud.getWXContext()
  let {
    followOpenId,
    isCheckUser
  } = event;
  let nowTs = Date.now();
  // if (followOpenId == wxContext.OPENID) {
  //   error = errorNotAddFollowSelf
  // }
  if (await checkIsFollow(wxContext.OPENID, followOpenId)) {
    if (isCheckUser){
      db.collection("follow").where({
        _open_id: wxContext.OPENID,
        followOpenId: followOpenId
      }).update({
        data: {
          isCheckUser: isCheckUser
        }
      })
    }else{
      error = errorHadFollow
    }
  }
  if (error == null) {
    db.collection('follow').add({
      data: {
        _open_id: wxContext.OPENID,
        followOpenId: followOpenId,
        ctime: nowTs,
        mtime: nowTs,
        isCheckUser: isCheckUser
      }
    })
  }
  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  });
  return res.result
}