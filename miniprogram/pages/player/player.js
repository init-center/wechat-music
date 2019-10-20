//获取全局的App实例以获取全局属性
const app = getApp()

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
    isPlaying: false,
    isLyricShow: false,
    lyric: '暂无歌词',
    isSameMusic: false  //进入时是否是同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.musicIndex
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  //控制歌词是否显示
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //播放时间更新，以联动歌词
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //加载音乐
  _loadMusicDetail(musicId) {
    //判断是不是同一首歌
    if(musicId == app.getPlayingMusicId()) {
      this.setData({
        isSameMusic: true
      })
    } else {
      this.setData({
        isSameMusic: false
      })
    }

    const music = musiclist[nowPlayingIndex]
    //如果不是同一首歌才stop
    if(!this.data.isSameMusic) {
      backgroundAudioManager.stop()
    }
    
    
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })

    //将当前播放的音乐id设置到全局属性中
    app.setPlayingMusicId(musicId)

    //获取音乐地址
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
        }
    }).then(res => {
      const result = JSON.parse(res.result)

      //如果url等于null，歌曲为vip专享或者其他原因
      if(result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放'
        })
        setTimeout(() => {
          wx.showToast({
            title: '跳转下一首'
          })
          //自动跳转到下一首
          this.onNextMusic()
        }, 2000)
        return
      }
      //不是同一首歌才重新设置
      if(!this.data.isSameMusic) {
        //设置背景音频播放的内容
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        //保存播放歌曲到历史记录之中
        this.savePlayHistory()
      }
      
      //当内容设置完成后，表明音乐已经播放，设置isPlaying的值为true
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()

      //音乐播放后再加载歌词
      wx.cloud.callFunction({
        name: "music",
        data: {
          $url: "lyric",
          musicId
        }
      }).then(res => {
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if(lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })

      })
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
  //联动控制
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
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

  //保存播放历史
  savePlayHistory() {
    //获取当前播放的歌曲
    const currentMusic = musiclist[nowPlayingIndex]
    //通过全局属性获取到当前openid并获取到该id的播放历史
    const openId = app.globalData.openId
    const historyList = wx.getStorageSync(openId)
    //判断当前播放的歌曲是否在历史里
    for(let i = 0, len = historyList.length; i < len; ++i) {
      //如果已经存在则把这条记录删掉
      if(historyList[i].id === currentMusic.id) {
        historyList.splice(i, 1)
        break
      }
    }

    //如果是不存在则直接插入前面即可，如果存在的话在前面已经删掉了，
    //所以也直接插入即可
    historyList.unshift(currentMusic)
    wx.setStorageSync(openId, historyList)
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