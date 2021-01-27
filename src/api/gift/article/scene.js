import request from '@/utils/request'

/* 获取文章列表*/
export function getSceneList(params) {
  return request({
    url: 'manage/article/scene_list',
    method: 'post',
    data: params
  })
}

export function addScene(params) {
  return request({
    url: 'manage/article/scene_add',
    method: 'post',
    data: params
  })
}

export function updateScene(params) {
  return request({
    url: 'manage/article/scene_update',
    method: 'post',
    data: params
  })
}

export function delScene(params) {
  return request({
    url: 'manage/article/scene_del',
    method: 'post',
    data: params
  })
}
