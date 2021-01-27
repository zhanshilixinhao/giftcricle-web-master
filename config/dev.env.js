'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  // BASE_API: '"https://45.40.206.174/web"',
  // BASE_IMAGES_API: '"https://45.40.206.174/static"',
  // BASE_API: '"http://localhost:8080"',
  // BASE_IMAGES_API: '"http://localhost:9528/static"',
  // BASE_API: '"https://io.shanren.group/web"',
  // BASE_IMAGES_API: '"https://io.shanren.group/static"',
  //BASE_API: '"http://lxhweb.com/web"',
  BASE_API: '"http://localhost:9002"',
  //BASE_API: '"http://lxhweb.com/web"',
  //BASE_IMAGES_API: '"http://localhost:8080"',
   //BASE_API: '"https://liyuquan.cn/web"',
   BASE_IMAGES_API: '"https://liyuquan.cn/static"',
})
