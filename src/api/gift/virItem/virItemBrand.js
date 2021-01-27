import request from '@/utils/request'

/* 获取虚拟商品品牌列表*/
export function getVirItemBrandList(pageNum, pageSize, name) {
  return request({
    url: 'manage/virItemBrand/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除虚拟商品品牌*/
export function delVirItemBrand(id) {
  return request({
    url: 'manage/virItemBrand/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加虚拟商品品牌*/
export function addVirItemBrand(name) {
  return request({
    url: 'manage/virItemBrand/add',
    method: 'post',
    data: {
      name: name
    }
  })
}

/* 修改虚拟商品品牌*/
export function updateVirItemBrand(id, name) {
  return request({
    url: 'manage/virItemBrand/update',
    method: 'post',
    data: {
      id: id,
      name: name
    }
  })
}

/* 获得所有的虚拟商品品牌*/
export function getAllVirItemBrand(sfpId) {
  return request({
    url: 'manage/virItemBrand/all' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
    }
  })
}
