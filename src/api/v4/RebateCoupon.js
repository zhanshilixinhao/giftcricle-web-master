import request from '@/utils/request'

export function getRebateCouponList(param) {
  return request({
    url: 'manage/v4/RebateCoupon/list',
    method: 'post',
    data: param
  })
}

export function addRebateCoupon(param) {
  return request({
    url: 'manage/v4/RebateCoupon/addRebate',
    method: 'post',
    data: param
  })
}

export function updateRebateCoupon(param) {
  return request({
    url: 'manage/v4/RebateCoupon/updateRebate',
    method: 'post',
    data: param
  })
}

export function deleteRebateCoupon(param) {
  return request({
    url: 'manage/v4/RebateCoupon/deleteRebate',
    method: 'post',
    data: param
  })
}
