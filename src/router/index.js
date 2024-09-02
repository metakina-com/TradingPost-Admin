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
    },
    // {
    //   path: '/partner',
    //   name: 'Partner',
    //   component: () => import('@/views/user/partner/index'),
    //   meta: { title: '合伙人管理', icon: 'el-icon-s-check' }
    // }
    {
      path: '/userassets',
      name: 'Userassets',
      component: () => import('@/views/user/user_assets/index'),
      meta: { title: '用户资产', icon: 'el-icon-coin' }
    },
    {
      path: '/usertree',
      name: 'Usertree',
      component: () => import('@/views/user/user_tree/index'),
      meta: { title: '用户层级关系', icon: 'el-icon-s-unfold' }
    },
    {
      path: '/tree',
      name: 'Tree',
      component: () => import('@/views/user/tree/index'),
      meta: { title: '用户层级树', icon: 'el-icon-s-operation' }
    },
    {
      path: '/realname',
      name: 'realname',
      component: () => import('@/views/user/realname/index'),
      meta: { title: '实名审核', icon: 'el-icon-s-check' }
    },
    ]
  },

  {
    path: '/wallet',
    component: Layout,
    redirect: '/wallet',
    meta: { title: '钱包管理', icon: 'el-icon-s-finance' },
    children: [{
      path: '/wallet_list',
      name: 'Wallet',
      component: () => import('@/views/wallet/wallet_list/index'),
      meta: { title: '钱包管理', icon: 'el-icon-s-finance' }
    },
    {
      path: '/user_address',
      name: 'userAddress',
      component: () => import('@/views/wallet/user_address/index'),
      meta: { title: '用户地址', icon: 'el-icon-wallet' }
    },
    ]
  },

  {
    path: '/commission',
    component: Layout,
    redirect: '/commission',
    meta: { title: '佣金管理', icon: 'el-icon-s-management' },
    children: [{
      path: 'broker',
      name: 'Broker',
      component: () => import('@/views/commission/broker_list/index'),
      meta: { title: '佣金明细', icon: 'el-icon-money' }
    },
    {
      path: 'all_broker',
      name: 'AllBroker',
      component: () => import('@/views/commission/all_broker/index'),
      meta: { title: '返佣汇总', icon: 'el-icon-money' }
    },
    {
      path: 'yes_broker',
      name: 'YesBroker',
      component: () => import('@/views/commission/yesterday_broker/index'),
      meta: { title: '昨日返佣', icon: 'el-icon-s-marketing' }
    },
    ]
  },
  
  {
    path: '/contract',
    component: Layout,
    redirect: '/chicang',
    meta: {
      title: '合约系统', icon: 'el-icon-folder-opened'
    },
    children: [
      
      {
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
        path: '/historyEntrust',
        name: 'historyEntrust',
        component: () => import('@/views/contract/historyEntrust/index'),
        meta: { title: '历史委托', icon: 'el-icon-document' }
      }, {
        path: '/history',
        name: 'History',
        component: () => import('@/views/contract/history/index'),
        meta: { title: '历史记录', icon: 'el-icon-document' }
      },{
        path: '/leverage',
        name: 'Leverage',
        component: () => import('@/views/contract/leverage/index'),
        meta: { title: '杠杆配置', icon: 'el-icon-notebook-2' }
      },{
        path: '/transactionpairs',
        name: 'Transactionpairs',
        component: () => import('@/views/contract/transactionpairs/index'),
        meta: { title: '合约交易对配置', icon: 'el-icon-notebook-2' }
      },{
        path: '/parameter',
        name: 'Parameter',
        component: () => import('@/views/contract/parameter/index'),
        meta: { title: '参数配置', icon: 'el-icon-notebook-2' }
      },
      {
        path: '/robot',
        name: 'Robot',
        component: () => import('@/views/contract/robot/index'),
        meta: { title: '机器人配置', icon: 'el-icon-s-operation' }
      },
      {
        path: '/step_slippage',
        name: 'StepSlippage',
        component: () => import('@/views/contract/step_slippage/index'),
        meta: { title: '阶梯滑点', icon: 'el-icon-s-operation' }
      },]
  },
  {
    path: '/fnancialmanagement',
    component: Layout,
    redirect: '/fnancialmanagement',
    meta: { title: '理财管理', icon: 'el-icon-s-ticket' },
    children: [{
      path: 'broker',
      name: 'Broker',
      component: () => import('@/views/fnancialmanagement/index'),
      meta: { title: '理财设置', icon: 'el-icon-money' }
    },
    ]
  },
 
  // {
  //   path: '/follow',
  //   component: Layout,
  //   redirect: '/follow',
  //   meta: {
  //     title: '合约跟单系统', icon: 'el-icon-folder'
  //   },
  //   children: [
  //     {
  //       path: '/follow_apply',
  //       name: 'followApply',
  //       component: () => import('@/views/follow/apply/index'),
  //       meta: { title: '交易员申请', icon: 'el-icon-user' }
  //     },
  //     {
  //       path: '/follow_chicang',
  //       name: 'followChicang',
  //       component: () => import('@/views/follow/chicang/index'),
  //       meta: { title: '跟单持仓', icon: 'el-icon-document-checked' }
  //     }, {
  //       path: '/follow_entrust',
  //       name: 'followEntrust',
  //       component: () => import('@/views/follow/entrust/index'),
  //       meta: { title: '跟单委托', icon: 'el-icon-tickets' }
  //     }, {
  //       path: '/follow_history_entrust',
  //       name: 'followHistoryEntrust',
  //       component: () => import('@/views/follow/historyEntrust/index'),
  //       meta: { title: '历史委托', icon: 'el-icon-document' }
  //     }, {
  //       path: '/follow_history',
  //       name: 'followHistory',
  //       component: () => import('@/views/follow/history/index'),
  //       meta: { title: '历史记录', icon: 'el-icon-document' }
  //     }, {
  //       path: '/income',
  //       name: 'income',
  //       component: () => import('@/views/follow/income/index'),
  //       meta: { title: '交易员收益', icon: 'el-icon-document' }
  //     }]
  // },
  {
    path: '/pin',
    component: Layout,
    redirect: '/pin',
    meta: {
      title: '插针管理', icon: 'el-icon-folder'
    },
    children: [
      {
        path: '/pin',
        name: 'pin',
        component: () => import('@/views/pin-management/index'),
        meta: { title: '插针管理', icon: 'el-icon-user' }
      },
      ]
  },
  {
    path: '/option',
    component: Layout,
    redirect: '/option',
    children: [{
      path: 'option',
      name: 'option',
      component: () => import('@/views/option/index'),
      meta: { title: '期权交易', icon: 'el-icon-s-marketing' }
    }]
  },
  {
    path: '/legalcurrency',
    component: Layout,
    redirect: '/legalcurrency',
    children: [{
      path: 'legalcurrency',
      name: 'legalcurrency',
      component: () => import('@/views/legalcurrency/index'),
      meta: { title: '法币交易', icon: 'el-icon-s-check' }
    }]
  },
  /* new */
  {
    path: '/follow',
    component: Layout,
    redirect: '/follow',
    meta: {
      title: '合约跟单系统', icon: 'el-icon-folder'
    },
    children: [
      {
        path: '/follow_apply',
        name: 'followApply',
        component: () => import('@/views/follow/apply/index'),
        meta: { title: '交易员申请', icon: 'el-icon-user' }
      },
      {
        path: '/follow_chicang',
        name: 'followChicang',
        component: () => import('@/views/follow/chicang/index'),
        meta: { title: '跟单持仓', icon: 'el-icon-document-checked' }
      }, {
        path: '/follow_entrust',
        name: 'followEntrust',
        component: () => import('@/views/follow/entrust/index'),
        meta: { title: '跟单委托', icon: 'el-icon-tickets' }
      }, {
        path: '/follow_history_entrust',
        name: 'followHistoryEntrust',
        component: () => import('@/views/follow/historyEntrust/index'),
        meta: { title: '历史委托', icon: 'el-icon-document' }
      }, {
        path: '/follow_history',
        name: 'followHistory',
        component: () => import('@/views/follow/history/index'),
        meta: { title: '历史记录', icon: 'el-icon-document' }
      }, {
        path: '/income',
        name: 'income',
        component: () => import('@/views/follow/income/index'),
        meta: { title: '交易员收益', icon: 'el-icon-document' }
      }]
  },
  {
    path: '/qihuo',
    component: Layout,
    redirect: '/chicang',
    meta: {
      title: '期权系统', icon: 'el-icon-folder-opened'
    },
    children: [

      {
        path: '/QHchicang',
        name: 'QHchicang',
        component: () => import('@/views/qihuo/chicang/index'),
        meta: { title: '交割订单', icon: 'el-icon-document-checked' }
      },
     
      {
        path: '/QHhistory',
        name: 'QHHistory',
        component: () => import('@/views/qihuo/history/index'),
        meta: { title: '交割历史', icon: 'el-icon-document' }
      },
    //  {
    //     path: '/QHuser',
    //     name: 'QHuser',
    //     component: () => import('@/views/qihuo/QHuser/index'),
    //     meta: { title: '用户列表', icon: 'el-icon-document' }
    //   },
    ]
  },
  /*  */
  {
    path: '/bibi',
    component: Layout,
    redirect: '/bibi',
    meta: {
      title: '币币系统', icon: 'el-icon-c-scale-to-original'
    },
    children: [
      {
        path: '/bibiEntrust',
        name: 'BibiEntrust',
        component: () => import('@/views/bibi/entrust/index'),
        meta: { title: '当前委托', icon: 'el-icon-tickets' }
      },
      {
        path: '/bibiHistory',
        name: 'BibiHistory',
        component: () => import('@/views/bibi/history/index'),
        meta: { title: '历史委托', icon: 'el-icon-document' }
      },
      // {
      //   path: '/Historys',
      //   name: 'Historys',
      //   component: () => import('@/views/bibi/historys/index'),
      //   meta: { title: '历史记录', icon: 'el-icon-document' }
      // },
      ]
  },
  {
    path: '/assets',
    component: Layout,
    redirect: '/recharge',
    meta: { title: '出入金统计', icon: 'el-icon-s-order' },
    children: [
      {
        path: '/check',
        name: 'Check',
        component: () => import('@/views/assets/withdrawal_check/index'),
        meta: { title: '提币审核', icon: 'el-icon-upload2' }
      },
      // {
      //   path: '/recharge',
      //   name: 'Recharge',
      //   component: () => import('@/views/assets/recharge/index'),
      //   meta: { title: '充币审核', icon: 'el-icon-refresh' }
      // },
      {
        path: '/withdrawal',
        name: 'Withdrawal',
        component: () => import('@/views/assets/withdrawal/index'),
        meta: { title: '提币明细', icon: 'el-icon-printer' }
      },
      {
        path: '/charging',
        name: 'charging',
        component: () => import('@/views/assets/withdrawal/charging'),
        meta: { title: '充币明细', icon: 'el-icon-printer' }
      },
      {
        path: '/transfer',
        name: 'Transfer',
        component: () => import('@/views/assets/transfer/index'),
        meta: { title: '划转记录', icon: 'el-icon-aim' }
      }]
  },
  {
    path: '/risk',
    component: Layout,
    redirect: '/risk',
    meta: { title: '风控管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: '/risk_con',
        name: 'Risk',
        component: () => import('@/views/risk_control/risk/index'),
        meta: { title: '风控管理', icon: 'el-icon-refresh' }
      },
      {
        path: '/risk_ping',
        name: 'Risk_ping',
        component: () => import('@/views/risk_control/risk_feng/index'),
        meta: { title: '开平仓时间', icon: 'el-icon-aim' }
      },
    ]
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
	{
	    path: '/system',
	    component: Layout,
	    redirect: '/systemslist',
	    meta: {
	      title: '系统设置',
	      icon: 'el-icon-setting'
	    },
	    children: [
	      {
	        path: '/systems',
	        name: 'System',
	        component: () => import('@/views/system/system/index'),
	        meta: {
	          title: '轮播图管理',
	          icon: 'el-icon-picture-outline'
	        }
	      },
	      {
	        path: '/notice',
	        name: 'Notice',
	        component: () => import('@/views/system/notice/index'),
	        meta: {
	          title: '公告',
	          icon: 'el-icon-document-checked'
	        }
	      },
        {
	        path: '/customerservice',
	        name: 'Customerservice',
	        component: () => import('@/views/system/customerservice/index'),
	        meta: {
	          title: '客服咨询',
	          icon: 'el-icon-phone-outline'
	        }
	      }
	
	
	    ]
	  },

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
