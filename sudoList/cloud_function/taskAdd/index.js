// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const nowTs = Date.parse(new Date())

const addTaskUserJoin = (taskId, openId) => {
  return db.collection("task_join_user").add({
    data: {
      taskId: taskId,
      _open_id: openId,
      ctime: nowTs,
      mtime: nowTs
    }
  })
}



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const responseData = {
    data: {}
  }
  let error = null;

  let data = await db.collection('task').add({
    data: {
      _open_id: wxContext.OPENID,
      title: event.title,
      ctime: nowTs,
      mtime: nowTs
    }
  })
  await addTaskUserJoin(data._id, wxContext.OPENID)
  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
  return res.result
}