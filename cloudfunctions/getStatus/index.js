// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取当月数据
  console.log('传入云函数的参数', event)
  dateStr= String(event.year)+ String(event.month)
  console.log('年月', dateStr)
  return db.collection('status')
      .aggregate()
      .project({
        _id: 0,
        month: $.substrBytes(['$date', 0, 6]),
        date: 1,
        night: 1,
        work: 1
      })
      .match({
        month: dateStr
      })
      .limit(100)
      .end()
}