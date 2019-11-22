// pages/taskDetail/taskDetail.js
import { getDay } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    taskDetail: {},
    scrollHeight: 0,
    taskLogList: []
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
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      scrollHeight: systemInfo.windowHeight
    })
    this.getTaskDetails();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTaskLogList();
  },
  clockIn: function() {
    wx.navigateTo({
      url: '/pages/clockIn/clockIn?taskId=' + this.data.taskId + '&taskTitle='+ this.data.taskDetail.title,
    })
  },
  getTaskLogList: function() {
    wx.cloud.callFunction({
      name: 'taskLogList',
      data: {
        taskId: this.data.taskId,
        open_id: ""
      }
    }).then(res => {
      let taskLogList = res.result.taskLogList
      taskLogList.forEach((item)=>{
        item.ctime = getDay(new Date(item.ctime)) 
      })
      this.setData({
        taskLogList: taskLogList
      })
    }).catch(error => {
      console.log(error)
    })
  },
  getTaskDetails: function() {
    wx.cloud.callFunction({
      name: 'taskGet',
      data: {
        taskId: this.data.taskId
      },
      success: (res) => {
        let task = res.result.data.task
        wx.setNavigationBarTitle({
          title: task.title
        })
        this.setData({
          taskDetail: task
        })
      }
    })
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

  }
})