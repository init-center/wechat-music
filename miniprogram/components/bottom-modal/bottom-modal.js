// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow: {
      type: Boolean,
      value: false
    }

  },
  options: {
    //关闭外部对内部的样式隔离
    styleIsolation: "apply-shared",
    multipleSlots: true
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
    //关闭弹出层
    onHideModal() {
      this.setData({
        isModalShow: false
      })
    }
  }
})
