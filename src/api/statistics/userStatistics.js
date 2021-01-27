import request from '@/utils/request'

/* 按天统计用户注册*/
export function days(startTime, endTime) {
  return request({
    url: 'manage/statistics/days',
    method: 'post',
    data: {
      startTime: startTime,
      endTime: endTime
    }
  })
}
/* 按月统计用户注册*/
export function month(month) {
  return request({
    url: 'manage/statistics/month',
    method: 'post',
    data: {
      month: month
    }
  })
}
/* 统计用户注册*/
export function userNumber() {
  return request({
    url: 'manage/statistics/user',
    method: 'post'
  })
}

