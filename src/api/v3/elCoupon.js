import request from '@/utils/request'

export function getElCouponList(param) {
  return request({
    url: 'manage/v3/coupon/list',
    method: 'post',
    data: param
  })
}

export function addElCoupon(param) {
  return request({
    url: 'manage/v3/coupon/addPrivilegeCoupons',
    method: 'post',
    data: param
  })
}

export function updateElCoupon(param) {
  return request({
    url: 'manage/v3/coupon/updatePrivilegeCoupons',
    method: 'post',
    data: param
  })
}

export function addCouponForUser(param) {
  return request({
    url: 'manage/v3/coupon/forUser',
    method: 'post',
    data: param
  })
}

export function getForUserList(param) {
  return request({
    url: 'manage/v3/coupon/user_list',
    method: 'post',
    data: param
  })
}
export function getCouponUseLog(param) {
  return request({
    url: 'manage/v3/coupon/log/list',
    method: 'post',
    data: param
  })
}

export function getSendCouponList(param) {
  return request({
    url: 'manage/v3/coupon/send_friend',
    method: 'post',
    data: param
  })
}

export function getElCouponAllList() {
  return request({
    url: 'manage/v3/coupon/all_list',
    method: 'post'
  })
}

export function getInvoice(param) {
  return request({
    url: 'manage/v3/invoice/list',
    method: 'post',
    data: param
  })
}

export function addInvoice(param) {
  return request({
    url: 'manage/v3/invoice/add',
    method: 'post',
    data: param
  })
}

export function findCoupons() {
  return request({
    url: 'manage/v3/coupon/findCoupons',
    method: 'post'
  })
}
export function giveUserCoupons(param) {
    return request({
      url: 'manage/v3/coupon/giveUserCoupons',
      method: 'post',
      data:param
    })
}



