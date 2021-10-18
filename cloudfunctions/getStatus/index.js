// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'cloud1-7ganqb9waf852de0'})

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取当月数据
  dateStr= event.year+ event.month
  console.log(dateStr)
  db.collection('status')
    .aggregate()
    .project({
      _id: 0,
      month: $.substrBytes(['$date', 0, 6]),
      date: 1,
      night: 1,
      work: 1,
    })
    .end({
      success: function(res) {
        //  console.log('云函数数据库查询结果',res)
        // // 筛选数据
        // for (var r in res) {
        //   if (res[r].month != dateStr){
        //     delete res[r]
        //   }
        // }
        console.log('云函数',res)
        // return{status: res}
      },
      fail: function(err) {
        console.error(err)
      }
    })

}