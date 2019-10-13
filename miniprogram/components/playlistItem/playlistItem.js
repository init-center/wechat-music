// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlistItem: {
      type: Object
    }
  },
  observers: {
    ['playlistItem.playCount'](playCount) {
      this.setData({
        _playCount: this._tranNumber(playCount, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _playCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //转换播放数
    // num 要转换的数字
    //point 保留的小数点
    _tranNumber(num, point) {
      let numStr = num.toString().split('.')[0]
      if(numStr.length < 6) {
        return numStr
      } else if(numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
      } else if(numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    }
  },
})
