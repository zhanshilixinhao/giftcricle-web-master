import request from '@/utils/request'

/* 获取商家列表*/
export function getMerchantList(pageNum, pageSize, search) {
  return request({
    url: 'manage/merchant/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 审核成功状态改变*/
export function changePassStatus(id, status, username) {
  return request({
    url: 'manage/merchant/pass',
    method: 'post',
    data: {
      id: id,
      status: status,
      username: username
    }
  })
}

/* 审核失败状态改变*/
export function changeFailStatus(id, status) {
  return request({
    url: 'manage/merchant/fail',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 商家审核*/
export function applyMerchant(param) {
  return request({
    url: 'manage/merchant/apply',
    method: 'post',
    data: param
  })
}

/* 改变商家热门状态*/
export function changeHot(id, status) {
  return request({
    url: 'manage/item/hot',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 改变商家精选状态*/
export function changeChoiceness(id, status) {
  return request({
    url: 'manage/item/choiceness',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 添加商家*/
export function addItemApi(item) {
  return request({
    url: 'manage/item/add',
    method: 'post',
    data: item
  })
}

/* 修改商家*/
export function updateItemApi(item) {
  return request({
    url: 'manage/item/update',
    method: 'post',
    data: item
  })
}

/* 添加商家*/
export function detailApi(id) {
  return request({
    url: 'manage/item/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}
