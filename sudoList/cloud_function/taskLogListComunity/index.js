// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command


// 获取打卡评论列表
const getTaskLogListCommentList = async (taskLogId) => {
  return db.collection("comment").where({
    taskLogId: taskLogId
  }).orderBy("ctime", "asc").get()
}


// 云函数入口函数
exports.main = async(event, context) => {
  const {
    taskId,
    page
  } = event;
  let taskLogList = await db.collection("task_log").where({
    taskId: taskId
  }).orderBy('ctime', 'desc').skip(page).limit(60).get()
  let userIdList = taskLogList.data.map(item => {
    return item._open_id
  })
  let userInfoList = await db.collection("user_info").where({
    _open_id: _.in(userIdList)
  }).get()
  let userMap = {}
  userInfoList.data.forEach(item => {
    userMap[item._open_id] = item
  })
  taskLogList.data.forEach(item => {
    let userInfo = userMap[item._open_id]
    item.nickName = userInfo.nickName
    item.avatarUrl = userInfo.avatarUrl
    item.gender = userInfo.gender
  })
  let promiseList = taskLogList.data.map(item=>{
    return getTaskLogListCommentList(item._id).then(res=>{
      item.commentList = res.data
    })
  })
  await Promise.all(promiseList)
  let returnData = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: null,
      data: taskLogList.data
    }
  })
  return returnData.result
}