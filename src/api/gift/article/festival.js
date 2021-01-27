import request from '@/utils/request'

/* 获取文章列表*/
export function getArticleFestival(params) {
  return request({
    url: 'manage/ar/Festival/list',
    method: 'post',
    data: params
  })
}

export function addArFestival(params) {
  return request({
    url: 'manage/ar/Festival/add',
    method: 'post',
    data: params
  })
}

export function updateArFestival(params) {
  return request({
    url: 'manage/ar/Festival/update',
    method: 'post',
    data: params
  })
}

export function delArFestival(params) {
  return request({
    url: 'manage/ar/Festival/del',
    method: 'post',
    data: params
  })
}
