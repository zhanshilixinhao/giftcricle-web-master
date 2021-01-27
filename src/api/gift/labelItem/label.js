import request from '@/utils/request'

/* 获取标签列表*/
export function getLabelList(pageNum, pageSize, name) {
  return request({
    url: 'manage/label/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除标签*/
export function deleteLabel(labelId) {
  return request({
    url: 'manage/label/del',
    method: 'post',
    data: {
      labelId: labelId
    }
  })
}

/* 添加标签*/
export function addLabel(name, cover) {
  return request({
    url: 'manage/label/add',
    method: 'post',
    data: {
      name: name,
      cover: cover
    }
  })
}

/* 修改标签*/
export function updateLabel(label) {
  return request({
    url: 'manage/label/update',
    method: 'post',
    data: label
  })
}

/* 改变标签状态*/
export function updateStatus(id) {
  return request({
    url: 'manage/label/status',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 获取所有标签*/
export function getAllList() {
  return request({
    url: 'manage/label/all',
    method: 'post',
    data: {
    }
  })
}

