// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command
const userTable = "user_info"
const taskTable = "task"

const searchName = async(name) => {
  return db.collection(userTable).where({
    nickName: name
  }).get()
}

const searchTask = async(taskName) => {
  return db.collection(taskName).where({
    title: taskName
  }).get()
}

// 云函数入口函数
exports.main = async(event, context) => {
  let {
    action,
    searchContent
  } = event
  let res = null;
  if (action == "searchName") {
    res = await searchName(searchContent)
  } else if (action == "searchTask") {
    res = await searchTask(searchContent)
  }

  let returnRes = await cloud.callFunction({
    name: "comReturn",
    data: {
      error: null,
      data: {
        searchResult: res.data
      }
    }
  })
  return returnRes.result
}