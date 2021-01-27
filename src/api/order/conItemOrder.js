import request from '@/utils/request'

export function getConItemList(search) {
  return request({
    url: 'manage/order/con_item/list',
    method: 'post',
    data: search
  })
}

/* 删除订单*/
export function delConItemList(id) {
  return request({
    url: 'manage/order/con_item/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
