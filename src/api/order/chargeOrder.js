import request from '@/utils/request'
/* 充值订单列表*/
export function getChargeOrderList(search) {
  return request({
    url: 'manage/order/charge/list',
    method: 'post',
    data: search
  })
}

/* 删除充值订单*/
export function delChargeOrder(id) {
  return request({
    url: 'manage/order/charge/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}
