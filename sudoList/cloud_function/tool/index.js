// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()



const fixTaskData = async() => {
  let taskList = await db.collection("task").skip(0).limit(100).get()
  for (i in taskList.data){
    await db.collection("task_join_user").add({
      data: {
        taskId: taskList.data[i]._id,
        _open_id: taskList.data[i]._open_id,
        ctime: taskList.data[i].ctime,
        mtime: taskList.data[i].mtime
      }
    })
  }
  return 0
}

const delAllTaskJoinUser = async ()=>{
  let taskJoinUserkList = await db.collection("task_join_user").skip(0).limit(100).get()
  for(i in taskJoinUserkList.data){
    await db.collection("task_join_user").where({
      _id: taskJoinUserkList.data[i]._id
    }).remove()
  }
  return 0
}



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  await fixTaskData()
  // await delAllTaskJoinUser()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}