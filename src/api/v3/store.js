import request from '@/utils/request'

export function getStoreList(param) {
  return request({
    url: 'manage/v3/store/list',
    method: 'post',
    data: param
  })
}

export function addStore(param) {
  return request({
    url: 'manage/v3/store/add',
    method: 'post',
    data: param
  })
}

export function updateStore(param) {
  return request({
    url: 'manage/v3/store/update',
    method: 'post',
    data: param
  })
}

export function deleteStore(param) {
  return request({
    url: 'manage/v3/store/delete',
    method: 'post',
    data: param
  })
}


export function detailStore(param) {
  return request({
    url: 'manage/v3/store/detail',
    method: 'post',
    data: param
  })
}

export function getDistrictList() {
  return request({
    url: 'manage/v3/store/district',
    method: 'post'
  })
}

export function bindStore(param) {
  return request({
    url: 'manage/v3/store/bind',
    method: 'post',
    data: param
  })
}


