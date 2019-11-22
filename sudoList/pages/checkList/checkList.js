// pages/checkList/checkList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkUserList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getCheckUserList: function(){
    wx.cloud.callFunction({
      name: "checkUserList",
      data: {}
    }).then((res)=>{
      this.setData({
        checkUserList: res.result.data.checkUserList
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCheckUserList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let uerInfo = JSON.parse(wx.getStorageSync("user"))

    return {
      title: "拜托拜托，监督一下我吧",
      path: "/pages/becomeCheckUser/becomeCheckUser?open_id="+userInfo._open_id
    }
  }
})