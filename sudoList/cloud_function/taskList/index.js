// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const getHotTask = async() => {
  let hotList = await db.collection("task_join_user").aggregate().sortByCount('$taskId').end()
  let taskList = []
  let promiseList = hotList.list.map(item => {
    return getTask(item._id).then(res => {
      let tempTask = res.data[0]
      tempTask.count = item.count * 1000
      taskList.push(tempTask)
    })
  })
  await Promise.all(promiseList)
  return taskList
}
const getTask = (taskId) => {
  return db.collection("task").where({
    _id: taskId
  }).get()
}
const getUserTask = (openId) => {
  return db.collection("task").where({
    _open_id: openId
  }).orderBy('ctime', 'asc').get()
}


// 云函数入口函数
exports.main = async(event, context) => {
  const {
    version,
    type
  } = event
  const wxContext = cloud.getWXContext()
  let openId = wxContext.OPENID
  let envData = await db.collection('env').where({
    env: 'check'
  }).get()
  if (version == envData.data[0].version) {
    // openId = 'otMTI5bQF-Yk6f0peT_xhS-khRvA'
    openId = 'o83qX5JCrgDpDDF6COVkTig6RWIs'
  }
  const responseData = {
    taskList: []
  }
  let error = null;
  let taskList = null;
  if (type == 'HOT') {
    taskList = await getHotTask()
    responseData.taskList = taskList
  } else {
    taskList = await getUserTask(openId)
    responseData.taskList = taskList.data;
  }

  let res = await cloud.callFunction({
    name: 'comReturn',
    data: {
      error: error,
      data: responseData
    }
  })
  return res.result
}