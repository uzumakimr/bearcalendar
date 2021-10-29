// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取当月数据
  console.log('传入get云函数的参数', event)
  return db.collection('status').where({
        year: event.year,
        month: event.month
      })
      .get()
}