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
    //全局属性定义
    this.globalData = {
      playingMusicId: -1,
    }
  },
  //设置当前播放的音乐id
  setPlayingMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  //获取当期播放的音乐id
  getPlayingMusicId() {
    return this.globalData.playingMusicId
  }
})
