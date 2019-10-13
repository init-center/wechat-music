// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获得云数据库
const db = cloud.database()

const rp = require('request-promise')

const URL = 'https://musicapi.mexion.xyz/personalized'

//数据库集合
const playlistCollection = db.collection('playlist')

//每次最多可以取多少条
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async (event, context) => {
  //为了突破一百条歌单的限制
  //先取到数据集合的总条数
  const countResult = await playlistCollection.count()
  const total = countResult.total
  //计算需要取几次
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  //抓取队列
  const tasks = []
  for(let i = 0; i < batchTimes; ++i) {
    const promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  //新建一个对象来合并分批抓取的对象
  const list = {
    data: []
  }
  if(tasks.length > 0) {
    //开始合并
    list = (await promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur)
      }
    })
  }

  const playlist = await rp(URL).then(res => JSON.parse(res).result)

  //去重处理,只插入数据库中没有的数据
  const newData = []
  for(let i = 0, len1 = playlist.length; i < len1; ++i) {
    let noEqual = true
    for(let j = 0, len2 = list.data.length; j < len2; ++j) {
      if(playlist[i].id === list.data[j].id) {
        noEqual = false
        break
      }
    }
    if(noEqual) {
      newData.push(playlist[i])
    }
  }
  //云数据库只能一条一条插入，所以需要遍历
  for(let i = 0, len = newData.length; i < len; ++i) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()  //服务器的系统时间
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch(err => {
      console.error(插入失败 + err)
    })
  }
  return newData.length
}