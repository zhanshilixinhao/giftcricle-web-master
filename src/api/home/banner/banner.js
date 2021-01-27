import request from '@/utils/request'

/* 获取横幅列表*/
export function getBannerList(pageNum, pageSize, search) {
  return request({
    url: 'manage/banner/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 删除横幅*/
export function delBanner(id) {
  return request({
    url: 'manage/banner/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 改变横幅状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/banner/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 添加横幅*/
export function addBannerApi(banner) {
  return request({
    url: 'manage/banner/add',
    method: 'post',
    data: banner
  })
}

/* 修改横幅*/
export function updateBannerApi(banner) {
  return request({
    url: 'manage/banner/update',
    method: 'post',
    data: banner
  })
}

/* 获得横幅详情*/
export function getBannerDetail(id) {
  return request({
    url: 'manage/banner/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}
