//用户信息
let userInfo = {}

//初始化yunshujuku
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object

  },
  externalClasses: ['iconfont', 'icon-comment', 'icon-share'],

  /**
   * 组件的初始数据
   */
  data: {
    isLoginShow: false,
    isModalShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      //鉴权
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //显示评论弹出层
                this.setData({
                  isModalShow: true
                })
              }
            })
          } else {
            this.setData({
              isLoginShow: true
            })
          }
        }
      })
    },
    onLoginSuccess(e) {
      userInfo = e.detail
      this.setData({
        isLoginShow: false
      }, () => {
        this.setData({
          isModalShow: true
        })
      })
    },
    onLoginFail() {
      wx.showModal({
        title: '授权用户才能进行评论',
        content: '',
      })
    },
    onSend(e) {
      //把评论存到数据库
      const formId = e.detail.formId
      const content = e.detail.value.content
      if(content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }

      wx.showLoading({
        title: '评论中',
        mask: true
      })

      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.data.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        //推送模板消息
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            content,
            formId,
            blogId: this.properties.blogId
          }
        }).then(res => {
          console.log(res)
        })

        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          isModalShow: false,
          content: ''
        })

        //向外触发事件刷新页面
        this.triggerEvent("refreshComment")
      })


    }

  }
})
