// component/userInfo/userInfo.js
import {UserInfoModel} from "../../model/UserInfo.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
    userInfoViewData: {
      type: UserInfoModel,
      value: null
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  observers:{
    'userInfo': function(user){
      this.setData({
        userInfoViewData: new UserInfoModel(user)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    followClick: function () {
      if (this.data.userInfoViewData.isFollowed) {
        wx.cloud.callFunction({
          name: "followDel",
          data: {
            delFollowId: this.data.userInfoViewData.open_id
          }
        }).then(res => {
          let userInfoViewData = this.data.userInfoViewData
          userInfoViewData.setIsFollowed(false)
          this.setData({
            userInfoViewData: userInfoViewData
          })
        })
      } else {
        wx.cloud.callFunction({
          name: "followAdd",
          data: {
            followOpenId: this.data.userInfoViewData.open_id,
            isCheckUser: false
          }
        }).then(res => {
          let userInfoViewData = this.data.userInfoViewData
          userInfoViewData.setIsFollowed(true)
          this.setData({
            userInfoViewData: userInfoViewData
          })
        })
      }
    }
  }
})
