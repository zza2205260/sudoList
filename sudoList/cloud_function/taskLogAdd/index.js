// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


const errorTaskLogExist = [-200, '今天已经交过作业了！']
const errorTaskLogYestodayNotExist = [-201, "昨天的作业都没有交，今天就别想了嗷！"]
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const nowTs = Date.parse(new Date())
  const zeroTs = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
  let {
    taskId,
    taskLogPic,
    taskLogTitle,
    taskTitle
  } = event;
  let error = null
  const responseData = {
    taskLog: {}
  }
  // 判断今天是否已经有过数据
  let taskLogInfo = await db.collection('task_log').where({
    zeroTs: zeroTs,
    _open_id: wxContext.OPENID,
    taskId: taskId
  }).count()
  if (taskLogInfo.total != 0) {
    error = errorTaskLogExist
  }
  // 判断昨天是否已经打卡过了
  // let yestodayTaskLogInfo = await db.collection("task_log").where({
  //   zeroTs: zeroTs - 86400,
  //   _open_id: wxContext.OPENID,
  //   taskId: taskId
  // }).count()
  // if (yestodayTaskLogInfo.total == 0){
  //   error = errorTaskLogYestodayNotExist
  // }
  if (error == null) {
    let taskLogNums = await db.collection('task_log').where({
      _open_id: wxContext.OPENID,
      taskId: taskId
    }).count()
    let taskLogAttr = {
      _open_id: wxContext.OPENID,
      taskId: taskId,
      taskLogPic: taskLogPic,
      taskLogTitle: taskLogTitle,
      zeroTs: zeroTs,
      ctime: nowTs,
      mtime: nowTs,
      continuedNums: taskLogNums.total + 1 ,
      praiseNums: 0,
      commentNums: 0,
      checkNums: 0,
      taskTitle: taskTitle
    }
    await db.collection('task_log').add({
      data: taskLogAttr
    })
  }
  let res = await cloud.callFunction({
    name: 'comReturn',
    data : {
      error: error,
      data: responseData
    }
  })
  return res.result
}