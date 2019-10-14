
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

let nowPlayingIndex = false;
let musiclist = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.musicIndex
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  
  _loadMusicDetail(musicId) {
    backgroundAudioManager.stop()
    const music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })

    wx.showLoading({
      title: '歌曲正在缓冲',
    })

    //获取音乐地址
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
        }
    }).then(res => {
      const result = JSON.parse(res.result)
      //设置背景音频播放的内容
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name
      //当内容设置完成后，表明音乐已经播放，设置isPlaying的值为true
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
  },

  //切换播放和暂停
  togglePlaying() {
    if(this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  //上一首
  onPreMusic() {
    nowPlayingIndex--
    //如果已经小于0，则表明已经是第一首了，播放最后一首
    if(nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)

  },
  //下一首
  onNextMusic() {
    nowPlayingIndex ++
    //如果大于列表最后一首，则播放第一首
    if(nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
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