import request from '@/utils/request'

/* 添加商品sku*/
export function addskuApi(productValue, productSKU, productId) {
  return request({
    url: '/manage/itemSku/add',
    method: 'post',
    data: {
      productValue: JSON.stringify(productValue),
      productSKU: JSON.stringify(productSKU),
      productId: productId
    }
  })
}

/* 查询sku组合的数量*/
export function countSKUApi(id) {
  return request({
    url: '/manage/itemSku/isGroup',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 查询sku组合列表*/
export function getSkuList(pageNum, pageSize, search) {
  return request({
    url: '/manage/itemSku/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 获得sku详情*/
export function getSkuDetailApi(id) {
  return request({
    url: 'manage/itemSku/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 改变商品状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/itemSku/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 修改商品sku属性*/
export function editItemSKUApi(itemSku) {
  return request({
    url: 'manage/itemSku/update',
    method: 'post',
    data: itemSku
  })
}

/* 获得所有商品属性*/
export function getAllFeatureApi() {
  return request({
    url: 'manage/itemFeature/all',
    method: 'post',
    data: {
    }
  })
}

/* 获得商品的所有商品属性值*/
export function getFeatureValueApi(id) {
  return request({
    url: 'manage/itemSku/value',
    method: 'post',
    data: {
      id: id
    }
  })
}

/*  修改商品属性值*/
export function editValueApi(id, value) {
  return request({
    url: 'manage/itemSku/editValue',
    method: 'post',
    data: {
      id: id,
      value: value
    }
  })
}
