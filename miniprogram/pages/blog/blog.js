//定义搜索关键字
let keyword = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //底部弹出层是否显示
    isModalShow: false,
    blogList: []
  },

  //发布
  onPublish() {
    //发布时需要对用户进行鉴权
    //通过getSetting查看用户授权结果
    wx.getSetting({
      success: (res) => {
        if(res.authSetting['scope.userInfo']) {
         //获取用户的信息
         wx.getUserInfo({
           success: (res) => {
             this.onLoginSuccess({
               detail: res.userInfo
             })
           }
         }) 
        } else {
          //未授权则弹出授权Modal
          this.setData({
            isModalShow: true
          })
        }
      }
    })
  },
  //登录成功
  onLoginSuccess(event) {
    const userInfo = event.detail
    //跳转到编辑页面
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${ userInfo.nickName }&avatarUrl=${ userInfo.avatarUrl }`,
    })
  },
  //登录失败
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载博客列表
    this._loadBlogList()
  },
  //加载博客列表
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        $url: 'list',
        start,
        count: 10
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  //跳转到评论页面
  goComment(e) {
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${ e.target.dataset.blogid }`,
    })
  },
  //得到搜索组件抛出的关键字搜索
  onSearch(e) {
    keyword = e.detail.keyword
    this.setData({
      blogList: []
    })
    this._loadBlogList()

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
    this.setData({
      blogList: []
    })

    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const blog = e.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${ blog._id }`
    }
  }
})