import request from '@/utils/request'

/* 获取商品分类列表*/
export function getItemCateList(pageNum, pageSize, name) {
  return request({
    url: 'manage/itemCate/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}
/* 根据pid获取商品分类列表*/
export function getItemCateListByPid(pageNum, pageSize, pid) {
  return request({
    url: 'manage/itemCate/pid_list',
    method: 'post',
    data: {
      pageNum: pageNum,
      pageSize: pageSize,
      pid: pid
    }
  })
}

/* 删除商品分类*/
export function delItemCate(id) {
  return request({
    url: 'manage/itemCate/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 改变商品分类状态*/
export function changeStaus(id, status) {
  return request({
    url: 'manage/itemCate/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 添加商品分类*/
export function addItemCate(name) {
  return request({
    url: 'manage/itemCate/add',
    method: 'post',
    data: {
      name: name
    }
  })
}
/* 根据pid添加商品分类*/
export function addItemCateByPid(name, pid,icon) {
  return request({
    url: 'manage/itemCate/pid_add',
    method: 'post',
    data: {
      name: name,
      pid: pid,
      icon: icon
    }
  })
}

/* 添加商品分类*/
export function updateItemCate(params) {
  return request({
    url: 'manage/itemCate/update',
    method: 'post',
    data:params
  })
}

/* 获得所有的商品分类*/
export function getAllItemCate(sfpId) {
  return request({
    url: 'manage/itemCate/all' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
    }
  })
}
