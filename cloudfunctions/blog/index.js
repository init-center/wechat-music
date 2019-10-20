// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//引入tcb-router
const TcbRouter = require('tcb-router')

//获取微信上下文
const wxContext = cloud.getWXContext()

//获取云数据库
const db = cloud.database()

//获取博客集合
const blogCollection = db.collection('blog')
const commentCollection = db.collection('blog-comment')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  //获取博客列表
  app.router('list', async (ctx, next) => {
    //先进行判断，有没有keyword
    //定义搜索条件
    let oSearch = {}
    const keyword = event.keyword.trim()
    if(keyword != '') {
      oSearch = {
        //使用正则匹配
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }

    let blogList = await blogCollection
      .where(oSearch)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => res.data)
      
    ctx.body = blogList
  })


  //获取博客详情
  app.router('detail', async (ctx, next) => {
    //详情查询
    const blogId = event.blogId
    const detail = await blogCollection.where({
      _id: blogId
    }).get().then(res => res.data)

    //评论查询
    const countResult = await commentCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }

    if(total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []

      for(let i = 0; i < batchTimes; ++i) {
        let promise = commentCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
          blogId
        }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }

      if(tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      detail,
      commentList
    }
  })


  //我的发现
  app.router('getMyBlog', async (ctx, next) => {
    ctx.body = await blogCollection.where({
      _openid: wxContext.OPENID
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime', 'desc')
    .get()
    .then(res => res.data)
  })

  return app.serve()
}