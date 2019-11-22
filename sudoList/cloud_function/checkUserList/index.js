// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const responseData = {
    checkUserList: []
  }
  let checkUserList = await db.collection('follow').where({
    _open_id: wxContext.OPENID,
    isCheckUser: true
  }).get()
  responseData.checkUserList = checkUserList.data

  // 获取审核人的详细资料
  for(let i=0;i<responseData.checkUserList.length;i++){
    let userInfo = await db.collection("user_info").where({
      _open_id: responseData.checkUserList[i].followOpenId
    }).get()
    responseData.checkUserList[i].nickName = userInfo.data[0].nickName
    responseData.checkUserList[i].avatarUrl = userInfo.data[0].avatarUrl
  }
  
  let res = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: null,
      data: responseData
    }
  })
  return res.result
}