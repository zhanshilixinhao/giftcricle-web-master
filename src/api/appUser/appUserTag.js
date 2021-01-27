import request from '@/utils/request'

/* 获取印象标签列表*/
export function getTagList(pageNum, pageSize, search) {
  return request({
    url: 'manage/tagDict/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除印象标签*/
export function delTag(id) {
  return request({
    url: 'manage/tagDict/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 改变印象标签状态*/
export function changeStaus(id, status) {
  return request({
    url: 'manage/tagDict/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 添加印象标签*/
export function addTag(tag, type) {
  return request({
    url: 'manage/tagDict/add',
    method: 'post',
    data: {
      tag: tag,
      type: type
    }
  })
}

/* 修改印象标签*/
export function updateTag(id, tag, type) {
  return request({
    url: 'manage/tagDict/update',
    method: 'post',
    data: {
      id: id,
      tag: tag,
      type: type
    }
  })
}

/* 获得所有的印象标签*/
export function getAllItemCate() {
  return request({
    url: 'manage/itemCate/all',
    method: 'post',
    data: {
    }
  })
}
