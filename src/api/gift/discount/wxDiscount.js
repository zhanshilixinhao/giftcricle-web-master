import request from '@/utils/request'

export function getWxDiscountList(param) {
  return request({
    url: 'manage/wx/discount/list',
    method: 'post',
    data: param
  })
}

export function deleteWxDiscount(param) {
  return request({
    url: 'manage/wx/discount/del',
    method: 'post',
    data: param
  })
}

export function handleWXDiscount(param) {
  return request({
    url: 'manage/wx/discount/handle',
    method: 'post',
    data: param
  })
}

