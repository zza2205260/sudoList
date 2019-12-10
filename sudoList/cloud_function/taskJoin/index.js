// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const errorTaskNotExist = [-201, "该习惯已经消失！"]
const errorTaskExist = [-200, "已经加入该习惯了！"]

const nowTs = Date.now()
const joinTask = (taskId, openId) => {
  return db.collection("task_join_user").add({
    data:{
      taskId: taskId,
      _open_id: openId,
      ctime: nowTs,
      mtime: nowTs
    }
  })
}
// 云函数入口函数
exports.main = async(event, context) => {
  const {
    taskId
  } = event;
  const wxContext = cloud.getWXContext()
  let error = null

  let task = await db.collection("task").where({
    _id: taskId
  }).count()
  if (task.total != 0) {
    let joinNum = await db.collection("task_join_user").where({
      taskId: taskId,
      _open_id: wxContext.OPENID
    }).count()
    if (joinNum.total == 0) {
      await joinTask(taskId, wxContext.OPENID)
    } else {
      error = errorTaskExist
    }
  } else {
    error = errorTaskNotExist
  }
  let res = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: error,
      data: {}
    }
  })
  return res.result
}