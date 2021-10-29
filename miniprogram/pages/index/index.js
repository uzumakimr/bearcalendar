//index.js
const app = getApp()
const { envList } = require('../../envList.js')

var isTap = false

import todo from '../../components/v2/plugins/todo'
import selectable from '../../components/v2/plugins/selectable'
import solarLunar from '../../components/v2/plugins/solarLunar/index'
import timeRange from '../../components/v2/plugins/time-range'
import week from '../../components/v2/plugins/week'
import holidays from '../../components/v2/plugins/holidays/index'
import plugin from '../../components/v2/plugins/index'

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)

const conf = {
  data: {
    calendarConfig: {
      theme: 'default',
      showHolidays: true,
      showFestivals: true,
      showLunar: true,
      emphasisWeek: true,
      markToday: '今',
      inverse: true,
      // chooseAreaMode: true
      // defaultDate: '2020-9-8',
      // autoChoosedWhenJump: true
    },
    statusBtn: [
      {
        text: '休息',
        action: 'rest',
      },
      {
        text: '夜班',
        action: 'night',
      },
      {
        text: '删除',
        action: 'reset',
      },
    ],
    isTap
  },
  whenChangeMonth(e){
    const calendar = this.selectComponent('#calendar').calendar
    const {year,month} = calendar.getCurrentYM()
    wx.cloud.callFunction({
      name: 'getStatus',
      data:{
        year: year,
        month: month,
      },
    })
    .then(res =>{
      var status = res.result.data
      console.log(status)
      for (var i=0;i<status.length;i++){
        if (status[i].work == false){
          calendar.setTodos({
            pos: 'bottom',
            dotColor: 'blue',
            showLabelAlways: true,
            dates:[
              {
                year: status[i].year,
                month: status[i].month,
                date: status[i].date,
              }
            ]
          })
        }
        if(status[i].night == true){
          calendar.setDateStyle([{
            year: status[i].year,
            month: status[i].month,
            date: status[i].date,
            class: 'orange-date'
          }])
        }
      }
    })
    .catch(console.error)
  },
  whenChangeYear(e){
    const calendar = this.selectComponent('#calendar').calendar
    const {year,month} = calendar.getCurrentYM()
    wx.cloud.callFunction({
      name: 'getStatus',
      data:{
        year: year,
        month: month,
      },
    })
    .then(res =>{
      var status = res.result.data
      console.log(status)
      for (var i=0;i<status.length;i++){
        if (status[i].work == false){
          calendar.setTodos({
            pos: 'bottom',
            dotColor: 'green',
            showLabelAlways: true,
            dates:[
              {
                year: status[i].year,
                month: status[i].month,
                date: status[i].date,
              }
            ]
          })
        }
        if(status[i].night == true){
          calendar.setDateStyle([{
            year: status[i].year,
            month: status[i].month,
            date: status[i].date,
            class: 'orange-date'
          }])
        }
      }
    })
    .catch(console.error)
  },
  afterCalendarRender(e){
    const calendar = this.selectComponent('#calendar').calendar
    const {year, month} = calendar.getCurrentYM()
    wx.cloud.callFunction({
      name: 'getStatus',
      data:{
        year: year,
        month: month,
      },
    })
    .then(res =>{    
      var status = res.result.data
      console.log(status)
      for (var i=0;i<status.length;i++){
        // 休息设为todo样式
        if (status[i].work == false){
          calendar.setTodos({
            pos: 'bottom',
            dotColor: 'green',
            showLabelAlways: true,
            dates:[
              {
                year: status[i].year,
                month: status[i].month,
                date: status[i].date,
              }
            ]
          })
        }
        // 夜班设为特殊日期样式
        if(status[i].night == true){
          calendar.setDateStyle([{
            year: status[i].year,
            month: status[i].month,
            date: status[i].date,
            class: 'orange-date'
      }])
        }
      }
    })
    .catch(console.error)
  },
  afterTapDate(e) {
    console.log('afterTapDate', e.detail)
    const calendar = this.selectComponent('#calendar').calendar
    if (calendar.getSelectedDates()[0] != null){
      const {year, month, date} = calendar.getSelectedDates()[0]
      this.setData({isTap:true})
    } else {
      this.setData({isTap: false})
    }    
  },
  handleAction(e) {
    const {action} = e.currentTarget.dataset
    const calendar = this.selectComponent('#calendar').calendar
    console.log(calendar.getSelectedDates())
    const {year, month, date} = calendar.getSelectedDates()[0]
    // console.log(year, month, date)
    switch (action) {
      case 'rest':
        wx.cloud.callFunction({
          name: 'putStatus',
          data:{
            year: year,
            month: month,
            date: date,
            work: false,
            night: -1
          },
        })
        .then(res => {
          console.log(res)
          if (res.result.errMsg == 'collection.add:ok'){
            calendar.setTodos({
              pos: 'bottom',
              dotColor: 'green',
              showLabelAlways: true,
              dates:[
                {
                  year: year,
                  month: month,
                  date: date,
                }
              ]              
            })
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '设置失败',
              icon: 'error',
              duration: 2000
            })
          }         
        })        
        break
      case 'night':
        wx.cloud.callFunction({
          name: 'putStatus',
          data:{
            year: year,
            month: month,
            date: date,
            night: true,
            work: -1
          },
        })
        .then(res => {
          console.log(res)
          if (res.result.errMsg == 'collection.add:ok'){
            calendar.setDateStyle([{
                  year: year,
                  month: month,
                  date: date,
                  class: 'orange-date'
            }])
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '设置失败',
              icon: 'error',
              duration: 2000
            })
          }         
        })        
        break
      case 'reset': 
        wx.cloud.callFunction({
          name: 'delStatus',
          data:{
            year: year,
            month: month,
            date: date
          },
        })
        .then(res => {
          console.log(res)
          if (res.result.errMsg == 'collection.remove:ok'){
            calendar.deleteTodos([{
              year: year,
              month: month,
              date: date
            }])
            calendar.setDateStyle([{
              year: year,
              month: month,
              date: date,
              class: ''
            }])
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'error',
              duration: 2000
            })
          }         
        })        
        break
        default:
        break
    }
  }
}
Page(conf)








