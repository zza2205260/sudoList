// pages/getAuth/getAuth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  authClick: function(e) {
    /**
     * 用户授权并获取用户基本信息
     */
    let cloudID = e.detail.cloudID
    wx.cloud.callFunction({
      name: 'userAdd',
      data: {
        userInfo: wx.cloud.CloudID(cloudID)
      }
    }).then(res => {
      let userInfo = { ...res.result.data
      }
      this._setUserInfoStorage(userInfo)
      wx.showToast({
        title: '授权成功',
      })
      wx.navigateBack({
        complete: (res) => {},
      })
    })

  },
  _getUserInfoStorage: function() {
    /**
     * 查看本地是否存在userInfo
     */
    let userInfo = JSON.parse(wx.getStorageSync("user"))
    if (userInfo.nickName == "" || userInfo.avatarUrl == "" || userInfo.gender == "") {
      return false
    } else {
      return true
    }
  },
  _setUserInfoStorage: function(userInfo) {
    /**
     * 本地存在userInfo
     */
    wx.setStorageSync("user", JSON.stringify(userInfo))
  }
})