// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('传入put云函数的参数', event)
  date= String(event.year)+String(event.month)+String(event.day)
  return db.collection('status').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      date: date,
      night: event.night,
      work: event.work
    }
  })
}