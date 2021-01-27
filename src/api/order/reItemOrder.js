import request from '@/utils/request'

export function getReItemOrder(search) {
  return request({
    url: 'manage/order/re_item/list',
    method: 'post',
    data: search
  })
}

/* 删除提货订单*/
export function delReItemOrder(id) {
  return request({
    url: 'manage/order/re_item/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 收货信息*/
export function receiveInfo(id) {
  return request({
    url: 'manage/order/re_item/receive',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 物流信息*/
export function logisticsInfo(id) {
  return request({
    url: 'manage/order/re_item/logistics',
    method: 'post',
    data: {
      id: id
    }
  })
}
// 点击发货
export function shipments(search) {
  return request({
    url: 'manage/order/re_item/shipments',
    method: 'post',
    data: search
  })
}

// 修改物流信息
export function updateLogistics(search) {
  return request({
    url: 'manage/order/re_item/update',
    method: 'post',
    data: search
  })
}

