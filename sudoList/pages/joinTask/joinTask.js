// pages/joinTask/joinTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: "",
    taskInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      taskId: options.taskId
    })

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
    this.getTaskDetail()
  },
  getTaskDetail: function() {
    wx.cloud.callFunction({
      name: "taskGet",
      data: {
        taskId: this.data.taskId
      }
    }).then(res => {
      this.setData({
        taskInfo: res.result.data.task
      })
      wx.setNavigationBarTitle({
        title: res.result.data.task.title,
      })
    })
  },

  joinClick: function() {
    wx.cloud.callFunction({
      name: "taskJoin",
      data: {
        taskId: this.data.taskId,
        title: this.data.taskInfo.title
      }
    }).then(res => {
      if (res.result.errorMsg != "ok") {
        wx.showToast({
          title: res.result.errorMsg,
          icon: "none"
        })
      } else {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
  /
  onHide: function () {

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
    let taskInfo = this.data.taskInfo;
    let taskId = this.data.taskId;
    return {
      title: `一起加入#${taskInfo.title}#，一起交作业！！`,
      path: `/pages/joinTask/joinTask?taskId=${taskId}&type=share`
    }
  }
})