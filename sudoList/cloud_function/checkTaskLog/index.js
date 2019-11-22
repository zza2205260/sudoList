// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const errorCheck = [-200, '这个作业已经改过了！']
const errorCheckAuth = [-300, '无权监督！']


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    taskLogId,
    userOpenId
  } = event
  let error = null
  const nowTs = Date.now()
  let checkUser = await db.collection("follow").where({
    "followOpenId": userOpenId,
    "isCheckUser": true
  }).get()
  if (checkUser.data.length == 0) {
    error = errorCheckAuth
  }
  if (error == null) {
    let task_log_check = await db.collection('task_log_check').where({
      'taskLogId': taskLogId,
      '_open_id': wxContext.OPENID
    }).get()
    if (task_log_check.data.length == 0) {
      db.collection('task_log_check').add({
        data: {
          _open_id: wxContext.OPENID,
          taskLogId: taskLogId,
          ctime: nowTs,
          mtime: nowTs
        }
      })
      db.collection('task_log').where({
        '_id': taskLogId
      }).update({
        data: {
          'checkNums': _.inc(1)
        }
      })
    } else {
      error = errorCheck
    }
  }
  const res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: {}
    }
  })
  return res.result
}