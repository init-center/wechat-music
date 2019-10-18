//可输入的最大字数
const MAX_WORDS_NUM = 140;
//最大可上传图片数
const MAX_IMAGE_NUM = 9;
//获取到云数据库
const db = wx.cloud.database()

//文本内容
let content = ''
//用户信息
let userInfo = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    canSelectPhoto: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },
  //文本内容被改变
  onInputChange(event) {
    const inputValue = event.detail.value
    let wordsNum = inputValue.length
    if(wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大可输入字数为${ MAX_WORDS_NUM }`
    }
    this.setData({
      wordsNum
    })
    //对外部定义的content进行更新
    content = inputValue
  },
  //文本输入框获取焦点
  onFocus(e) {
    //e.detail.height可以获取到键盘高度
    this.setData({
      footerBottom: e.detail.height
    })
  },
  //文本框失去焦点
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  //选择上传图片
  onChooseImage() {
    //count是还可以选择的图片数量
    //sizeType是文件大小类型，分为原始和压缩
    //sourceType是文件类型，分为相册和相机
    let max = MAX_IMAGE_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['originnal', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        //重新计算可选择的图片数量
        max = MAX_IMAGE_NUM - this.data.images.length
        this.setData({
          canSelectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  //删除图片
  onDeleteImage(e) {
   const index = e.target.dataset.index
   this.data.images.splice(index, 1)
   this.setData({
     images: this.data.images
   })

   if(this.data.images.length < MAX_IMAGE_NUM) {
     this.setData({
       canSelectPhoto: true
     })
   }
  },
  //预览图片
  onPreviewImage(e) {
    //追调用wx提供的接口即可
    wx.previewImage({
      urls: this.data.images,
      current: e.target.dataset.curImage
    })
  },
  //发布
  onPublish() {
    //先判断用户输入内容是否为空
    if(content.trim() === '') {
      wx.showModal({
        title: '文本内容不能为空',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    //先定义一个存储promise的数组，用于保存上传图片的操作
    let promiseArr = []
    //用来保存图片fileId
    let fileIds = []
    //上传图片到云存储
    for(let i = 0, len = this.data.images.length; i < len; ++i) {
      const newPromise = new Promise((resolve, reject) => {
        //首先获得文件的扩展名
        let image = this.data.images[i]
        let suffix = /\.\w+$/.exec(image)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
          filePath: image,
          success: (res) => {
            //存储fileID
            fileIds.push(res.fileID)
            resolve()
          },
          fail: (err) => {
            reject()
          }
        })
      })
      promiseArr.push(newPromise)
    }
    //promise.all全部成功后进行下一步操作
    Promise.all(promiseArr).then(res => {
      //上传时小程序会自动插入openId，即用户的唯一标识，所以不用自己插入
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          images: fileIds,
          createTime: db.serverDate()
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        //返回博客页面，刷新博客列表
        wx.navigateBack()
        //获取到上一级页面
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        //调用上一个列表的下拉刷新函数
        prevPage.onPullDownRefresh()

      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
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