import request from '@/utils/request'

export function getCommentList(pageNum, pageSize, search) {
  return request({
    url: 'manage/order/comment/list',
    method: 'post',
    data: {
      pageNum: pageNum,
      pageSize: pageSize,
      search: JSON.stringify(search)
    }
  })
}

/* 删除提货订单*/
export function deleteComment(id) {
  return request({
    url: 'manage/order/comment/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 提货订单详情*/
export function getContentDetail(id) {
  return request({
    url: 'manage/order/comment/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

