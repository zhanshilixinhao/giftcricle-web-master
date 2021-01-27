import request from '@/utils/request'

/* 获取虚拟商品列表*/
export function getVirItemList(pageNum, pageSize, search) {
  return request({
    url: 'manage/virItem/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 改变虚拟商品状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/virItem/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 删除虚拟商品分类*/
export function delVirItemApi(id) {
  return request({
    url: 'manage/virItem/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加虚拟商品*/
export function addVirItemApi(virItem) {
  return request({
    url: 'manage/virItem/add',
    method: 'post',
    data: virItem
  })
}

/* 修改虚拟商品*/
export function updateVirItemApi(virItem) {
  return request({
    url: 'manage/virItem/update',
    method: 'post',
    data: virItem
  })
}

/* 获得虚拟商品详情*/
export function detailApi(id) {
  return request({
    url: 'manage/virItem/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}
