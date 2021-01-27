import request from '@/utils/request'

/* 获取系统通知列表*/
export function getWithdrawList(pageNum, pageSize, search) {
  return request({
    url: 'manage/withdraw/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 添加系统通知*/
export function handleUserWithdraw(id, status, describe) {
  return request({
    url: 'manage/withdraw/handle',
    method: 'post',
    data: {
      id: id,
      status: status,
      describe: describe
    }
  })
}

/* 获得所有的银行*/
export function getAllBank() {
  return request({
    url: 'manage/withdraw/bank',
    method: 'post',
    data: {
    }
  })
}

/* 开始处理*/
export function handleBeginWithdraw(id) {
  return request({
    url: 'manage/withdraw/status',
    method: 'post',
    data: {
      id: id
    }
  })
}
