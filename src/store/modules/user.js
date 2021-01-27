import { login, logout, getInfo } from '@/api/login'
// import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

var MD5 = require('md5.js')

const user = {
  state: {
    token: getToken(),
    name: '',
    roleId: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLEID: (state, roleId) => {
      state.roleId = roleId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      var pwd = new MD5().update(userInfo.password).digest('hex').toUpperCase()
      return new Promise((resolve, reject) => {
        login(username, pwd).then(response => {
          const data = response.data
          setToken(data.data)
          commit('SET_TOKEN', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.data.menus && data.data.menus.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.data.menus)
          }
          // else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          commit('SET_NAME', data.data.sysAdmin.username)
          commit('SET_ROLEID', data.data.roleId)
          commit('SET_AVATAR', data.data.sysAdmin.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
