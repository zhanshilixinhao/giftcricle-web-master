import request from '@/utils/request'

/* 获取意见反馈列表*/
export function getSuggestionList(pageNum, pageSize, search) {
  return request({
    url: 'manage/suggestion/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除意见反馈*/
export function delSuggestion(id) {
  return request({
    url: 'manage/suggestion/del',
    method: 'post',
    data: {
      id: id
    }
  })
}
