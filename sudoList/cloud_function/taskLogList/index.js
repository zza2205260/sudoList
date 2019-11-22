// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let return_data = {
    taskLogList: []
  }
  let {
    taskId
  } = event;
  let whereData = {
    taskId: taskId
  }
  let open_id = wxContext.OPENID
  whereData._open_id = open_id
  let taskLogList = await db.collection('task_log').where(whereData)
    .orderBy('ctime', 'desc')
    .get()
  let userInfo = await db.collection('user_info').where({
    _open_id: open_id
  }).get()
  taskLogList = taskLogList.data
  if (taskLogList.length > 0) {
    let taskPicList = []
    if (userInfo.data[0].nickName.length > 0) {
      taskLogList.forEach((index) => {
        index.nickName = userInfo.data[0].nickName
        index.avatarUrl = userInfo.data[0].avatarUrl
        index.gender = userInfo.data[0].gender
        taskPicList.push(index.taskLogPic)
      })
    }
  }
  return_data.taskLogList = taskLogList
  return return_data
}