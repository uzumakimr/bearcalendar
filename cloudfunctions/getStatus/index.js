// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = wx.cloud.database()
const status = db.collection('status')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  date= event.year+event.month+event.date
  console.log(date)
  db.collection('status').where({
    date: date
  })
  .get({
    success: function(res) {
      // res.data 是包含以上定义的两条记录的数组
      console.log(res.data)
    }
  })
  return {
    status: res.data
  }
}