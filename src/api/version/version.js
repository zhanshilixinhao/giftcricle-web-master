import request from '@/utils/request'

/* 获取app用户列表*/
export function getApkList(params) {
  return request({
    url: 'manage/version/list',
    method: 'post',
    data: params
  })
}

export function uploadApk(params) {
  return request({
    url: 'manage/version/apk',
    method: 'post',
    data: params
  })
}
