//触发的关键字
let keyword = ''

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: "请输入搜索关键词"
    }
  },
  //传入外部样式类
  externalClasses: [
    "iconfont",
    "icon-search"
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInputChange(e) {
      keyword = e.detail.value
    },
    onSearch() {
      this.triggerEvent('search', { keyword })
    }
  }
})
