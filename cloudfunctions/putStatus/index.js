// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('传入put云函数的参数', event)
  // var data = ''

  // 查询当天数据
  // db.collection('status').where({
  //   year: event.year,
  //   month: event.month,
  //   date: event.date
  // })
  // .get().then(res => {
  //   data = res.data
  //   console.log('数据库查询结果：',data)
  // })
  
  // 写入数据或更新数据
  if(event.work == -1){
    return await db.collection('status').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        year: event.year,
        month: event.month,
        date: event.date,
        night: true,
        work: true
      }
    })
  }else if (event.night == -1){
    return db.collection('status').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        year: event.year,
        month: event.month,
        date: event.date,
        night: false,
        work: false
      }
    })
  }    
}  