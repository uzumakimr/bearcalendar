// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()
const _ = db.command
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  date= event.year+event.month+event.date
  console.log(date) 
  try {
    return await db.collection('status').where({
      date: date
    }).remove()
  } catch(e) {
    console.error(e)
  }

  return {

  }
}