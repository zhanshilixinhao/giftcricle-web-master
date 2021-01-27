import { asyncRouterMap, constantRouterMap } from '@/router/index'

/**
 * 通过 路由中的menu属性 判断当前用户的菜单中是否有此路由
 * @param roles 用户的权限菜单
 * @param route 路由
 */
function hasPermission(roles, route) {
  if (route.menu) {
    var re = roles.some(role => {
      // console.log('dsds倒萨')
      // console.log(route.menu)
      // console.log(route.menu === '**' || route.menu === role)
      return route.menu === '**' || route.menu === role
    })
    if (re && route.meta) {
      route.meta.menu = route.menu
    }
    return re
  } else {
    return false
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers.concat(constantRouterMap)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        // console.log("判断")
        // console.log(roles)
        if (roles !== undefined) {
        //   accessedRouters = asyncRouterMap
        // } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        // alert(accessedRouters[0].children.length)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
