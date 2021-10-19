// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('传入del云函数的参数', event)
  date= String(event.year)+String(event.month)+String(event.day)
  console.log(date) 
  return await db.collection('status').where({
    date: date
  }).remove()
}