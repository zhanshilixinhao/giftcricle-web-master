import request from '@/utils/request'

export function getCardEventList(param) {
  return request({
    url: 'manage/v3/cardEvent/list',
    method: 'post',
    data: param
  })
}

export function addCardEvent(param) {
  return request({
    url: 'manage/v3/cardEvent/add',
    method: 'post',
    data: param
  })
}

export function updateCardEvent(param) {
  return request({
    url: 'manage/v3/cardEvent/update',
    method: 'post',
    data: param
  })
}

export function deleteCardEvent(param) {
  return request({
    url: 'manage/v3/cardEvent/delete',
    method: 'post',
    data: param
  })
}


export function detailCardEvent(param) {
  return request({
    url: 'manage/v3/cardEvent/detail',
    method: 'post',
    data: param
  })
}


export function getCardGradeList(param) {
  return request({
    url: 'manage/v3/cardEvent/grade_list',
    method: 'post',
    data: param
  })
}

export function addCardGrade(param) {
  return request({
    url: 'manage/v3/cardEvent/grade_add',
    method: 'post',
    data: param
  })
}

export function updateCardGrade(param) {
  return request({
    url: 'manage/v3/cardEvent/grade_update',
    method: 'post',
    data: param
  })
}

export function deleteCardGrade(param) {
  return request({
    url: 'manage/v3/cardEvent/grade_delete',
    method: 'post',
    data: param
  })
}

export function updateUserGrade(param) {
  return request({
    url: 'manage/v3/userCard/update_grade',
    method: 'post',
    data: param
  })
}

export function storeCardEvent(param) {
  return request({
    url: 'manage/v3/cardEvent/store_event',
    method: 'post',
    data: param
  })
}



