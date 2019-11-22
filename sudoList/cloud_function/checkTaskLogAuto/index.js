// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const zeroTs = new Date(new Date().setHours(0, 0, 0, 0)) / 1000

  let taskLogList = await db.collection("task_log").where({
    checkNums: 0
  }).get()
  idList = []
  taskLogList.data.forEach(item=>{
    if (zeroTs - item.zeroTs >= 2 * 86400) {
      idList.push(item._id)
    }
  })
  await db.collection("task_log").where({
    _id: _.in(idList)
  }).remove()
  return {}
}