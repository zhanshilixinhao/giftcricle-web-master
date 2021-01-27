import request from '@/utils/request'

/* 获取app用户列表*/
export function getItemOrderData(orderType, startTime, endTime) {
  return request({
    url: 'manage/statistics/order',
    method: 'post',
    data: {
      orderType: orderType,
      startTime: startTime,
      endTime: endTime
    }
  })
}
