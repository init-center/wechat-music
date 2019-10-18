// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //获取openid
  const { OPENID } = cloud.getWXContext()
  //发送模板消息
  const result =  cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `/pages/blog-comment/blog-comment?blogId=${ event.blogId }`,
    data: {
      keyword1: {
        value: '评论完成'
      },
      keyword2: {
        value: event.content
      }
    },
    templateId: 'T7rbkcO5Q7b4zwAs0XgrLYgJhOvuEN_0LB4WGgNhLP4',
    formId: event.formId
  })

  return result
}