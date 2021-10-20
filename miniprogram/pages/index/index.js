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
      inverse: true
      // chooseAreaMode: true
      // defaultDate: '2020-9-8',
      // autoChoosedWhenJump: true
    },
    statusBtn: [
      {
        text: '上班',
        action: 'work',
        color: 'red'
      },
      {
        text: '夜班',
        action: 'night',
        color: 'blue'
      },
      {
        text: '删除',
        action: 'reset',
        color: 'black'
      }
    ],
    isTap
  },
  whenChangeMonth(e){
    const calendar = this.selectComponent('#calendar').calendar
    const date = calendar.getCurrentYM()
    this.setData({isTap: false})
    wx.cloud.callFunction({
      name: 'getStatus',
      data:{
        year: date.year,
        month: date.month,
      },
    })
    .then(res =>{
      // console.log(res.result)
      var status = res.result.list
      console.log(status)
      for (var i=0;i<status.length;i++){
        if (status[i].work == true){
          //console.log(status[i].date.substring(4,6))
          calendar.setTodos({
            pos: 'bottom',
            dotColor: 'blue',
            // circle: true,
            showLabelAlways: true,
            dates:[
              {
                year: Number(status[i].date.substring(0,4)),
                month: Number(status[i].date.substring(4,6)),
                date: Number(status[i].date.substring(6,8)),
              }
            ]
          })
        }
        if(status[i].night == true){
          calendar.setDateStyle([{
            year: Number(status[i].date.substring(0,4)),
            month: Number(status[i].date.substring(4,6)),
            date: Number(status[i].date.substring(6,8)),
            class: 'orange-date'
          }])
        }
      }
    })
    .catch(console.error)
  },
  whenChangeYear(e){
    const calendar = this.selectComponent('#calendar').calendar
    const date = calendar.getCurrentYM()
    this.setData({isTap: false})
    wx.cloud.callFunction({
      name: 'getStatus',
      data:{
        year: date.year,
        month: date.month,
      },
    })
    .then(res =>{
      // console.log(res.result)
      var status = res.result.list
      console.log(status)
      for (var i=0;i<status.length;i++){
        if (status[i].work == true){
          //console.log(status[i].date.substring(4,6))
          calendar.setTodos({
            pos: 'bottom',
            dotColor: 'blue',
            // circle: true,
            showLabelAlways: true,
            dates:[
              {
                year: Number(status[i].date.substring(0,4)),
                month: Number(status[i].date.substring(4,6)),
                date: Number(status[i].date.substring(6,8)),
              }
            ]
          })
        }
        if(status[i].night == true){
          calendar.setDateStyle([{
            year: Number(status[i].date.substring(0,4)),
            month: Number(status[i].date.substring(4,6)),
            date: Number(status[i].date.substring(6,8)),
            class: 'orange-date'
          }])
        }
      }
    })
    .catch(console.error)
  },
  afterCalendarRender(e){
    const calendar = this.selectComponent('#calendar').calendar
    const date = calendar.getCurrentYM()
    // console.log('小程序端', date.year, date.month)
    wx.cloud.callFunction({
      name: 'getStatus',
      data:{
        year: date.year,
        month: date.month,
      },
    })
    .then(res =>{
      // console.log(res.result)
      var status = res.result.list
      console.log(status)
      for (var i=0;i<status.length;i++){
        if (status[i].work == true){
          //console.log(status[i].date.substring(4,6))
          calendar.setTodos({
            pos: 'bottom',
            dotColor: 'blue',
            // circle: true,
            showLabelAlways: true,
            dates:[
              {
                year: Number(status[i].date.substring(0,4)),
                month: Number(status[i].date.substring(4,6)),
                date: Number(status[i].date.substring(6,8)),
              }
            ]
          })
        }
        if(status[i].night == true){
          calendar.setDateStyle([{
            year: Number(status[i].date.substring(0,4)),
            month: Number(status[i].date.substring(4,6)),
            date: Number(status[i].date.substring(6,8)),
            class: 'orange-date'
      }])
        }
      }
    })
    .catch(console.error)
  },
  afterTapDate(e) {
    // console.log('afterTapDate', e.detail)
    const calendar = this.selectComponent('#calendar').calendar
    if (calendar.getSelectedDates()[0] != null){
      const {year, month, date} = calendar.getSelectedDates()[0]
      console.log(year, month, date)
      this.setData({isTap:true})
      // console.log('isTap=', isTap)
    } else {
      this.setData({isTap: false})
      // console.log(isTap)
    }    
  },
  handleAction(e) {
    const {action} = e.currentTarget.dataset
    // this.setData({
    //   rst: []
    // })
    console.log(action)
    const calendar = this.selectComponent('#calendar').calendar
    const {year, month, date} = calendar.getSelectedDates()[0]
    console.log(year, month, date)
    switch (action) {
      case 'work':
        wx.cloud.callFunction({
          name: 'putStatus',
          data:{
            year: year,
            month: month,
            day: date,
            work: true,
          },
        })
        .then(res => {
          console.log(res)
          if (res.result.errMsg == 'collection.add:ok'){
            calendar.setTodos({
              pos: 'bottom',
              dotColor: 'blue',
              // circle: true,
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
            day: date,
            night: true
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
            day: date
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








