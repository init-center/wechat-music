// 云函数入口文件
const cloud = require('wx-server-sdk')

//引入tcb-router
const tcbRouter = require('tcb-router')

//引入request-promise
const rp = require('request-promise')

//请求地址
const BASEURL = 'https://musicapi.mexion.xyz'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //创建tcb-router实例，初始化时需要将event传进去
  const app = new tcbRouter({ event })

  //和koa的路由类似的语法，同样，返回数据也是使用ctx.body
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')  //通过ordrBy排序，desc表示逆序，asc是正序
      .get()
      .then(res => res)
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASEURL + '/playlist/detail?id=' + event.playlistId).then(res => JSON.parse(res))
  })

  //tcb-router需要在最后使用app.serve()返回服务
  return app.serve()
}