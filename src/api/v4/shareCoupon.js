import request from '@/utils/request'

export function getShareCouponList(param) {
  return request({
    url: 'manage/v4/shareCoupon/findShareCouponList',
    method: 'post',
    data: param
  })
}

export function addShareCoupon(param) {
  return request({
    url: 'manage/v4/shareCoupon/addShareCoupon',
    method: 'post',
    data: param
  })
}

export function updateShareCoupon(param) {
  return request({
    url: 'manage/v4/shareCoupon/updateShareCoupon',
    method: 'post',
    data: param
  })
}

export function deleteShareCoupon(param) {
  return request({
    url: 'manage/v4/shareCoupon/deleteShareCoupon',
    method: 'post',
    data: param
  })
}

export function userShareCouponLog(param) {
  return request({
    url: 'manage/v4/shareCoupon/userShareCouponLog',
    method: 'post',
    data: param
  })
}
