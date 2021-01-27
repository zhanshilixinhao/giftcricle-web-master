import request from '@/utils/request'

/* 获取文章列表*/
export function getArticleLabel(params) {
  return request({
    url: 'manage/ar/label/list',
    method: 'post',
    data: params
  })
}

export function addArLabel(params) {
  return request({
    url: 'manage/ar/label/add',
    method: 'post',
    data: params
  })
}

export function updateArLabel(params) {
  return request({
    url: 'manage/ar/label/update',
    method: 'post',
    data: params
  })
}

export function delArLabel(params) {
  return request({
    url: 'manage/ar/label/del',
    method: 'post',
    data: params
  })
}
