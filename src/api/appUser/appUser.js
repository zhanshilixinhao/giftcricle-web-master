import request from '@/utils/request'

/* 获取app用户列表*/
export function getAppUserList(pageNum, pageSize, search) {
  return request({
    url: 'manage/appUser/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 获取app用户列表通过电话号码*/
export function getUserListByPhone(pageNum, pageSize, phone) {
  return request({
    url: 'manage/appUser/phone',
    method: 'post',
    data: {
      phone: phone,
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 改变用户状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/appUser/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}
