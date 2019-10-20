//获取全局app实例
const app = getApp()

let openId = ''
let isFirstIn = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户openid
    openId = app.globalData.openId
    isFirstIn = true
    this._loadMusicHistory()
  },
  _loadMusicHistory() {
    //获取播放历史
    const musicHistory = wx.getStorageSync(openId)
    if (musicHistory.length === 0) {
      wx.showModal({
        title: '播放历史为空',
        content: '',
      })
    } else {
      //在此之前需要将storage的musiclist更新为播放历史列表
      wx.setStorageSync('musiclist', musicHistory)

      //设置播放历史
      this.setData({
        musicHistory
      })
    }
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
    if(isFirstIn) {
      isFirstIn = false
      return
    }

    this._loadMusicHistory()
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