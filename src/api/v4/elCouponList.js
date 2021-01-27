import request from '@/utils/request'

export function getElLists(param) {
  return request({
    url: 'manage/v4/partyPack/findPartyPackByPage',
    method: 'post',
    data: param
  })
}

export function addElList(param) {
  return request({
    url: 'manage/v4/partyPack/addPartyPack',
    method: 'post',
    data: param
  })
}

export function updateElList(param) {
  return request({
    url: 'manage/v4/partyPack/updatePartyPack',
    method: 'post',
    data: param
  })
}

export function deleteElList(param) {
  return request({
    url: 'manage/v4/partyPack/deletePartyPack',
    method: 'post',
    data: param
  })
}

export function findElCoupon() {
  return request({
    url: 'manage/v4/partyPack/findCoupons',
    method: 'post'
  })
}
