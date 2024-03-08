// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: '[yourenvId]'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('传入del云函数的参数', event)
  return await db.collection('status').where({
    date: event.date,
    month: event.month,
    year: event.year
  }).remove()
}