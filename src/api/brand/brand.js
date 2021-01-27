import request from '@/utils/request'

/* 获取品牌列表*/
export function getBrandList(pageNum, pageSize, name) {
  return request({
    url: 'manage/brand/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除品牌*/
export function delBrand(id) {
  return request({
    url: 'manage/brand/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加品牌*/
export function addBrand(name, logo) {
  return request({
    url: 'manage/brand/add',
    method: 'post',
    data: {
      name: name,
      logo: logo
    }
  })
}

/* 修改品牌*/
export function updateBrand(id, name, logo) {
  return request({
    url: 'manage/brand/update',
    method: 'post',
    data: {
      id: id,
      name: name,
      logo: logo
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
