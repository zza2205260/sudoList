//app.js
import {constWxVersion} from "/utils/const.js"

App({
  globalData: {
    "isCheck": false,
    "nickName": ""
  },
  onLaunch: function() {},
  onShow() {
    wx.cloud.init();
    let userInfo = this.getUserInfoStorage()
    this.globalData.nickName = userInfo.nickName
    if (userInfo == null || userInfo.nickName == "" || userInfo.avatarUrl == "" || userInfo.gender == "") {
      wx.cloud.callFunction({
        name: "userLogin",
        data: {}
      }).then(res => {
        let userInfoData = {
          _open_id: "",
          nickName: "",
          avatarUrl: "",
          gender: ""
        }
        userInfoData = { ...userInfoData,
          ...res.result.data.loginInfo
        }
        this.globalData.nickName = userInfoData.nickName
        wx.setStorageSync("user", JSON.stringify(userInfoData))
      })
    }
    wx.cloud.callFunction({
      name: "Env",
      data: {}  
    }).then(res=>{
      if (res.result.version == constWxVersion){
        this.globalData.isCheck = true
      }
    })

  },
  getUserInfoStorage: function() {
    let userInfo = wx.getStorageSync("user")
    if (userInfo.length > 0) {
      userInfo = JSON.parse(userInfo)
    } else {
      userInfo = null
    }
    return userInfo
  }
})