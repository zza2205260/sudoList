// pages/mlist/mlist.js
import { constWxVersion} from '../../utils/const.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskListData: [],
    scrollHeight: 0,
    addTaskClickF: null,
    addTaskButtonShow: !getApp().globalData.isCheck
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let taskAdd = ()=>{
      wx.navigateTo({
        url: '/pages/addTask/addTask',
      })
    }
    this.setData({
      addTaskClickF: taskAdd
    })
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      scrollHeight: systemInfo.windowHeight
    })
  },
  bindGetUserInfo(e) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTaskList();
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

  },
  getTaskList: function () {
    /**
     * 获取习惯列表方法
     */
    wx.cloud.callFunction({
      name: 'taskList',
      data: {
        version: constWxVersion
      },
      success: (res) => {
        this.setData({
          taskListData: res.result.data.taskList
        })
      }
    })
  },
  addTaskClick: function () {
    /**
     * 跳转添加习惯页面
     */
    wx.navigateTo({
      url: '/pages/addTask/addTask',
    })
  },
  taskItemClick: function(e){
    /**
     * 任务列表Item点击
     */
    let taskItem = e.target.dataset['item']
    let taskId = taskItem['_id']
    wx.navigateTo({
      url: '/pages/taskDetail/taskDetail?taskId='+taskId,
    })
  },
  taskAdd: function(e){
    console.log("组件外部")
  }
})