import request from '@/utils/request'

/* 获取系统通知列表*/
export function getPushMsgList(pageNum, pageSize, search) {
  return request({
    url: 'manage/message/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 添加系统通知*/
export function addPushMsg(pushMsg) {
  return request({
    url: 'manage/message/add',
    method: 'post',
    data: pushMsg
  })
}

/* 删除系统通知*/
export function delMessage(id) {
  return request({
    url: 'manage/message/del',
    method: 'post',
    data: {
      id: id
    }
  })
}
