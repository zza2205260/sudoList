// pages/becomeCheckUser/becomeCheckUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    open_id: "",
    userInfo: {},
    checkUserInfo: {},
    onGotUserInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let open_id = options.open_id;
    this.setData({
      open_id: open_id,
      onGotUserInfo: this.onGotUserInfo
    }, ()=>{
     this.getUserInfo(); 
    })
    

  },
  getUserInfo: function(){
    wx.cloud.callFunction({
      name: "userInfoGet",
      data: {
        oepn_id: this.data.open_id
      }
    }).then((res)=>{
      this.setData({
        userInfo: res.result.data.userInfo
      })
    })
  },
 
  onGotUserInfo: function(e){
    wx.cloud.callFunction({
      name: "followAdd",
      data: {
        followOpenId: this.data.open_id,
        isCheckUser: true
      }
    }).then(res=>{
      if(res.result.code == 0){
        wx.showToast({
          title: '成为监督人成功！',
          success: res => {
            this.goBackTabBar()
          }
        })
      }else{
        wx.showToast({
          icon: "none",
          title: res.result.errorMsg,
          success: res=>{
            this.goBackTabBar()
          }
        })
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  acceptClick: function(){

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  goBackTabBar: function(){
    wx.switchTab({
      url: '/pages/mlist/mlist',
    })
  }


})