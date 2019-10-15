//定义滑动区域宽度和滑块宽度
let movableAreaWidth = 0
let movableViewWidth = 0

//定义播放资源总时长，后面需要
let duration = 0
//定义当前播放的秒数，在后面需要以此进行优化
let currentSecondTime = -1;
//定义进度条滑块是否在拖拽，拖动进度条时不应该在updateTime设置进度，否则会有冲突
let isMoving = false

//获取唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },
  //生命周期
  lifetimes: {
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拉动进度条滑块
    onChange(e) {
      //如果是touch才是手动拖动的
      if(e.detail.source == 'touch') {
        //标记正在拖拽
        isMoving = true
        //先暂存计算后的值，待触摸结束后再设置,性能优化
        this.data.progress = e.detail.x / (movableAreaWidth -movableViewWidth) * 100
        this.data.movableDis = e.detail.x
      }
    },
    //拉动滑块结束
    onTouchEnd(e) {
      //触摸结束，可以设置了
      const formatCurrentTime = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${ formatCurrentTime.minute }:${ formatCurrentTime.second }`
      })
      //音乐也要跳转,通过seek跳转，参数为秒数
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      //标记拖拽已经结束
      isMoving = false
    },

    //获取进度条宽度，不同设备屏幕宽度不同
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(res => {
        movableAreaWidth = res[0].width
        movableViewWidth = res[1].width
      })
    },
    //为背景音乐管理器绑定事件
    _bindBGMEvent() {
      //播放事件
      backgroundAudioManager.onPlay(() => {
        //为了防止小程序在touchEnd之后还触发change事件导致isMoving一直未true
        //从而导致进度不会移动
        //因为在手动跳转位置后会重新触发play事件播放，所以在这个生命周期中我们需要将isMoving设置为false,这样才会使音乐播放时滑动标记isMoving为false
        isMoving = false
      })
      //停止播放
      backgroundAudioManager.onStop(() => {
      })
      //暂停播放
      backgroundAudioManager.onPause(() => {
      })
      //加载中
      backgroundAudioManager.onWaiting(() => {
      })
      //加载完成，可以播放
      backgroundAudioManager.onCanplay(() => {
        //有可能是undefined，所以要判断一下
        //duration是歌曲的总时长
        if(typeof backgroundAudioManager.duration !== 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      //监听音乐播放进度（前台),播放时间更新
      backgroundAudioManager.onTimeUpdate(() => {
        if(isMoving) {
          return
        }
        //currentTime 已播放的时间
        const currentTime = backgroundAudioManager.currentTime
        const duration = backgroundAudioManager.duration
        //性能优化，如果秒数相同则不进行设置，只精确到秒
        const currentSec = currentTime.toString().split('.')[0]
        if(currentSec !== currentSecondTime) {
          const formatCurrentTime = this._dateFormat(currentTime)
          //设置滑块偏移、进度条比例、以及更新已播放时间
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * (currentTime / duration),
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${formatCurrentTime.minute}:${formatCurrentTime.second}`
          })
          //最后要同步更新播放秒数，以便于下次比较
          currentSecondTime = currentSec
        }
        
      })
      //播放完成
      backgroundAudioManager.onEnded(() => {
        //一首播放完成时，需要播放下一首，我们在父元素中已经实现了这样的功能
        //所以可以通过向外触发事件来实现
        this.triggerEvent('musicEnd')
        
      })
      //播放错误
      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    //设置进度条两边显示的时间
    _setTime() {
      duration = backgroundAudioManager.duration
      const formatDuration = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${ formatDuration.minute }:${ formatDuration.second }`
      })

    },
    //格式化时间，将歌曲秒数转化为分钟秒
    _dateFormat(second) {
      const minute = Math.floor(second / 60)
      second = Math.floor(second % 60)
      return {
        "minute": this._padStart(minute),
        "second": this._padStart(second)
      }
    },
    //给不足十的数字补零
    _padStart(num) {
      return num < 10 ? '0' + num : num
    }
  }
})
