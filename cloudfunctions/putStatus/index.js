// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('传入put云函数的参数', event)
  date= String(event.year)+String(event.month)+String(event.day)
  var data = ''

  // 查询当天数据
  db.collection('status').where({
    date: date
  })
  .get().then(res => {
    data = res.data
    console.log('数据库查询结果：',data)
  })
  
  // 查看当天工作状态是否有数据
  if (data.res == null){
    return db.collection('status').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        date: date,
        night: event.night,
        work: event.work
      }
    })
  } else if (data[0].night != event.night && data[0].work != event.work){
    if (data[0].night != event.night){
      return db.collection('status').doc(data[0]._id).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          night: event.night,
        }
      })
    } else {
      return db.collection('status').doc(data[0]._id).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          work: event.work,
        }
      })
    }    
  }

  
}