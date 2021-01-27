import request from '@/utils/request'

/* 获取礼物偏好列表*/
export function getEventList(pageNum, pageSize, name) {
  return request({
    url: 'manage/event/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除礼物偏好*/
export function delEvent(id) {
  return request({
    url: 'manage/event/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加礼物偏好*/
export function addEvent(name) {
  return request({
    url: 'manage/event/add',
    method: 'post',
    data: {
      name: name
    }
  })
}

/* 修改礼物偏好*/
export function updateEvent(id, name) {
  return request({
    url: 'manage/event/update',
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
    url: 'manage/event/all',
    method: 'post',
    data: {
    }
  })
}
