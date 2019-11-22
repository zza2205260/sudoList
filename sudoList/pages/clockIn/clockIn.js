// pages/clockIn/clockIn.js

import {
  constDataSubMsg
} from "../../utils/const.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    files: [],
    error: '',
    taskTitle: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      taskId: options.taskId,
      taskTitle: options.taskTitle
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
  onShow: function() {},
  bindFormSubmit: function(e) {
    let taskLogContent = e.detail.value.textarea
    let open_id = wx.getStorageSync("open_id")
    let ts = Date.now();
    let cloudPath = this.data.taskId + '/' + open_id + '_' + ts + '.png';
    console.log(cloudPath)
    if (taskLogContent.length != 0 && this.data.files.length != 0) {
      wx.requestSubscribeMessage({
        tmplIds: [constDataSubMsg.clockInMsgId],
        success(res) {}
      })
      let picUrl = this.data.files[0].url
      wx.cloud.uploadFile({
        cloudPath: this.data.taskId + '/' + open_id + '_' + ts + '.png',
        filePath: picUrl
      }).then(res => {
        wx.cloud.callFunction({
          name: 'taskLogAdd',
          data: {
            taskId: this.data.taskId,
            taskLogPic: res.fileID,
            taskLogTitle: taskLogContent,
            taskTitle: this.data.taskTitle
          }
        }).then(res => {
          if (res.result.errorMsg != "ok"){
            this.setData({
              error: res.result.errorMsg
            })
          }else{
            wx.navigateBack({})
          }
        }).catch(error => {
          this.setData({
            error: '交作业失败！'
          })
        })

      }).catch(error => {
        this.setData({
          error: '图片上传失败'
        })
      })
    } else {
      this.setData({
        error: '文字和图片都必须上传，不能偷懒！'
      })
    }

  },
  selectFile: function(e) {
    let f = this.data.files;
    f.push({
      url: e.tempFilePaths[0]
    })
    console.log(f)
    this.setData({
      files: f
    })
    console.log(this.data.files)
    return true
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