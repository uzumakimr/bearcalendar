// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  date= event.year+event.month+event.date
  console.log(date)

  db.collection('status').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      date: date,
      night: event.night,
      work: event.work
    },
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res)
    }
  })

  return {
    res
  }
}