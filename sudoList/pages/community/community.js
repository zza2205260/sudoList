// pages/community/community.js
import { getDay } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [{
      title: "我的关注",
      id: 0,
      isClick: 1
    }],
    taskLogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getFollowList: function(page){
    wx.cloud.callFunction({
      name: "followTaskLogList",
      data: {
        page: page
      }
    }).then(res=>{
      let taskLogList = res.result.data
      taskLogList.forEach((item) => {
        item.ctime = getDay(new Date(item.ctime))
      })
      this.setData({
        taskLogList: taskLogList
      })
    })
  },
  getTaskList: function(){
    wx.cloud.callFunction({
      name: "taskList",
      data:{}
    }).then(res=>{
      let taskList = res.result.data.taskList;
      let cateList = [{
        title: "我的关注",
        id: 0,
        isClick: 1
      }]
      taskList.forEach(item=>{
        cateList.push({
          title: item.title,
          id: item._id,
          isClick: 0
        })
      })
      this.setData({
        cateList: cateList
      })
    })
  },
  getTaskLogList: function(taskId, page){
    wx.cloud.callFunction({
      name: "taskLogListComunity",
      data: {
        taskId: taskId,
        page: page
      }
    }).then(res=>{
      let taskLogList = res.result.data
      taskLogList.forEach((item) => {
        item.ctime = getDay(new Date(item.ctime))
      })
      this.setData({
        taskLogList: taskLogList
      })
    })
  },
  cateClick: function(e){
    let selectItem = e.currentTarget.dataset.item
    let selectIndex = e.currentTarget.dataset.index
    let cateList = this.data.cateList
    if (selectIndex == 0){

    }else{
      this.getTaskLogList(selectItem.id, 0)
    }
    cateList.forEach((item, index)=>{
      if (index == selectIndex){
        item.isClick = 1
      }else{
        item.isClick = 0
      }
    })
    this.setData({
      cateList: cateList
    })
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
    this.getFollowList(0)
    this.getTaskList()
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

  }
})