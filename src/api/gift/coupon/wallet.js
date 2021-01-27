import request from '@/utils/request'

export function getAdminWalletDetail(params) {
  return request({
    url: 'manage/sys/wallet/detail',
    method: 'post',
    data: params
  })
}

export function sysWithdrawRecord(params) {
  return request({
    url: 'manage/sys/wallet/record',
    method: 'post',
    data: params
  })
}

export function addWithRecord(params) {
  return request({
    url: 'manage/sys/wallet/add',
    method: 'post',
    data: params
  })
}

/* 获取系统通知列表*/
export function getMerchantsWithdrawList(params) {
  return request({
    url: 'manage/sys/wallet/withdraw_list',
    method: 'post',
    data: params
  })
}

/* 添加系统通知*/
export function handleUserWithdraw(params) {
  return request({
    url: 'manage/sys/wallet/handle',
    method: 'post',
    data: params
  })
}

/* 开始处理*/
export function handleBeginWithdraw(params) {
  return request({
    url: 'manage/sys/wallet/status',
    method: 'post',
    data: params
  })
}
