// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const responseData = {
    task: {}
  }
  let error = null
  let taskDetails = await db.collection('task').where({
    _id: event.taskId
  })
  .get()
  if(taskDetails.data.length != 0){
    responseData.task = taskDetails.data[0]
    responseData.task.joinNums = taskDetails.data.length
  }
  const res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
  return res.result
}