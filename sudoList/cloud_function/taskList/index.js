// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const responseData = {
    taskList: []
  }
  let error = null;
  let taskList = await db.collection('task')
    .where({
      _open_id: wxContext.OPENID
    })
    .orderBy('ctime', 'asc').get()
  responseData.taskList = taskList.data;

  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
  return res.result
}