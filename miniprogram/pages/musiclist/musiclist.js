Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        playlistId: options.playlistId
      }
    }).then(res => {
      const list = res.result.playlist
      this.setData({
        musiclist: list.tracks,
        listInfo: {
          coverImgUrl: list.coverImgUrl,
          name: list.name
        }
      })
      //存储音乐列表数据
      this._storageMusiclist()
      wx.hideLoading()
    })
  },
  _storageMusiclist(musiclist) {
    wx.setStorageSync("musiclist", this.data.musiclist)
  }
})