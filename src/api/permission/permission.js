import request from '@/utils/request'

/* 获取后台角色列表*/
export function getRoleList(pageNum, pageSize, search) {
  return request({
    url: 'manage/permission/roles',
    method: 'post',
    data: {
      search: JSON.stringify(search),
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

/* 获取后台菜单列表*/
export function getMenuList(sfpId) {
  return request({
    url: 'manage/permission/menus' + '?sfpId=' + sfpId,
    method: 'post',
    data: {
    }
  })
}

/* 添加后台角色*/
export function addRoleApi(role) {
  return request({
    url: 'manage/permission/addRole',
    method: 'post',
    data: role
  })
}

/* 改变角色状态*/
export function changeStatus(id, status) {
  return request({
    url: 'manage/permission/status',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

/* 获得角色详情*/
export function getRoleDetail(id) {
  return request({
    url: 'manage/permission/detail',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 修改角色*/
export function updateRoleApi(role) {
  return request({
    url: 'manage/permission/update',
    method: 'post',
    data: role
  })
}

/* 删除角色*/
export function delRole(id) {
  return request({
    url: 'manage/permission/del',
    method: 'post',
    data: {
      id: id
    }
  })
}

/* 获得全部的角色*/
export function getAllRole(sfpId) {
  return request({
    url: 'manage/permission/allRole' + '?sfpId=' + sfpId,
    method: 'post',
    data: {}
  })
}

/* 获得全部的角色*/
export function getAllRoleList(sfpId) {
  return request({
    url: 'manage/permission/role_list' + '?sfpId=' + sfpId,
    method: 'post',
    data: {}
  })
}
