import request from '@/utils/request'

/* 获取礼物偏好列表*/
export function getGiftPreList(pageNum, pageSize, name) {
  return request({
    url: 'manage/giftPre/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除礼物偏好*/
export function delGiftPre(id) {
  return request({
    url: 'manage/giftPre/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加礼物偏好*/
export function addGiftPre(name) {
  return request({
    url: 'manage/giftPre/add',
    method: 'post',
    data: {
      name: name
    }
  })
}

/* 修改礼物偏好*/
export function updateGiftPre(id, name) {
  return request({
    url: 'manage/giftPre/update',
    method: 'post',
    data: {
      id: id,
      name: name
    }
  })
}

/* 获得所有的礼物偏好*/
export function getAllBrand() {
  return request({
    url: 'manage/brand/all',
    method: 'post',
    data: {
    }
  })
}
