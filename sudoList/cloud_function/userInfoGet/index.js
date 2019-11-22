// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    open_id
  } = event
  const responseData = {
    userInfo: {}
  }
  // 获取用户基本信息
  let getUserInfo = db.collection("user_info").where({
    _open_id: open_id
  }).get().then(res => {
    responseData.userInfo = { ...responseData.userInfo,
      ...res.data[0]
    }
  })
  // 获取关注数量
  let getFollowCount = db.collection("follow").where({
    _oepn_id: open_id
  }).count().then(res => {
    responseData.userInfo.followNums = res.total
  })
  // 获取粉丝数量
  let getFansCount = db.collection("follow").where({
    followOpenId: open_id
  }).count().then(res => {
    responseData.userInfo.fansNums = res.total
    return res.total
  })
  // 判断是否关注
  let isFollowed = db.collection("follow").where({
    _open_id: wxContext.OPENID,
    followOpenId: open_id
  }).count().then(res =>{
    if(res.total > 0){
      responseData.userInfo.isFollowed = true
    }else{
      responseData.userInfo.isFollowed = false
    }
  })

  await Promise.all([getUserInfo, getFollowCount, getFansCount, isFollowed])
  let res = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: null,
      data: responseData.userInfo
    }
  })


  return res.result
}