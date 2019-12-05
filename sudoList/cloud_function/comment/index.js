// 云函数入口文件
const cloud = require('wx-server-sdk')
const TABLE = "comment"
const nowTs = Date.parse(new Date)
cloud.init()
const db = cloud.database()
const _ = db.command

// 获取用户信息
const getUserInfo = (openId) => {
  return db.collection("user_info").where({
    _open_id: openId
  }).get()
}
// 添加打卡日志评论数
const addCommentNums = (taskLogId) => {
  return db.collection("task_log").where({
    _id: taskLogId
  }).update({
    data: {
      commentNums: _.inc(1)
    }
  })
}
const AddComment = async(taskLogId, openId, toOpenId, commentText) => {
  let sendNickName = ""
  let toNickName = ""
  let sendUserInfoPromise = getUserInfo(openId).then(res => {
    sendNickName = res.data[0].nickName || ""
  })
  let toUserInfoPromise = getUserInfo(toOpenId).then(res => {
    toNickName = res.data[0].nickName || ""
  })
  await Promise.all([addCommentNums(taskLogId), sendUserInfoPromise, toUserInfoPromise])

  return db.collection(TABLE).add({
    data: {
      "taskLogId": taskLogId,
      "_open_id": openId,
      "toOpenId": toOpenId,
      "commentText": commentText,
      "sendNickName": sendNickName,
      "toNickName": toNickName,
      "ctime": nowTs,
      "mtime": nowTs
    }
  })
}

const DelComment = (commentId) => {
  return db.collection(TABLE).where({
    "_id": commentId
  }).remove()
}

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    action,
    paramDcit
  } = event
  const wxContext = cloud.getWXContext()
  if (action == "Add") {
    let {
      taskLogId,
      toOpenId,
      commentText
    } = paramDcit
    return await AddComment(taskLogId, wxContext.OPENID, toOpenId, commentText)
  } else {
    let {
      commentId
    } = paramDcit
    return await DelComment(commentId)
  }
}