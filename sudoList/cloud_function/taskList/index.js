// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    version
  } = event
  const wxContext = cloud.getWXContext()
  let openId = wxContext.OPENID
  let envData = await db.collection('env').where({
    env: 'check'
  }).get()
  if (version == envData.data[0].version) {
    // openId = 'otMTI5bQF-Yk6f0peT_xhS-khRvA'
    openId = 'otMTI5V_YR2X8SK6yelh_WTc4LZA'
  }
  const responseData = {
    taskList: []
  }
  let error = null;
  let taskList = await db.collection('task')
    .where({
      _open_id: openId
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