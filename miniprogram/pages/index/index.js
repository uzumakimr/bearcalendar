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
        text: '休息',
        action: 'rest',
        color: 'pink'
      },
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
        text: '重置',
        action: 'reset',
        color: 'black'
      }
    ],
    isTap
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
      case 'rest':
        calendar.setTodos({
          pos: 'top',
          // dotColor: 'purple',
          circle: true,
          showLabelAlways: true,
          dates:[
            {
              year: year,
              month: month,
              date: date,
              // todoText: '休息'
            }
          ]
        })
        //this.showToast('设置成功！')
        break
      case 'work':
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
        break
      case 'night':
        calendar.setTodos({
          pos: 'top',
          dotColor: 'red',
          // circle: true,
          showLabelAlways: true,
          dates:[
            {
              year: year,
              month: month,
              date: date,
              todoText: '夜'
            }
          ]
        })
        break
      case 'reset': {
        calendar.deleteTodos([{
          year: year,
          month: month,
          date: date
        }])
        break
      }
      default:
        break
    }
  }
}

Page(conf)








