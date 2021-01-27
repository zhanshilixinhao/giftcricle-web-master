import request from '@/utils/request'

/* 福利列表*/
export function getWelfareList(data) {
  return request({
    url: 'manage/welfare/list',
    method: 'post',
    data: data
  })
}
/* 添加品牌*/
export function addWelfare(welfare) {
  return request({
    url: 'manage/welfare/add',
    method: 'post',
    data: welfare
  })
}

/* 修改品牌*/
export function updateWelfare(welfare) {
  return request({
    url: 'manage/welfare/update',
    method: 'post',
    data: welfare
  })
}

/* 删除品牌*/
export function deleteWelfare(welfareId) {
  return request({
    url: 'manage/welfare/delete',
    method: 'post',
    data: {
      welfareId: welfareId
    }
  })
}
/* 删除品牌*/
export function detailWelfare(welfareId) {
  return request({
    url: 'manage/welfare/detail',
    method: 'post',
    data: {
      welfareId: welfareId
    }
  })
}

export function getAllItemList(type, pageNum, pageSize, title) {
  return request({
    url: 'manage/welfare/item_list',
    method: 'post',
    data: {
      type: type,
      pageNum: pageNum,
      pageSize: pageSize,
      title: title
    }
  })
}
export function getSkuList(itemId) {
  return request({
    url: 'manage/welfare/sku_list',
    method: 'post',
    data: {
      itemId: itemId
    }
  })
}

/* 获得所有的品牌*/
export function getAllBrand(sfpId) {
  return request({
    url: 'manage/brand/all' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
    }
  })
}

/* 商品基本信息*/
export function itemDetail(welfare) {
  return request({
    url: 'manage/welfare/item_detail',
    method: 'post',
    data: welfare
  })
}
