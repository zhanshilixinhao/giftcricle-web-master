import request from '@/utils/request'

/* 获取商品列表*/
export function getItemList(pageNum, pageSize, search, sfpId) {
  return request({
    url: 'manage/item/list' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除商品分类*/
export function delItemApi(id) {
  return request({
    url: 'manage/item/del',
    method: 'post',
    params: {
      id: id
    }
  })
}

/* 改变商品状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/item/status',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

/* 改变商品状态*/
export function setSort(id, sort) {
  return request({
    url: 'manage/item/sort',
    method: 'post',
    params: {
      id: id,
      sort: sort
    }
  })
}

/* 改变商品热门状态*/
export function changeHot(id, status) {
  return request({
    url: 'manage/item/hot',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

/* 改变商品精选状态*/
export function changeChoiceness(id, status) {
  return request({
    url: 'manage/item/choiceness',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

/* 添加商品*/
export function addItemApi(item) {
  return request({
    url: 'manage/item/add',
    method: 'post',
    data: item
  })
}

/* 修改商品*/
export function updateItemApi(item) {
  return request({
    url: 'manage/item/update',
    method: 'post',
    data: item
  })
}

/* 添加商品*/
export function detailApi(id) {
  return request({
    url: 'manage/item/detail',
    method: 'post',
    params: {
      id: id
    }
  })
}

/* 删除sku*/
export function deleteSkuAll(itemId) {
  return request({
    url: 'manage/itemSku/delete_sku',
    method: 'post',
    params: {
      itemId: itemId
    }
  })
}
