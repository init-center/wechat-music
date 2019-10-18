import formatTime from '../../utils/formatTime.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](value) {
      if(value) {
        this.setData({
          formatCreateTime: formatTime(new Date(value))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formatCreateTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //图片预览
    onPreviewImage(e) {
      wx.previewImage({
        urls: e.target.dataset.images,
        current: e.target.dataset.curImage
      })
    }
  }
})
