// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * -100 参数错误
 * -200 业务逻辑错误
 * 
 */


// 云函数入口函数
exports.main = async(event, context) => {
  const responseData = {
    code: 0,
    errorMsg: 'ok',
    data: {}
  }

  let {
    error,
    data
  } = event
  if (error == null) {
    responseData.data = data
  } else {
    responseData.code = error[0]
    responseData.errorMsg = error[1]
  }

  return responseData
}