//每次最多取的条数
const MAX_LIMIT = 15

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      },
    ],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
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
    //下来首先清空歌单数组
    this.setData({
      playlist: []
    })
    //然后重新获取歌单
    this._getPlaylist()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //调用云函数获取歌单
  _getPlaylist() {
    wx.showLoading({
      title: '加载中',
    })
    //通过callFunction调用云函数
    //参数是个对象，name是调用的函数名称，data传参
    wx.cloud.callFunction({
      name: 'music',
      data: {
        //使用了tcb-router需要使用$url指定路由名称
        $url: 'playlist',
        start: this.data.playlist.length,
        count: MAX_LIMIT
      }
    }).then((res) => {
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      //获取完数据后手动停止下拉的操作
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})