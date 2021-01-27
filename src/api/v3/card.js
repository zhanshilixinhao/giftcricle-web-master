import request from '@/utils/request'

export function getCardList(param) {
  return request({
    url: 'manage/v3/card/list',
    method: 'post',
    data: param
  })
}

export function addCard(param) {
  return request({
    url: 'manage/v3/card/add',
    method: 'post',
    data: param
  })
}

export function updateCard(param) {
  return request({
    url: 'manage/v3/card/update',
    method: 'post',
    data: param
  })
}

export function deleteCard(param) {
  return request({
    url: 'manage/v3/card/delete',
    method: 'post',
    data: param
  })
}


export function detailCard(param) {
  return request({
    url: 'manage/v3/card/detail',
    method: 'post',
    data: param
  })
}

export function allStoreList() {
  return request({
    url: 'manage/v3/card/all_store',
    method: 'post'
  })
}

export function allEventList() {
  return request({
    url: 'manage/v3/card/all_event',
    method: 'post'
  })
}

export function findCoupons() {
  return request({
    url: 'manage/v3/coupon/findCoupons',
    method: 'post'
  })
}


