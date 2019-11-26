// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const envData = await db.collection("env").where({
    "env": "check"
  }).get()
  return {
    "version": envData.data[0].version
  }
}