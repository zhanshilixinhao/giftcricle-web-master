import request from '@/utils/request'

/* 获取虚拟商品分类列表*/
export function getItemCateList(pageNum, pageSize, name) {
  return request({
    url: 'manage/virItemCate/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除虚拟商品分类*/
export function delItemCate(id) {
  return request({
    url: 'manage/virItemCate/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 改变虚拟商品分类状态*/
export function changeStaus(id, status) {
  return request({
    url: 'manage/virItemCate/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 添加虚拟商品分类*/
export function addItemCate(name) {
  return request({
    url: 'manage/virItemCate/add',
    method: 'post',
    data: {
      name: name
    }
  })
}

/* 修改虚拟商品分类*/
export function updateItemCate(id, name, sort) {
  return request({
    url: 'manage/virItemCate/update',
    method: 'post',
    data: {
      id: id,
      name: name,
      sort: sort
    }
  })
}

/* 获得所有的虚拟商品分类*/
export function getAllItemCate(sfpId) {
  return request({
    url: 'manage/virItemCate/all' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
    }
  })
}
