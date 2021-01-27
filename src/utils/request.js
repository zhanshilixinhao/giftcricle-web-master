import Vue from 'vue'
import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import { getToken, createV } from '@/utils/auth'
import { objKeySort } from '@/utils/validate'
import store from '../store'
import { MessageBox } from 'element-ui'
import Qs from 'qs'

var MD5 = require('md5.js')

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 300000, // 请求超时时间
  transformRequest: [function(data) {
    // 得到当前页面的menu方法,用于做权限控制，现不用
    // alert(store.getters.menuUrl + '111111')
    // alert(store.getters.addRouters)
    // var route = store.getters.addRouters
    // for (var i = 0; i < route.length; i++) {
    //   var path1 = route[i].path + '/'
    //   for (var j = 0; j < route[i].children.length; j++) {
    //     var path2 = route[i].children[j].path
    //     path2 = path2.split(':')[0]
    //     var path = path1 + path2
    //     if (path === store.getters.menuUrl) {
    //       alert(route[i].children[j].menu)
    //       break
    //     }
    //   }
    // }
    // 用于处理将表单对象 变成 字符串 才会变成正常的传值方式
    let ret = ''
    var to = getToken()
    if (!to) {
      to = new Date().getTime()
    }
    if (!data) data = {}
    data.token = to
    data.u = new Date().getTime() + ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    let ret1 = ''
    data = objKeySort(data)
    for (let it in data) {
      ret1 += it + '=' + data[it] + '&'
    }
    ret1 += 'f=' + createV()
    ret += 'v=' + new MD5().update(ret1).digest('hex').toUpperCase()
    return ret
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    // 'version': 'dev'
  }
})

// request拦截器
// service.interceptors.request.use(config => {
//   // if (store.getters.token) {
//   //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   // }
//   config.data = Qs.stringify(config.data)
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.errCode !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      if (res.errCode === 1002 || res.errCode === 3 || res.errCode === 5) {
        if (res.errCode === 1002) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }// location.reload()
      } else if (res.errCode === 1003) {
        return response
      }
      return Promise.reject('error')
    } else {
      return response
    }
  },
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload()// 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error)// for debug
    // 刷新浏览器报错这里
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // alert('111')
    return Promise.reject(error)
  }
)
Vue.prototype.$http = service
export default service
