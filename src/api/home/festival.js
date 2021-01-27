import request from '@/utils/request'

/* 获取横幅列表*/
export function getFestivalList(pageNum, pageSize, name, time) {
  return request({
    url: 'manage/festival/list',
    method: 'post',
    data: {
      pageNum: pageNum,
      pageSize: pageSize,
      name: name,
      time: time
    }
  })
}

/* 删除横幅*/
export function delFestival(id) {
  return request({
    url: 'manage/festival/del',
    method: 'post',
    data: {
      id: id
    }
  })
}
/* 删除横幅*/
export function festivalDetail(id) {
  return request({
    url: 'manage/festival/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}
/* 添加横幅*/
export function addFestival(festival) {
  return request({
    url: 'manage/festival/add',
    method: 'post',
    data: festival
  })
}

/* 修改横幅*/
export function updateFestival(festival) {
  return request({
    url: 'manage/festival/update',
    method: 'post',
    data: festival
  })
}

