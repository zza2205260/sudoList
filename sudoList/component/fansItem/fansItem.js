// component/fansItem/fansItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: {
      type: Array,
      value: []
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
    removeCheckUser: function(e){
      let userItem = e.currentTarget.dataset.item;
      let index = e.currentTarget.dataset.index;
      let data_list = this.data.dataList;
      wx.cloud.callFunction({
        name: "followDel",
        data: {
          followOpenId: userItem.followOpenId
        }
      }).then(res=>{
        console.log(res)
        if (res.result.errorMsg == 'ok'){
          data_list.splice(index, 1)
          this.setData({
            dataList: data_list
          })
          wx.showToast({
            title: '解除成功'
          })
        }else{
          wx.showToast({
            title: res.result.errorMsg,
            icon: "none"
          })
        }
      })
    }
  }
})
