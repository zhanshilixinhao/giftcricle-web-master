import request from '@/utils/request'
/* 商品购买订单列表*/
export function itemOrderList(search) {
  return request({
    url: 'manage/order/item/list',
    method: 'post',
    data: search
  })
}

/* 删除商品购买订单*/
export function delItemApi(id) {
  return request({
    url: 'manage/order/item/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 订单详情*/
export function detail(orderNo) {
  return request({
    url: 'manage/order/item/detail',
    method: 'post',
    data: {
      orderNo: orderNo
    }
  })
}

/* 订单详情*/
export function getOrderCount(params) {
  return request({
    url: 'manage/order/item/orderCount',
    method: 'post',
    data: params
  })
}
