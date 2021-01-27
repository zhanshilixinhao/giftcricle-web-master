import request from '@/utils/request'

/* 获取后台用户列表*/
export function getWebUserList(pageNum, pageSize, search) {
  return request({
    url: 'manage/user/list',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 获取后台用户列表v3*/
export function getWebUserList1(params) {
  return request({
    url: 'manage/user/list1',
    method: 'post',
    data: params
  })
}

/* 获取后台用户详情*/
export function getSysAdminDetail(id) {
  return request({
    url: 'manage/user/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 修改密码*/
export function updatePassword(oldPassword, newPassword) {
  return request({
    url: 'manage/user/updatePass',
    method: 'post',
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
  })
}

/* 添加后台用户*/
export function addSysAdminApi(sysAdmin) {
  return request({
    url: 'manage/user/add',
    method: 'post',
    data: sysAdmin
  })
}

/* 修改后台用户*/
export function updateSysAdminApi(sysAdmin) {
  return request({
    url: 'manage/user/update',
    method: 'post',
    data: sysAdmin
  })
}

/* 改变用户状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/user/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 改变用户状态*/
export function delSysAdminApi(id) {
  return request({
    url: 'manage/user/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

