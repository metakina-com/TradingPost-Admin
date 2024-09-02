import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/group',
    children: [{
      path: 'group',
      name: 'Group',
      component: () => import('@/views/group/index'),
      meta: { title: '团队数据', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/userlist',
    meta: { title: '用户管理', icon: 'el-icon-s-custom' },
    children: [{
      path: '/userlist',
      name: 'Userlist',
      component: () => import('@/views/user/user/index'),
      meta: { title: '用户管理', icon: 'user' }
    }, {
      path: '/partner',
      name: 'Partner',
      component: () => import('@/views/user/partner/index'),
      meta: { title: '合伙人管理', icon: 'el-icon-s-check' }
    }]
  },
  {
    path: '/commission',
    component: Layout,
    redirect: '/commission',
    children: [{
      path: 'commission',
      name: 'Commission',
      component: () => import('@/views/commission/index'),
      meta: { title: '佣金明细', icon: 'el-icon-money' }
    }]
  },
  {
    path: '/contract',
    component: Layout,
    redirect: '/chicang',
    meta: {
      title: '合约系统', icon: 'el-icon-folder-opened'
    },
    children: [{
      path: '/chicang',
      name: 'Chicang',
      component: () => import('@/views/contract/chicang/index'),
      meta: { title: '当前持仓', icon: 'el-icon-document-checked' }
    }, {
      path: '/entrust',
      name: 'Entrust',
      component: () => import('@/views/contract/entrust/index'),
      meta: { title: '当前委托', icon: 'el-icon-tickets' }
    }, {
      path: '/history',
      name: 'History',
      component: () => import('@/views/contract/history/index'),
      meta: { title: '历史委托', icon: 'el-icon-document' }
    }, {
      path: '/userassets',
      name: 'Userassets',
      component: () => import('@/views/contract/userAssets/index'),
      meta: { title: '用户资产', icon: 'el-icon-coin' }
    }]
  },
  {
    path: '/assets',
    component: Layout,
    redirect: '/recharge',
    meta: { title: '出入金统计', icon: 'el-icon-s-order' },
    children: [{
      path: '/recharge',
      name: 'Recharge',
      component: () => import('@/views/assets/recharge/index'),
      meta: { title: '充币提币', icon: 'el-icon-refresh' }
    },
    {
      path: '/withdrawal',
      name: 'Withdrawal',
      component: () => import('@/views/assets/withdrawal/index'),
      meta: { title: '充币提币明细', icon: 'el-icon-printer' }
    }]
  },
  

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
