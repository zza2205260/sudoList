// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const nowTs = Date.parse(new Date())
const _ = db.command

const AddPraise = async (taskLogId, open_id) => {
  let praiseInfo = await db.collection("praise").where({
    "_open_id": open_id,
    "taskLogId": taskLogId
  }).count()
  if (praiseInfo.total == 0) {
    await db.collection("praise").add({
      data: {
        _open_id: open_id,
        taskLogId: taskLogId,
        ctime: nowTs,
        mtime: nowTs
      }
    })
    await db.collection("task_log").where({
      "_id": taskLogId
    }).update({
      data: {
        "praiseNums": _.inc(1)
      }
    })
    return true
  }
  return false
}


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    action,
    taskLogId
  } = event
  console.log("xxxx", taskLogId)
  let isRefresh = false
  if (action == "Add") {
    isRefresh = await AddPraise(taskLogId, wxContext.OPENID)
  }
  return {
    "isRefresh": isRefresh
  }
}