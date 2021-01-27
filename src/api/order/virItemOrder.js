import request from '@/utils/request'

export function getVirList(search) {
  return request({
    url: 'manage/order/virtual_item/list',
    method: 'post',
    data: search
  })
}

/* 删除订单*/
export function delVirItemOrder(id) {
  return request({
    url: 'manage/order/virtual_item/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
