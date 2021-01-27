import request from '@/utils/request'

export function getRecommendList(params) {
  return request({
    url: 'manage/recommend/list',
    method: 'post',
    data: params
  })
}

export function addRecommendItem(params) {
  return request({
    url: 'manage/recommend/add',
    method: 'post',
    data: params
  })
}

export function delRecommendItem(params) {
  return request({
    url: 'manage/recommend/del',
    method: 'post',
    data: params
  })
}

export function sortRecommendItem(params) {
  return request({
    url: 'manage/recommend/sort',
    method: 'post',
    data: params
  })
}
