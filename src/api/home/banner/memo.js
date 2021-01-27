import request from '@/utils/request'

/* 节日事件列表*/
export function getMemoFestivalList(param) {
  return request({
    url: 'manage/memo/list',
    method: 'post',
    data: param
  })
}
/* 添加节日事件*/
export function addMemoFestival(memoFestival) {
  return request({
    url: 'manage/memo/add',
    method: 'post',
    data: memoFestival
  })
}

/* 修改节日事件*/
export function updateMemoFestival(memoFestival) {
  return request({
    url: 'manage/memo/update',
    method: 'post',
    data: memoFestival
  })
}

/* 删除节日事件*/
export function delMemoFestival(param) {
  return request({
    url: 'manage/memo/del',
    method: 'post',
    data: param
  })
}
/* 节日事件详情*/
export function detailMemoFestival(param) {
  return request({
    url: 'manage/memo/detail',
    method: 'post',
    data: param
  })
}
// 节日事件商品列表
export function getFestivalItemList(param) {
  return request({
    url: 'manage/memo/item_list',
    method: 'post',
    data: param
  })
}
// 删除商品
export function delFestivalItem(param) {
  return request({
    url: 'manage/memo/del_item',
    method: 'post',
    data: param
  })
}

/* 添加节日事件商品*/
export function addFestivalItem(param) {
  return request({
    url: 'manage/memo/add_item',
    method: 'post',
    data: param
  })
}
