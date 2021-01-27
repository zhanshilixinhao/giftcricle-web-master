import request from '@/utils/request'

export function discountList(search) {
  return request({
    url: 'manage/item/discount/list',
    method: 'post',
    data: search
  })
}

/* 删除折现记录*/
export function delDiscount(id) {
  return request({
    url: 'manage/item/discount/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 确认折现*/
export function confirmDiscount(id) {
  return request({
    url: 'manage/item/discount/confirm',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 拒绝折现*/
export function refuseDiscount(search) {
  return request({
    url: 'manage/item/discount/refuse',
    method: 'post',
    data: search
  })
}

