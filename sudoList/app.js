//app.js
App({
  onLaunch: function() {},
  onShow() {
    wx.cloud.init();
    let userInfo = this.getUserInfoStorage()
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
        wx.setStorageSync("user", JSON.stringify(userInfoData))
      })
    }


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