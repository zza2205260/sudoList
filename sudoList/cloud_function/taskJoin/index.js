// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const errorTaskExist = [-200, "已经加入该圈子了！"]

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    taskId,
    title
  } = event;
  const wxContext = cloud.getWXContext()
  let error = null
  const nowTs = Date.now()
  let task = await db.collection("task").where({
    _id: taskId,
    _open_id: wxContext.OPENID
  }).get()
  if (task.data.length == 0) {
    db.collection("task").add({
      data: {
        _open_id: wxContext.OPENID,
        title: title,
        ctime: nowTs,
        mtime: nowTs
      }
    })
  } else {
    error = errorTaskExist
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