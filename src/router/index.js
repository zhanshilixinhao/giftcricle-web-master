import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {path: '/401', component: () => import('@/views/401'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/roleList',
    name: 'permission',
    menu: 'permission',
    meta: {title: '权限管理', icon: 'example'},
    children:
      [
        {
          path: 'roleList',
          name: '角色管理',
          component: () => import('@/views/permission/roleList'),
          menu: 'role_list',
          meta: {title: '角色管理', icon: 'example'}
        },
        {
          path: 'roleAdd',
          name: '添加角色',
          hidden: true,
          component: () => import('@/views/permission/roleAdd'),
          menu: 'role_add',
          meta: {title: '添加角色', icon: 'example'}
        },
        {
          path: 'roleEdit/:id',
          name: '修改角色',
          hidden: true,
          component: () => import('@/views/permission/roleEdit'),
          menu: 'role_edit',
          meta: {title: '修改角色', icon: 'example'}
        },
        {
          path: 'list',
          name: '后台用户管理',
          component: () => import('@/views/webUser/list'),
          menu: 'web_user_list',
          meta: {title: '后台用户管理', icon: 'example'}
        },
        {
          path: 'add',
          name: '后台用户添加',
          hidden: true,
          component: () => import('@/views/webUser/add'),
          menu: 'web_user_add',
          meta: {title: '后台用户添加', icon: 'example'}
        },
        {
          path: 'edit/:id',
          name: '后台用户修改',
          hidden: true,
          component: () => import('@/views/webUser/edit'),
          menu: 'web_user_edit',
          meta: {title: '后台用户修改', icon: 'example'}
        }
      ]
  },
  {
    path: '/appUser',
    component: Layout,
    redirect: '/appUser/list',
    name: 'appUser',
    menu: 'appUser',
    meta: {title: 'APP用户管理', icon: 'example'},
    children:
      [
        {
          path: 'list',
          name: 'APP用户管理',
          component: () => import('@/views/appUser/list'),
          menu: 'appUser_list',
          meta: {title: 'APP用户管理', icon: 'example'}
        },
        {
          path: 'tag',
          name: '印象标签管理',
          component: () => import('@/views/appUserTag/tag'),
          menu: 'appUser_tag',
          meta: {title: '印象标签管理', icon: 'example'}
        },
        {
          path: 'giftPre',
          name: '礼物偏好管理',
          component: () => import('@/views/appUserPre/giftPre'),
          menu: 'gift_pre',
          meta: { title: '礼物偏好管理', icon: 'example' }
        },
        {
          path: 'event',
          name: '送礼事件管理',
          component: () => import('@/views/appUserEvent/event'),
          menu: 'event',
          meta: { title: '送礼事件管理', icon: 'example' }
        }
      ]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/list',
    name: 'banner',
    menu: 'banner',
    meta: { title: '内容管理', icon: 'example' },
    children:
      [
        { path: 'list', name: '首页横幅管理', component: () => import('@/views/banner/list'), menu: 'banner_list', meta: { title: '首页横幅管理', icon: 'example' }},
        { path: 'add', name: '添加横幅', hidden: true, component: () => import('@/views/banner/add'), menu: 'banner_add', meta: { title: '添加横幅', icon: 'example' }},
        { path: 'edit/:id', name: '横幅修改', hidden: true, component: () => import('@/views/banner/edit'), menu: 'banner_edit', meta: { title: '横幅修改', icon: 'example' }},
        // {
        //   path: 'list',
        //   name: '文章管理',
        //   component: () => import('@/views/article/list'),
        //   menu: 'article_list',
        //   meta: { title: '文章管理', icon: 'example' }
        // },
        // {
        //   path: 'add',
        //   name: '文章添加',
        //   hidden: true,
        //   component: () => import('@/views/article/add'),
        //   menu: 'article_add',
        //   meta: { title: '文章添加', icon: 'example' }
        // },
        // {
        //   path: 'edit/:id',
        //   name: '文章修改',
        //   hidden: true,
        //   component: () => import('@/views/article/edit'),
        //   menu: 'article_edit',
        //   meta: { title: '文章修改', icon: 'example' }
        // },
        {
          path: 'list2',
          name: '首页节日管理',
          component: () => import('@/views/banner/fastivalList'),
          menu: 'festival_list',
          meta: { title: '首页节日管理', icon: 'example' }
        },
        {
          path: 'memo',
          name: '备忘录节日事件',
          component: () => import('@/views/banner/memo/list'),
          menu: 'memo_festival',
          meta: { title: '备忘录节日事件', icon: 'example' }
        },
        {
          path: 'memoAdd',
          name: '添加备忘录节日事件',
          component: () => import('@/views/banner/memo/add'),
          hidden: 'true',
          menu: 'memo_festival_add',
          meta: { title: '添加备忘录节日事件', icon: 'example' }
        },
        {
          path: 'memoEdit/:id',
          name: '修改备忘录节日事件',
          component: () => import('@/views/banner/memo/edit'),
          hidden: 'true',
          menu: 'memo_festival_edit',
          meta: { title: '修改备忘录节日事件', icon: 'example' }
        },
        {
          path: 'welfare',
          name: '整点福利',
          component: () => import('@/views/banner/welfare/list'),
          menu: 'welfare_list',
          meta: { title: '福利管理', icon: 'example' }
        },
        {
          path: 'welfareAdd',
          name: '添加整点福利',
          hidden: 'true',
          component: () => import('@/views/banner/welfare/add'),
          menu: 'welfare_add',
          meta: { title: '添加福利', icon: 'example' }
        },
        {
          path: 'welfareEdit/:id',
          name: '整点福利',
          hidden: 'true',
          component: () => import('@/views/banner/welfare/edit'),
          menu: 'welfare_edit',
          meta: { title: '修改福利', icon: 'example' }
        },
        // {
        //   path: 'recommend',
        //   name: '今日推荐',
        //   component: () => import('@/views/recommend/recommend'),
        //   menu: 'recommend_list',
        //   meta: { title: '今日推荐', icon: 'example' }
        // }
      ]
  },
  {
    path: '/memberCard',
    component: Layout,
    redirect: '/memberCard/list',
    name: 'memberCard',
    menu: 'memberCard',
    meta: { title: '会员卡系统', icon: 'example' },
    children:
      [
        { path: 'list', name: '门店信息', component: () => import('@/views/memberCard/storeList'), menu: 'store_list', meta: { title: '门店信息', icon: 'example' }},
        // { path: 'edit/:id', name: '横幅修改', hidden: true, component: () => import('@/views/banner/edit'), menu: 'banner_edit', meta: { title: '横幅修改', icon: 'example' }},
        {
          path: 'list2',
          name: '会员卡信息',
          component: () => import('@/views/memberCard/cardList'),
          menu: 'card_list',
          meta: { title: '会员卡信息', icon: 'example' }
        },
        { path: 'addCard', name: 'addCard',  hidden: true, component: () => import('@/views/memberCard/addCard'), menu: 'add_card', meta: { title: '添加会员卡', icon: 'example' }},
        {
          path: 'list3',
          name: '活动列表',
          component: () => import('@/views/memberCard/eventList'),
          menu: 'event_list',
          meta: { title: '活动列表', icon: 'example' }
        },
        { path: 'addEvent', name: 'addEvent',  hidden: true, component: () => import('@/views/memberCard/addEvent'), menu: 'add_event', meta: { title: '添加活动', icon: 'example' }},
        {
          path: 'list4',
          name: '会员信息',
          component: () => import('@/views/memberCard/userCard'),
          menu: 'user_card',
          meta: { title: '会员信息', icon: 'example' }
        },
        // {
        //   path: 'list5',
        //   name: '会员卡用户1',
        //   component: () => import('@/views/memberCard/storeCard'),
        //   menu: 'store_card',
        //   meta: { title: '会员卡用户1', icon: 'example' }
        // },
        // {
        //   path: 'list6',
        //   name: '会员卡信息1',
        //   component: () => import('@/views/memberCard/cardList1'),
        //   menu: 'card_list1',
        //   meta: { title: '会员卡信息1', icon: 'example' }
        // },
        {
          path: 'list7',
          name: '统计',
          component: () => import('@/views/memberCard/statistics/turnover'),
          menu: 'turnover',
          meta: { title: '统计', icon: 'example' }
        },
        {
          path: 'list8',
          name: '充值记录',
          hidden: true,
          component: () => import('@/views/memberCard/statistics/chargeList'),
          menu: 'charge_list',
          meta: { title: '充值记录', icon: 'example' }
        },
        {
          path: 'list9',
          hidden: true,
          component: () => import('@/views/memberCard/statistics/expense'),
          menu: 'expense_list',
          meta: { title: '消费记录', icon: 'example' }
        },
        {
          path: 'list10',
          hidden: true,
          component: () => import('@/views/memberCard/statistics/refund'),
          menu: 'refund_list',
          meta: { title: '退款记录', icon: 'example' }
        },{
          path: 'list11',
          hidden: true,
          component: () => import('@/views/memberCard/statistics/transfer'),
          menu: 'transfer_list',
          meta: { title: '转赠记录', icon: 'example' }
        },
      ]
  },
  /***********************************商家会员***************************************/
  {
    path: '/storeInfo', component: Layout, redirect: '/storeInfo/list', name: 'storeInfo', menu: 'storeInfo', meta: { title: '门店信息', icon: 'example' },
    children:
      [
        { path: 'list', name: '门店信息', component: () => import('@/views/memberCard/storeList1'),
          menu: 'store_info', meta: { title: '门店信息', icon: 'example' }},
      ]
  },
  {
    path: '/cardInfo', component: Layout, redirect: '/cardInfo/list', name: 'cardInfo', menu: 'cardInfo', meta: { title: '会员卡信息', icon: 'example' },
    children:
      [
        { path: 'list', name: '会员卡信息', component: () => import('@/views/memberCard/cardListshanjia'),
          menu: 'card_info', meta: { title: '会员卡信息', icon: 'example' }},
        { path: 'addCard', name: 'addCard',  hidden: true, component: () => import('@/views/memberCard/addCard'),
          menu: 'add_card1', meta: { title: '添加会员卡', icon: 'example' }},


        {
          path: 'list2',
          name: '门店会员卡信息',
          component: () => import('@/views/memberCard/cardList1'),
          menu: 'card_list1',
          meta: { title: '门店会员卡信息', icon: 'example' }
        },
      ]
  },

  {
    path: '/couponInfo', component: Layout, redirect: '/couponInfo/list', name: 'couponInfo', menu: 'couponInfo', meta: { title: '优惠券', icon: 'example' },
    children:
      [
        { path: 'list', name: '优惠券列表', component: () => import('@/views/memberCard/elCoupon/list'),
          menu: 'coupon_info', meta: { title: '优惠券列表', icon: 'example' }},
        { path: 'list1', name: '赠送记录', component: () => import('@/views/memberCard/elCoupon/user'),
          menu: 'user_info', meta: { title: '赠送记录', icon: 'example' }},
        { path: 'list3', name: '核销记录', component: () => import('@/views/memberCard/elCoupon/employ'),
          menu: 'coupon_use_log', meta: { title: '核销记录', icon: 'example' }},
        { path: 'list4', name: '用户转赠记录', component: () => import('@/views/memberCard/elCoupon/sendFriend'),
          menu: 'send_info', meta: { title: '用户转赠记录', icon: 'example' }},
        { path: 'coupon_list', name: '优惠券礼包管理', component: () => import('@/views/memberCard/elCoupon/couponList'),
          menu: 'party_pack' , meta: { title: '优惠券礼包管理',icon: 'example'}},
        { path: 'share_coupon', name: '分享券管理', component: () => import('@/views/memberCard/elCoupon/ShareCoupon'),
          menu: 'share_coupon' , meta: { title: '分享券管理',icon: 'example'}},
        { path: 'list5', name: '分享券核销记录', component: () => import('@/views/memberCard/elCoupon/ShareCouponEmploy'),
          menu: 'share_coupon_log' , meta: { title: '分享券核销记录',icon: 'example'}},
        { path: 'rebate_coupon', name: '砍价管理', component: () => import('@/views/memberCard/elCoupon/RebateCoupon'),
          menu: 'rebate_coupon_manage' , meta: { title: '砍价管理',icon: 'example'}},
      ]
  },
  {
    path: '/eventInfo', component: Layout, redirect: '/eventInfo/list', name: 'eventInfo', menu: 'eventInfo', meta: { title: '活动列表', icon: 'example' },
    children:
      [
        {
          path: 'list',
          name: '活动列表',
          component: () => import('@/views/memberCard/eventListshanjia'),
          menu: 'event_info',
          meta: { title: '活动列表', icon: 'example' }
        },
        { path: 'addEvent', name: 'addEvent',  hidden: true, component: () => import('@/views/memberCard/addEvent'),
          menu: 'add_event1', meta: { title: '添加活动', icon: 'example' }},
      ]
  },
  {
    path: '/userCardInfo', component: Layout, redirect: '/userCardInfo/list', name: 'userCardInfo', menu: 'userCardInfo', meta: { title: '会员信息', icon: 'example' },
    children:
      [
        {
          path: 'list',
          name: '会员信息',
          component: () => import('@/views/memberCard/userCard'),
          menu: 'user_card_info',
          meta: { title: '会员信息', icon: 'example' }
        },
        {
          path: 'list2',
          name: '门店会员信息',
          component: () => import('@/views/memberCard/storeCard'),
          menu: 'store_card',
          meta: { title: '门店会员信息', icon: 'example' }
        },
      ]
  },


  {
    path: '/merchantStatistics', component: Layout, redirect: '/merchantStatistics/list', name: 'merchantStatistics', menu: 'merchantStatistics', meta: { title: '统计', icon: 'example' },
    children:
      [
        { path: 'list', name: '收入营销统计', component: () => import('@/views/memberCard/statistics/turnover'),
          menu: 'turnover_merchant', meta: { title: '收入营销统计', icon: 'example' }},

        { path: 'list1', name: '收入营销统计', component: () => import('@/views/memberCard/statistics/turnoverStore'),
          menu: 'turnover_store', meta: { title: '收入营销统计', icon: 'example' }},

        { path: 'list2', name: '充值记录', component: () => import('@/views/memberCard/statistics/chargeList1'),
          menu: 'charge_merchant', meta: { title: '充值记录', icon: 'example' }},

        { path: 'list3', name: '消费记录', component: () => import('@/views/memberCard/statistics/expense1'),
          menu: 'expense_merchant', meta: { title: '消费记录', icon: 'example' }},

        { path: 'list4', name: '退款记录', component: () => import('@/views/memberCard/statistics/refund'),
          menu: 'refund_merchant', meta: { title: '退款记录 ', icon: 'example' }},

        { path: 'list5', name: '转增记录', component: () => import('@/views/memberCard/statistics/transfer'),
          menu: 'transfer_merchant', meta: { title: '转赠记录 ', icon: 'example' }},
      ]
  },

  {
    path: '/openCard', component: Layout, redirect: '/openCard/list', name: 'openCard', menu: 'openCard', meta: { title: '开卡', icon: 'example' },
    children:
      [
        {
          path: 'list',
          name: '开卡',
          component: () => import('@/views/memberCard/openCard'),
          menu: 'open_card',
          meta: { title: '开卡', icon: 'example' }
        }
      ]
  },

  {
    path: '/chargeHandle', component: Layout, redirect: '/chargeHandle/list', name: 'chargeHandle', menu: 'chargeHandle', meta: { title: '充值', icon: 'example' },
    children:
      [
        {
          path: 'list',
          name: '充值',
          component: () => import('@/views/memberCard/chargeHandle'),
          menu: 'charge_handle',
          meta: { title: '充值', icon: 'example' }
        }
      ]
  },


  {
    path: '/expenseHandle', component: Layout, redirect: '/expenseHandle/list', name: 'expenseHandle', menu: 'expenseHandle', meta: { title: '消费', icon: 'example' },
    children:
      [
        {
          path: 'list',
          name: '消费',
          component: () => import('@/views/memberCard/expenseHandle'),
          menu: 'expense_handle',
          meta: { title: '消费', icon: 'example' }
        }
      ]
  },

  /***********************************商家会员***************************************/


  {
    path: '/article', component: Layout, redirect: '/article/list', name: 'article', menu: 'article', meta: { title: '文章管理', icon: 'example' },
    children:
      [
        { path: 'list', name: '文章管理', component: () => import('@/views/article/list'), menu: 'article_list', meta: { title: '文章管理', icon: 'example' }},
        { path: 'add', name: '文章添加', hidden: true, component: () => import('@/views/article/add'), menu: 'article_add', meta: { title: '文章添加', icon: 'example' }},
        { path: 'edit/:id', name: '文章修改', hidden: true, component: () => import('@/views/article/edit'), menu: 'article_edit', meta: { title: '文章修改', icon: 'example' }},
        { path: 'list2', name: '文章场景', component: () => import('@/views/article/sceneList'), menu: 'scene_list', meta: { title: '文章场景', icon: 'example' }},
        { path: 'list3', name: '文章节日', component: () => import('@/views/article/festivalList'), menu: 'article_festival_list', meta: { title: '文章节日', icon: 'example' }},
        { path: 'list4', name: '文章对象', component: () => import('@/views/article/labelList'), menu: 'article_label_list', meta: { title: '文章对象', icon: 'example' }}
      ]
  },
  {
    path: '/coupon',
    component: Layout,
    redirect: '/coupon/list',
    name: 'gift',
    menu: 'coupon',
    meta: {title: '商户管理', icon: 'example'},
    children:
      [
        {
          path: 'list',
          name: '优惠券管理',
          component: () => import('@/views/coupon/list'),
          menu: 'coupon_list',
          meta: {title: '优惠券管理', icon: 'example'}
        },
        {
          path: 'list1',
          name: '优惠券赠送记录',
          component: () => import('@/views/coupon/sendList.vue'),
          menu: 'send_list',
          meta: {title: '优惠券赠送记录', icon: 'example'}
        },
        {
          path: 'list2',
          name: '优惠券使用记录',
          component: () => import('@/views/coupon/useList.vue'),
          menu: 'use_list',
          meta: {title: '优惠券使用记录', icon: 'example'}
        },
        {
          path: 'admin_wallet',
          name: '账户资金',
          component: () => import('@/views/coupon/wallet'),
          menu: 'admin_wallet',
          meta: {title: '账户资金', icon: 'example'}
        }
      ]
  },
  {
    path: '/item',
    component: Layout,
    redirect: 'noredirect',
    name: 'item',
    menu: 'item',
    meta: {title: '商品管理', icon: 'example'},
    children:
      [
        {
          path: 'itemCate',
          name: '分类管理',
          component: () => import('@/views/itemCate/itemCate'),
          menu: 'item_cate',
          meta: {title: '分类管理', icon: 'example'}
        },
        {
          path: 'brand',
          name: '品牌管理',
          component: () => import('@/views/brand/brand'),
          menu: 'item_brand',
          meta: {title: '品牌管理', icon: 'example'}
        },
        {
          path: 'list',
          name: '商品管理',
          component: () => import('@/views/item/list'),
          menu: 'item_list',
          meta: {title: '商品管理', icon: 'example'}
        },
        {
          path: 'add',
          name: '商品添加',
          hidden: true,
          component: () => import('@/views/item/add'),
          menu: 'item_add',
          meta: {title: '商品添加', icon: 'example'}
        },
        {
          path: 'edit/:id',
          name: '商品修改',
          hidden: true,
          component: () => import('@/views/item/edit'),
          menu: 'item_edit',
          meta: {title: '商品修改', icon: 'example'}
        },
        {
          path: 'feature',
          name: '属性管理',
          component: () => import('@/views/item/feature'),
          menu: 'item_feature',
          meta: {title: '属性管理', icon: 'example'}
        },
        {
          path: 'group',
          name: '组合商品',
          hidden: true,
          component: () => import('@/views/item/group'),
          menu: 'item_group',
          meta: {title: '组合商品', icon: 'example'}
        },
        {
          path: 'skuList/:id',
          name: '组合商品列表',
          hidden: true,
          component: () => import('@/views/item/skuList'),
          menu: 'item_sku_list',
          meta: {title: '组合商品列表', icon: 'example'}
        },
        {
          path: 'skuEdit/:id',
          name: '组合商品编辑',
          hidden: true,
          component: () => import('@/views/item/skuEdit'),
          menu: 'item_sku_edit',
          meta: {title: '组合商品编辑', icon: 'example'}
        },
        {
          path: 'skuValueEdit/:id',
          name: '商品属性值管理',
          hidden: true,
          component: () => import('@/views/item/skuValueEdit'),
          menu: 'item_sku_value_edit',
          meta: {title: '商品属性值管理', icon: 'example'}
        }
      ]
  },
  {
    path: '/virtualItem',
    component: Layout,
    redirect: '/virtualItem/list',
    name: 'virtualItem',
    menu: 'virtual_item',
    meta: {title: '虚拟商品管理', icon: 'example'},
    children:
      [
        {
          path: 'category',
          name: '分类管理',
          component: () => import('@/views/virtualItem/category'),
          menu: 'virtual_item_cate',
          meta: {title: '分类管理', icon: 'example'}
        },
        {
          path: 'brand',
          name: '品牌管理',
          component: () => import('@/views/virtualItem/brand'),
          menu: 'virtual_item_brand',
          meta: {title: '品牌管理', icon: 'example'}
        },
        {
          path: 'list',
          name: '商品管理',
          component: () => import('@/views/virtualItem/list'),
          menu: 'virtual_item_list',
          meta: {title: '商品管理', icon: 'example'}
        },
        {
          path: 'add',
          name: '添加虚拟商品',
          hidden: true,
          component: () => import('@/views/virtualItem/add'),
          menu: 'virtual_item_add',
          meta: {title: '添加虚拟商品', icon: 'example'}
        },
        {
          path: 'edit/:id',
          name: '编辑虚拟商品',
          hidden: true,
          component: () => import('@/views/virtualItem/edit'),
          menu: 'virtual_item_edit',
          meta: {title: '编辑虚拟商品', icon: 'example'}
        }
      ]
  },
  {
    path: '/themeItem',
    component: Layout,
    redirect: '/themeItem/themeItem',
    name: 'themeItem',
    menu: 'theme_item',
    meta: {title: '主题商品管理', icon: 'example'},
    children:
      [
        {
          path: 'theme',
          name: '主题管理',
          component: () => import('@/views/themeItem/theme'),
          menu: 'theme_list',
          meta: {title: '主题管理', icon: 'example'}
        },
        {
          path: 'themeItem1',
          name: '商品管理',
          component: () => import('@/views/themeItem/themeItem'),
          menu: 'theme_item_list',
          meta: {title: '商品管理', icon: 'example'}
        }
      ]
  },
  {
    path: '/labelItem',
    component: Layout,
    redirect: '/labelItem/labelItem',
    name: 'labelItem',
    menu: 'label_item',
    meta: {title: '标签管理', icon: 'example'},
    children:
      [
        {
          path: 'label',
          name: '标签管理',
          component: () => import('@/views/labelItem/label'),
          menu: 'label_list',
          meta: {title: '标签管理', icon: 'example'}
        },
        {
          path: 'labelItem',
          name: '商品管理',
          component: () => import('@/views/labelItem/labelItem'),
          menu: 'label_item_list',
          meta: {title: '商品管理', icon: 'example'}
        }
      ]
  },
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/auth',
    name: 'merchant',
    menu: 'merchant',
    meta: {title: '商家列表', icon: 'example'},
    children:
      [
        {
          path: 'auth',
          name: '商家列表',
          component: () => import('@/views/merchant/auth'),
          menu: 'merchant_list',
          meta: {title: '商家列表', icon: 'example'}
        },
        {
          path: 'add',
          name: '商家申请',
          hidden: true,
          component: () => import('@/views/merchant/add'),
          menu: 'merchant_add',
          meta: {title: '商家申请', icon: 'example'}
        }
      ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/pushMsg',
    name: 'message',
    menu: 'message',
    meta: {title: '消息管理', icon: 'example'},
    children:
      [
        {
          path: 'appMessage',
          name: '系统通知',
          component: () => import('@/views/message/pushMsg'),
          menu: 'message_push',
          meta: {title: '系统通知', icon: 'example'}
        },
        {
          path: 'suggestion',
          name: '意见反馈',
          component: () => import('@/views/message/suggestion'),
          menu: 'message_suggestion',
          meta: {title: '意见反馈', icon: 'example'}
        }
      ]
  },
  {
    path: '/withdraw',
    component: Layout,
    redirect: '/withdraw/withdraw',
    name: 'withdraw',
    menu: 'withdraw',
    meta: {title: '提现管理', icon: 'example'},
    children:
      [
        {
          path: 'withdraw',
          name: 'APP提现管理',
          component: () => import('@/views/withdraw/withdraw'),
          menu: 'user_withdraw',
          meta: {title: 'APP提现管理', icon: 'example'}
        },
        {
          path: 'web_withdraw',
          name: '商家提现管理',
          component: () => import('@/views/withdraw/webWithdraw'),
          menu: 'web_withdraw',
          meta: {title: '商家提现管理', icon: 'example'}
        }
      ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/appUser/list',
    name: 'order',
    menu: 'order',
    meta: {title: '订单管理', icon: 'example'},
    children: [
      {
        path: 'list',
        menu: 'charge_order',
        name: '充值订单',
        component: () => import('@/views/order/chargeOrder'),
        meta: {title: '充值订单', icon: 'example'}
      },
      {
        path: 'tag',
        menu: 'item_order',
        name: '商品购买订单',
        component: () => import('@/views/order/itemOrder'),
        meta: {title: '商品购买订单', icon: 'example'}
      },
      {
        path: 'giftPre',
        menu: 'virtual_item_order',
        name: '虚拟商品订单',
        component: () => import('@/views/order/virItemOrder'),
        meta: {title: '虚拟商品订单', icon: 'example'}
      },
      {
        path: 'event',
        menu: 'consignment_item_order',
        name: '寄售台订单',
        component: () => import('@/views/order/conItemOrder'),
        meta: {title: '寄售台订单', icon: 'example'}
      },
      {
        path: 're',
        menu: 're_item_order',
        name: '商品提货订单',
        component: () => import('@/views/order/reItemOrder'),
        meta: {title: '商品提货订单', icon: 'example'}
      },
      {
        path: 'comment',
        menu: 're_item_comment',
        name: '提货订单评价',
        component: () => import('@/views/order/orderComment'),
        meta: {title: '提货订单评价', icon: 'example'}
      }
    ]
  },
  {
    path: '/discount',
    component: Layout,
    redirect: '/appUser/list',
    name: 'discount',
    menu: 'discount',
    meta: { title: '折现管理', icon: 'example' },
    children:
      [
        {
          path: 'list', name: 'app折现管理', component: () => import('@/views/discount/list'),
          menu: 'discount_list', meta: { title: 'app折现管理', icon: 'example' }
        },
        {
          path: 'list_wx', name: '小程序折现管理', component: () => import('@/views/discount/listWx'),
          menu: 'discount_list_wx', meta: { title: '小程序折现管理', icon: 'example' }
        }
      ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/statistics',
    name: 'statistics',
    menu: 'statistics',
    meta: {title: '数据统计', icon: 'example'},
    children:
      [
        {
          path: 'orderStatistics',
          name: '数据统计',
          component: () => import('@/views/statistics/orderStatistics'),
          menu: 'order_statistics',
          meta: {title: '订单统计', icon: 'example'}
        },
        {
          path: 'userStatistics',
          name: '用户统计',
          component: () => import('@/views/statistics/userStatistics'),
          menu: 'user_statistics',
          meta: {title: '用户统计', icon: 'example'}
        }
      ]
  },
  {
    path: '/version',
    component: Layout,
    redirect: '/app/version',
    name: 'version',
    menu: 'version',
    meta: { title: '安装包管理', icon: 'example' },
    children:
      [
        {
          path: 'appVersion',
          name: '安装包管理',
          component: () => import('@/views/version/version'),
          menu: 'appVersion',
          meta: { title: '安装包管理', icon: 'example' }
        }
      ]
  },
  {path: '*', redirect: '/404', menu: '**'}
]

