// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      search: this.search.bind(this)
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

  },
  selectResult: function(e) {
    console.log('select result', e.detail)
  },
  search: function(value) {
    console.log(value)
    return wx.cloud.callFunction({
      name: "search",
      data: {
        action: "searchName",
        searchContent: value
      }
    }).then(res => {
      let searchResult = []
      if (res.result.data.searchResult.length > 0){
        searchResult = res.result.data.searchResult.map(item=>{
          return {
            text: item.nickName,
            open_id: item._open_id
          }
        })
      }
      return searchResult
    })
  }
})