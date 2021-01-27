import request from '@/utils/request'

/* 获取主题商品列表*/
export function getLabelItemList(pageNum, pageSize, search) {
  return request({
    url: 'manage/labelItem/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除主题商品*/
export function delLabelItem(id) {
  return request({
    url: 'manage/labelItem/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 添加主题商品*/
export function addLabelItem(labelId, ids) {
  return request({
    url: 'manage/labelItem/add',
    method: 'post',
    data: {
      labelId: labelId,
      ids: ids
    }
  })
}

/* 修改主题商品*/
export function updateThemeItem(ThemeItem) {
  return request({
    url: 'manage/labelItem/update',
    method: 'post',
    data: ThemeItem
  })
}

/* 修改主题商品状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/labelItem/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 修改主题商品排序值*/
export function setLabelItemSort(labelItem) {
  return request({
    url: 'manage/labelItem/sort',
    method: 'post',
    data: labelItem
  })
}

