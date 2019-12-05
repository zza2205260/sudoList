// 云函数入口文件
const cloud = require('wx-server-sdk')
const TABLE = "comment"
const nowTs = Date.parse(new Date)
cloud.init()
const db = cloud.database()


const AddComment = (taskLogId, openId, toOpenId, commentText) => {
  return db.collection(TABLE).add({
    data: {
      "taskLogId": taskLogId,
      "_open_id": openId,
      "toOpenId": toOpenId,
      "commentText": commentText,
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
  if(action == "Add"){
    let {taskLogId, toOpenId, commentText} = paramDcit
    return await AddComment(taskLogId, wxContext.OPENID, toOpenId, commentText)
  }else{
    let {commentId} = paramDcit
    return await DelComment(commentId)
  }
}