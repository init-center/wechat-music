//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        //云开发环境ID
        env: 'music-dev-pw2v0',
        //记录访问小程序的用户到云开发控制台中
        traceUser: true,
      })
    }

    //存储openId对应的播放历史
    this.getOpenId()
    //全局属性定义
    this.globalData = {
      playingMusicId: -1,
      openId: -1
    }
  },
  //设置当前播放的音乐id
  setPlayingMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  //获取当期播放的音乐id
  getPlayingMusicId() {
    return this.globalData.playingMusicId
  },
  //获取用户的openid
  getOpenId() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openId = res.result.openid
      this.globalData.openId = openId
      //查看储存里是否已经有播放历史
      if(wx.getStorageSync(openId) == '') {
        //如果没有就设置为空数组
        wx.setStorageSync(openId, [])
      }
      })
  }
})
