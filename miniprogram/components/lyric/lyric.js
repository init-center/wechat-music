//每个rpx的长度
let lyricHeight = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },
  observers: {
    lyric(lrc) {
      if(lrc === '暂无歌词') {
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0
            }
          ],
          nowLyricIndex: -1
        })
      } else {
        //解析歌词
        this._parseLyric(lrc)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0,
    scrollTop: 0
  },

  lifetimes: {
    ready() {
      //计算每个rpx的长度，在小程序中，
      //每个设备的宽度都为750rpx，根据大小自动换算
      //先通过获取设备信息，获取设备宽度然后除以750就可以获得每个rpx的长度
      wx.getSystemInfo({
        success: function(res) {
          //我们在css中设置的每句歌词高度为64rpx
         lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //由父组件调用,currentTime也由父组件传递
    update(currentTime) {
      const lrcList = this.data.lrcList
      if(lrcList.length === 0) {
        return
      }

      //如果当前时间已经大于最后一句的时间了，就谁也不选中
      //并且滑动到最后一句歌词的位置
      if(currentTime > lrcList[lrcList.length - 1].time) {
        //并且大于最后一句时间但当前显示的不是最后一句
        if(this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lyricHeight * lrcList.length
          })
        }
      }
      for(let i = 0, len = lrcList.length; i < len; ++i) {
        //如果当前的时间小于第i句歌词的时间，说明i - 1句歌词是该高亮的歌词
        //同时高度也该设置为第几句歌词乘以每句歌词的高度
        if(currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }

    },
    //解析歌词
    _parseLyric(lrc) {
      const lines = lrc.split('\n')
      //用于存储歌词解析后的对象
      let _lrcList = []
      lines.forEach(line => {
        const time = line.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time != null) {
          const lrcStr = line.split(time)[1]
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          const time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) /1000
          _lrcList.push({
            time: time2Seconds,
            lrc: lrcStr
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    }
  }
})
