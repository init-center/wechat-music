// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID
  })

  //将返回的二维码存到存储中
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '_' + Math.random() + '.png',
    fileContent: result.buffer
  })

  return upload.fileID
}