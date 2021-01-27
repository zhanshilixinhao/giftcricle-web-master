import request from '@/utils/request'

/* 获取主题列表*/
export function getThemeList(pageNum, pageSize, name) {
  return request({
    url: 'manage/theme/list',
    method: 'post',
    data: {
      name: name,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除主题*/
export function delTheme(id) {
  return request({
    url: 'manage/theme/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加主题*/
export function addTheme(name, cover) {
  return request({
    url: 'manage/theme/add',
    method: 'post',
    data: {
      name: name,
      cover: cover
    }
  })
}

/* 修改主题*/
export function updateTheme(theme) {
  return request({
    url: 'manage/theme/update',
    method: 'post',
    data: theme
  })
}

/* 修改主题状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/theme/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 获得所有的主题*/
export function getAllTheme() {
  return request({
    url: 'manage/theme/all',
    method: 'post',
    data: {
    }
  })
}
