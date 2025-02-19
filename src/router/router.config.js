export const innerRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard/Index.vue'),
    meta: {
      title: '首页看板',
      icon: 'iconfont icon-dashboard',
      keepAlive: true
    }
  },
  {
    path: '/blogList',
    name: 'blogList',
    component: () => import('@/views/BlogList/index.vue'),
    meta: {
      title: '博客列表',
      icon: 'iconfont icon-dashboard',
      keepAlive: true
    }
  },
  {
    path: '/myblog',
    name: 'myblog',
    component: () => import('@/views/BlogList/myblog.vue'),
    meta: {
      title: '我的博客',
      icon: 'iconfont icon-dashboard',
      keepAlive: true
    }
  },
  {
    path: '/blogDetail/:id',
    name: 'blogDetail',
    component: () => import('@/views/BlogList/blogDetail.vue'),
    meta: {
      hidden: true,
      title: '博客详情',
      icon: 'iconfont icon-dashboard',
    }
  },
  {
    path: '/userSetting',
    name: 'userSetting',
    component: () => import('@/views/System/User/userSetting.vue'),
    meta: {
      hidden: true,
      title: '账户设置',
      icon: 'iconfont icon-dashboard',
    }
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/system/user',
    meta: {
      title: '系统设置',
      icon: 'iconfont icon-setting'
    },
    children: [
      {
        path: '/system/user',
        name: 'system:user',
        component: () => import('@/views/System/User/Index.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/system/role',
        name: 'system:role',
        component: () => import('@/views/System/Role/Index.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/system/auth',
        name: 'system:auth',
        component: () => import('@/views/System/Auth/Index.vue'),
        meta: {
          title: '权限管理'
        }
      }
    ]
  }
]
