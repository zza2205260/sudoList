// component/comButton/comButton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnTitle: {
      type: String,
      value: ""
    },
    clickFunc: {
      type: Function,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    click: function(e) {
      if (this._getUserInfoStorage()) {
        this.data.clickFunc();
      } else {
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
          let userInfo = {...res.result.data}
          this._setUserInfoStorage(userInfo)
        })
      }
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
    _setUserInfoStorage: function(userInfo){
      /**
       * 本地存在userInfo
       */
      wx.setStorageSync("user", JSON.stringify(userInfo))
    }
  }
})