//获取全局app实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },
  //组件所在页面的生命周期
  pageLifetimes: {
    //所在页面被显示时
    show() {
      //获取正在播放的音乐id，并改变当前页面的playingId
      this.setData({
        //因为不同渠道获取的id可能类型不同，所以需要转换为number
        playingId: parseInt(app.getPlayingMusicId())
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      const musicId = e.currentTarget.dataset.musicid
      const musicIndex = e.currentTarget.dataset.musicindex
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${ musicId }&musicIndex=${ musicIndex }`,
      })
    }
  }
})
