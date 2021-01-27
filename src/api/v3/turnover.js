import request from '@/utils/request'

export function getTurnoverList(param) {
  return request({
    url: 'manage/v3/turnover/list',
    method: 'post',
    data: param
  })
}

export function getChargeRecord(param) {
  return request({
    url: 'manage/v3/turnover/record_list',
    method: 'post',
    data: param
  })
}

export function getExpenseRecord(param) {
  return request({
    url: 'manage/v3/turnover/expense_list',
    method: 'post',
    data: param
  })
}

export function refundExpense(param) {
  return request({
    url: 'manage/v3/turnover/refund',
    method: 'post',
    data: param
  })
}
export function refundCharge(param) {
  return request({
    url: 'manage/v3/turnover/refund_charge',
    method: 'post',
    data: param
  })
}

export function getRefundExpense(param) {
  return request({
    url: 'manage/v3/turnover/refund_list',
    method: 'post',
    data: param
  })
}

export function createSmsCode() {
  return request({
    url: 'manage/ask/code',
    method: 'post'
  })
}

export function getTransferSend(param) {
  return request({
    url: 'manage/v3/turnover/transfer_list',
    method: 'post',
    data: param
  })
}



