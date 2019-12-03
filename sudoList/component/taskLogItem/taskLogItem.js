// component/taskLogItem/taskLogItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskLogList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    praiseUrl: '/imgs/icon_likegood.png',
    taskLogListFix: [],
    galleryIsShow: false,
    galleryUrl: [],
    galleryDelete: false,
    showActionsheet: false,
    actions: [{
        text: '监督他',
        value: '1'
      },
      {
        text: '转发',
        value: '2'
      }
    ],
    action_select_data: {}
  },
  observers: {
    'taskLogList': function (user) {
      user.forEach(item => {
        if (item.isPraise){
          item.praiseUrl = '/imgs/icon_likegood-2.png'
          item.praiseTextColor = "color: #b2b2b2;"
        }else{
          item.praiseUrl = '/imgs/icon_likegood.png'
          item.praiseTextColor = "color: #b2b2b2;"
        }
      })

      this.setData({
        taskLogListFix: user
      })
    }
  },
  /**
   * 组件的方法列表
   */

  methods: {
    praiseClick: function(e) {
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      wx.cloud.callFunction({
        name: "praise",
        data: {
          "taskLogId": item._id,
          "action": "Add"
        }
      }).then(res=>{
        if (res.result.isRefresh){
          let tempTaskLogList = this.data.taskLogListFix
          tempTaskLogList[index].praiseNums += 1
          tempTaskLogList[index].praiseUrl = '/imgs/icon_likegood-2.png'
          this.setData({
            taskLogListFix: tempTaskLogList
          })
        }
      })
    },
    actionClick: function(e) {
      let item = e.currentTarget.dataset.item;
      this.setData({
        showActionsheet: true,
        action_select_data: item
      })
    },
    imgClick: function(e) {
      let url = e.currentTarget.dataset.url;
      this.setData({
        galleryIsShow: true,
        galleryUrl: [url]
      })
    },
    actionSheetBtnClick: function(e) {
      let value = e.detail.value;
      if (value == '1') {
        const taskLogId = this.data.action_select_data._id
        wx.cloud.callFunction({
          name: "checkTaskLog",
          data: {
            taskLogId: taskLogId
          }
        }).then(res => {
          let message = "监督完成!"
          if (res.result.errorMsg != "ok") {
            message = res.result.errorMsg
          }
          wx.showToast({
            icon: 'none',
            title: message
          })
        })
      } else if (value == '2') {

      }

      this.setData({
        showActionsheet: false
      })
    },
    taskTitleClick: function(e) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: "/pages/joinTask/joinTask?taskId="+item.taskId,
      })
    },
    avatarClick: function(e) {
      let item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/pages/userHome/userHome?open_id=' + item._open_id,
      })
    }
  }
})