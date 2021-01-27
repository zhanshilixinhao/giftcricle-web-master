import request from '@/utils/request'

export function getUserCardList(param) {
  return request({
    url: 'manage/v3/userCard/list',
    method: 'post',
    data: param
  })
}

export function cardInfo(param) {
  return request({
    url: 'manage/v3/userCard/info',
    method: 'post',
    data: param
  })
}

export function getUserCardList1(param) {
  return request({
    url: 'manage/v3/userCard/list_store',
    method: 'post',
    data: param
  })
}

export function addUserCard(param) {
  return request({
    url: 'manage/v3/userCard/add',
    method: 'post',
    data: param
  })
}

export function chargeCard(param) {
  return request({
    url: 'manage/v3/userCard/charge',
    method: 'post',
    data: param
  })
}

export function expenseCard(param) {
  return request({
    url: 'manage/v3/userCard/expense',
    method: 'post',
    data: param
  })
}

export function cardEvent() {
  return request({
    url: 'manage/v3/cardEvent/all_event',
    method: 'post',
  })
}

export function getCardList1(param) {
  return request({
    url: 'manage/v3/card/store_card',
    method: 'post',
    data: param
  })
}

export function getEventCardDetail(param) {
  return request({
    url: 'manage/v3/userCard/card_detail',
    method: 'post',
    data: param
  })
}

export function getEventCardStatus(param) {
  return request({
    url: 'manage/v3/userCard/card_status',
    method: 'post',
    data: param
  })
}
export function getCardDetail(param) {
  return request({
    url: 'manage/v3/userCard/all_card_detail',
    method: 'post',
    data: param
  })
}
export function backCard(param) {
  return request({
    url: 'manage/v3/userCard/back_card',
    method: 'post',
    data: param
  })
}



