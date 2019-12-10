// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const getTaskNum = (taskId) =>{
  return db.collection("task_join_user").where({
    taskId: taskId
  }).count()
}

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
    let taskNums = await getTaskNum(event.taskId)
    responseData.task.joinNums = taskNums.total
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