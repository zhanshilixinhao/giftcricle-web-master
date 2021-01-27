import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'manage/user/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: 'manage/user/info',
    method: 'post',
    data: {
      token: token
    }
  })
}

export function logout() {
  return request({
    url: 'manage/user/logout',
    method: 'post'
  })
}
