// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command

// 获取打卡评论列表
const getTaskLogListCommentList = (taskLogId) => {
  return db.collection("comment").where({
    taskLogId: taskLogId
  }).orderBy("ctime", "desc").get()
}
// 获取用户信息
const getUserInfo = (open_id) => {
  return db.collection("user_info").where({
    _open_id: open_id
  }).get()
}


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
  let followUserIdList = followList.data.map(item => {
    return item.followOpenId
  })
  // 获取所有关注用户最新日志列表
  let taskLogList = await db.collection("task_log").where({
    _open_id: _.in(followUserIdList)
  }).orderBy('ctime', 'desc').skip(page).limit(60).get()
  responseData.taskLogList = taskLogList.data

  let userAndCommnetPromiseList = responseData.taskLogList.map(item => {
    let getUserInfoPromise = getUserInfo(item._open_id).then(res => {
      item.nickName = res.data[0].nickName
      item.avatarUrl = res.data[0].avatarUrl
      item.gender = res.data[0].gender
    })
    let getTaskLogListCommentListPromise = getTaskLogListCommentList(item.taskLogId).then(res => {
      item.commentList = res.data
    })

    return Promise.all(getUserInfoPromise, getTaskLogListCommentListPromise)
  })
  await Promise.all(userAndCommnetPromiseList)
  let res = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: responseData.error,
      data: responseData.taskLogList
    }
  })
  return res.result
}