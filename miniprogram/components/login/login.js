// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取用户信息
    onGetUserInfo(e) {
      const userInfo = e.detail.userInfo
      if(userInfo) {
        //允许授权
        this.setData({
          isModalShow: false
        })
        //将用户信息传递出去
        this.triggerEvent("loginSuccess", userInfo)
      } else {
        //拒绝授权
        this.triggerEvent("loginFail")
      }

    }
  }
})
