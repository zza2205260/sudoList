// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const yesterdayZeroTs = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 - 86400
  const taskLogList = await db.collection("task_log").where({
    checkNums: 0,
    zeroTs: yesterdayZeroTs
  }).get()
  for (let index in taskLogList.data) {
    let taskLog = taskLogList.data[index]
    let open_id = taskLog._open_id
    let taskTitle = taskLog.taskTitle
    const result = await cloud.openapi.subscribeMessage.send({
      touser: open_id,
      page: "/pages/community/community",
      data: {
        thing1: {
          value: taskTitle
        },
        thing4: {
          value: "快点让人监督，不然会有麻烦！"
        },
        number3: {
          value: taskLog.continuedNums
        }
      },
      templateId: "vz7kPxQBFeQxZ5RZOr55Y3dSDtoRhPAT9TelQS1fkbk"
    })
    console.log(result)

  }
  return {}
}