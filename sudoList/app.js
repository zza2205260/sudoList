//app.js
import {
  constWxVersion
} from "/utils/const.js"

App({
  globalData: {
    "isCheck": true,
    "nickName": ""
  },
  onLaunch: function() {},
  onShow(options) {
    wx.hideTabBar({})
    let type = options.query.type || ""
    wx.cloud.init();
    this.getEnv();
  },
  getUserInfoStorage: function() {
    let userInfo = wx.getStorageSync("user")
    if (userInfo.length > 0) {
      userInfo = JSON.parse(userInfo)
    } else {
      userInfo = null
    }
    return userInfo
  },
  getEnv: function() {
    wx.cloud.callFunction({
      name: "Env",
      data: {}
    }).then(res => {
      if (res.result.version != constWxVersion) {
        this.globalData.isCheck = false
        wx.showTabBar({
        })
      }
      this.getUserInfoForCloud()
    })
  },
  getUserInfoForCloud: function(){
    let userInfo = this.getUserInfoStorage()
    if (userInfo == null || Object.keys(userInfo).length == 0 || userInfo.nickName == "" || userInfo.avatarUrl == "" || userInfo.gender == "") {
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
        wx.navigateTo({
          url: '/pages/getAuth/getAuth',
        })
      })
    } else {
      this.globalData.nickName = userInfo.nickName
    }
  }
})