// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  let {
    page
  } = event;
  const responseData = {
    error: null,
    taskLogList: []
  }

  const wxContext = cloud.getWXContext()
  // 获取关注列表
  let followList = await db.collection("follow").where({
    _open_id: wxContext.OPENID
  }).get()
  let followUserIdList = []
  followList.data.forEach(item => {
    followUserIdList.push(item.followOpenId)
  })
  // 获取所有关注用户最新日志列表
  let taskLogList = await db.collection("task_log").where({
    _open_id: _.in(followUserIdList)
  }).orderBy('ctime', 'desc').skip(page).limit(60).get()
  responseData.taskLogList = taskLogList.data
  let getUserInfoArray = []
  for (let i = 0; i < responseData.taskLogList.length; i++) {
    let a = db.collection("user_info").where({
      _open_id: responseData.taskLogList[i]._open_id
    }).get().then(res => {
      responseData.taskLogList[i].nickName = res.data[0].nickName
      responseData.taskLogList[i].avatarUrl = res.data[0].avatarUrl
      responseData.taskLogList[i].gender = res.data[0].gender
    })
    getUserInfoArray.push(a)
  }
  await Promise.all(getUserInfoArray).then(res=>{
    console.log(res)
  })
  let res = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: responseData.error,
      data: responseData.taskLogList
    }
  })

  return res.result
}