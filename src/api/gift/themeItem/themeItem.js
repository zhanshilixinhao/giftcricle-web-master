import request from '@/utils/request'

/* 获取主题商品列表*/
export function getThemeItemList(pageNum, pageSize, search) {
  return request({
    url: 'manage/themeItem/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除主题商品*/
export function delThemeItem(id) {
  return request({
    url: 'manage/themeItem/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加主题商品*/
export function addThemeItem(themeId, ids) {
  return request({
    url: 'manage/themeItem/add',
    method: 'post',
    data: {
      themeId: themeId,
      ids: ids
    }
  })
}

/* 修改主题商品*/
export function updateThemeItem(ThemeItem) {
  return request({
    url: 'manage/themeItem/update',
    method: 'post',
    data: ThemeItem
  })
}

/* 修改主题商品状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/themeItem/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 修改主题商品排序值*/
export function updateThemeItemSort(theme) {
  return request({
    url: 'manage/themeItem/sort',
    method: 'post',
    data: theme
  })
}

/* 获得所有的主题商品*/
export function getAllThemeItem() {
  return request({
    url: 'manage/themeItem/all',
    method: 'post',
    data: {
    }
  })
}
