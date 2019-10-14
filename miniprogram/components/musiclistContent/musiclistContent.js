Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
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
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${ musicId }`,
      })
    }
  }
})
