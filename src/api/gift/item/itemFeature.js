import request from '@/utils/request'

/* 获取商品属性列表*/
export function getItemFeatureList(pageNum, pageSize, name) {
  return request({
    url: 'manage/itemFeature/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除商品属性*/
export function delItemFeatureApi(id) {
  return request({
    url: 'manage/itemFeature/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加商品属性*/
export function addItemFeature(name) {
  return request({
    url: 'manage/itemFeature/add',
    method: 'post',
    data: {
      name: name
    }
  })
}

/* 修改商品属性*/
export function updateItemFeature(id, name, sort) {
  return request({
    url: 'manage/itemFeature/update',
    method: 'post',
    data: {
      id: id,
      name: name,
      sort: sort
    }
  })
}

/* 获得所有的商品属性*/
export function getAllFeatureApi(sfpId) {
  return request({
    url: 'manage/itemFeature/all' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
    }
  })
}
