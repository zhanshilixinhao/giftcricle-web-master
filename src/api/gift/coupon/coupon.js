import request from '@/utils/request'

/* 获取优惠券列表*/
export function getCouponList(pageNum, pageSize, title, brandName) {
  return request({
    url: 'manage/coupon/list',
    method: 'post',
    data: {
      title: title,
      brandName: brandName,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除优惠券*/
export function delCoupon(id) {
  return request({
    url: 'manage/coupon/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 删除优惠券*/
export function giveCouponUser(couponId, quantity, userId) {
  return request({
    url: 'manage/coupon/give',
    method: 'post',
    data: {
      couponId: couponId,
      quantity: quantity,
      userId: userId
    }
  })
}

/* 改变优惠券状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/coupon/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 使用优惠券*/
export function useCoupon(couponCode) {
  return request({
    url: 'manage/coupon/use',
    method: 'post',
    data: {
      couponCode: couponCode
    }
  })
}

/* 添加优惠券*/
export function addCoupon(title, cover, brandName) {
  return request({
    url: 'manage/coupon/add',
    method: 'post',
    data: {
      title: title,
      cover: cover,
      brandName: brandName
    }
  })
}

/* 修改优惠券*/
export function updateCoupon(id, title, cover, brandName) {
  return request({
    url: 'manage/coupon/update',
    method: 'post',
    data: {
      id: id,
      title: title,
      cover: cover,
      brandName: brandName
    }
  })
}

/* 获得所有的优惠券*/
export function getAllCoupon() {
  return request({
    url: 'manage/coupon/all',
    method: 'post',
    data: {
    }
  })
}

/*------------------------------------------------------优惠券记录---------------------------------------------------------------------*/

export function getSendRecordList(params) {
  return request({
    url: 'manage/coupon/send_list',
    method: 'post',
    data: params
  })
}

export function deleteSendRecord(params) {
  return request({
    url: 'manage/coupon/send_del',
    method: 'post',
    data: params
  })
}

export function getUseRecordList(params) {
  return request({
    url: 'manage/coupon/use_list',
    method: 'post',
    data: params
  })
}

export function deleteUseRecord(params) {
  return request({
    url: 'manage/coupon/use_del',
    method: 'post',
    data: params
  })
}



















