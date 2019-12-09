/* 信息管理 */
export default [


	{
		path: "/message/list",
		name: "系统提醒",
		meta: {
			defaultActive: "/message/list",
			requireAuth: true
		},
		component: () =>
			import("@/views/admin/message/list")
	},
  // 活动页管理-推荐医生活动页-预览
  {
    path: "news/activity_page/recommend/preview",
    name: "信息管理/活动页管理/推荐医生活动页/列表/预览",
    meta: {
      defaultActive: "/news/activity_page/recommend/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "活动页管理",
          path: "/news/activity_page/recommend/listst"
        },
        {
          name: "推荐医生活动页",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "列表",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "预览",
          path: "/news/activity_page/recommend/list"
        }
      ]
    },
    component: () =>
      import("@/views/admin/news/activity_page/recommend/preview.vue")
  },
  // 活动页管理-推荐医生活动页-编辑
  {
    path: "news/activity_page/recommend/list/:type",
    name: "信息管理/活动页管理/推荐医生活动页/列表/编辑",
    meta: {
      defaultActive: "/news/activity_page/recommend/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "活动页管理",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "推荐医生活动页",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "列表",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "编辑",
          path: "/news/activity_page/recommend/list"
        }
      ]
    },
    component: () =>
      import("@/views/admin/news/activity_page/recommend/edit.vue")
  },
  // 活动页管理-推荐医生活动页
  {
    path: "news/activity_page/recommend/list",
    name: "信息管理/活动页管理/推荐医生活动页/列表",
    meta: {
      defaultActive: "/news/activity_page/recommend/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "活动页管理",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "推荐医生活动页",
          path: "/news/activity_page/recommend/list"
        },
        {
          name: "列表",
          path: "/news/activity_page/recommend/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/activity_page/recommend")
  },
  // 招募信息管理-编辑
  {
    path: "news/recruit/news/:type",
    name: "信息管理/患者招募/招募信息管理/编辑",
    meta: {
      defaultActive: "/news/recruit/news",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/recruit/news"
        },
        {
          name: "患者招募",
          path: "/news/recruit/news"
        },
        {
          name: "招募信息管理",
          path: "/news/recruit/news"
        },
        {
          name: "编辑",
          path: "/news/recruit/news"
        }
      ]
    },
    component: () => import("@/views/admin/news/recruit/news/edit.vue")
  },
  // 招募信息管理-预览
  {
    path: "news/recruit/news/preview/app",
    name: "信息管理/患者招募/招募信息管理/预览",
    meta: {
      defaultActive: "/news/recruit/news",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/recruit/news"
        },
        {
          name: "患者招募",
          path: "/news/recruit/news"
        },
        {
          name: "招募信息管理",
          path: "/news/recruit/news"
        },
        {
          name: "预览",
          path: "/news/recruit/news"
        }
      ]
    },
    component: () => import("@/views/admin/news/recruit/news/preview.vue")
  },
  // 招募信息管理
  {
    path: "news/recruit/news",
    name: "信息管理/患者招募/招募信息管理",
    meta: {
      defaultActive: "/news/recruit/news",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/recruit/news"
        },
        {
          name: "患者招募",
          path: "/news/recruit/news"
        },
        {
          name: "招募信息管理",
          path: "/news/recruit/news"
        }
      ]
    },
    component: () => import("@/views/admin/news/recruit/news")
  },
  // 招募患者管理
  {
    path: "news/recruit/patient",
    name: "信息管理/患者招募/招募患者管理",
    meta: {
      defaultActive: "/news/recruit/patient",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/recruit/patient"
        },
        {
          name: "患者招募",
          path: "/news/recruit/patient"
        },
        {
          name: "招募患者管理",
          path: "/news/recruit/patient"
        }
      ]
    },
    component: () => import("@/views/admin/news/recruit/patient")
  },
  // 招募家庭管理
  {
    path: "news/recruit/familypatient",
    name: "信息管理/患者招募/招募家庭管理",
    meta: {
      defaultActive: "/news/recruit/familypatient",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/recruit/familypatient"
        },
        {
          name: "患者招募",
          path: "/news/recruit/familypatient"
        },
        {
          name: "招募家庭管理",
          path: "/news/recruit/familypatient"
        }
      ]
    },
    component: () => import("@/views/admin/news/recruit/familypatient")
  },
  // 经典病例
  {
    path: "news/case",
    name: "信息管理/经典病例",
    meta: {
      defaultActive: "/news/case",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/case"
        },
        {
          name: "经典病例",
          path: "/news/case"
        }
      ]
    },
    component: () => import("@/views/admin/news/case")
  },
  // 经典病例-编辑
  {
    path: "news/case/:type",
    name: "信息管理/经典病例/编辑",
    meta: {
      defaultActive: "/news/case",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/case"
        },
        {
          name: "经典病例",
          path: "/news/case"
        },
        {
          name: "编辑",
          path: "/news/case"
        }
      ]
    },
    component: () => import("@/views/admin/news/case/edit.vue")
  },
  // 经典病例-编辑
  {
    path: "news/case/preview/app",
    name: "信息管理/经典病例/预览",
    meta: {
      defaultActive: "/news/case",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/case"
        },
        {
          name: "经典病例",
          path: "/news/case"
        },
        {
          name: "预览",
          path: "/news/case/preview"
        }
      ]
    },
    component: () => import("@/views/admin/news/case/preview.vue")
  },

  // Icon 管理
  {
    path: "/news/icon/list",
    name: "信息管理/首页ICON管理",
    meta: {
      defaultActive: "/news/icon/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/guide"
        },
        {
          name: "首页ICON管理",
          path: "/news/icon/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/icon/list")
  },
  // 指南共识
  {
    path: "news/guide",
    name: "信息管理/指南共识",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/guide",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/guide"
        },
        {
          name: "指南共识",
          path: "/news/guide"
        }
      ]
    },
    component: () => import("@/views/admin/news/guide")
  },
  // 指南共识-编辑
  {
    path: "news/guide/:type",
    name: "信息管理/指南共识/编辑",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/guide",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/guide"
        },
        {
          name: "指南共识",
          path: "/news/guide"
        },
        {
          name: "预览",
          path: "/news/guide/edit"
        }
      ]
    },
    component: () => import("@/views/admin/news/guide/edit.vue")
  },
  // 资讯列表
  {
    path: "news/health/list",
    name: "信息管理/健康资讯/资讯列表",
    // 进入路由需要登陆
    meta: {
      keepAlive: true,
      defaultActive: "/news/health/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/health/list"
        },
        {
          name: "健康资讯",
          path: "/news/health/list"
        },
        {
          name: "资讯列表",
          path: "/news/health/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/health/list")
  },
  // 新增资讯
  {
    path: "news/health/list/add",
    name: "信息管理/健康资讯/资讯列表/新增",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/health/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/health/list"
        },
        {
          name: "健康资讯",
          path: "/news/health/list"
        },
        {
          name: "资讯列表",
          path: "/news/health/list"
        },
        {
          name: "新增",
          path: "/news/health/list/add"
        }
      ]
    },
    component: () => import("@/views/admin/news/health/add")
  },
  // 修改资讯
  {
    path: "news/health/list/update",
    name: "信息管理/健康资讯/资讯列表/修改",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/health/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/health/list"
        },
        {
          name: "健康资讯",
          path: "/news/health/list"
        },
        {
          name: "资讯列表",
          path: "/news/health/list"
        },
        {
          name: "修改",
          path: "/news/health/list/update"
        }
      ]
    },
    component: () => import("@/views/admin/news/health/update")
  },
  // 预览资讯
  {
    path: "news/health/list/find",
    name: "信息管理/健康资讯/资讯列表/预览",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/health/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/health/list"
        },
        {
          name: "健康资讯",
          path: "/news/health/list"
        },
        {
          name: "资讯列表",
          path: "/news/health/list"
        },
        {
          name: "预览",
          path: "/news/health/list/find"
        }
      ]
    },
    component: () => import("@/views/admin/news/health/find")
  },
  // 分类管理
  {
    path: "news/health/list/class",
    name: "信息管理/健康资讯/资讯列表/分类管理",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/health/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/health/list"
        },
        {
          name: "健康资讯",
          path: "/news/health/list"
        },
        {
          name: "资讯列表",
          path: "/news/health/list"
        },
        {
          name: "分类管理",
          path: "/news/health/list/class"
        }
      ]
    },
    component: () => import("@/views/admin/news/health/class")
  },
  // 广告位
  {
    path: "news/ad/list",
    name: "信息管理/广告管理/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/ad/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/ad/list"
        },
        {
          name: "广告管理",
          path: "/news/ad/list"
        },
        {
          name: "列表",
          path: "/news/ad/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/ad/list")
  },
  //启动页配置
  {
    path: "news/startPage/list",
    name: "信息管理/启动页管理/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/startPage/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/startPage/list"
        },
        {
          name: "启动页管理",
          path: "/news/startPage/list"
        },
        {
          name: "列表",
          path: "/news/startPage/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/startPage/list")
  },
  //弹窗管理-列表
  {
    path: "news/window/list",
    name: "信息管理/弹窗管理/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/window/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/window/list"
        },
        {
          name: "弹窗管理",
          path: "/news/window/list"
        },
        {
          name: "列表",
          path: "/news/window/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/window/list")
  },
  //弹窗管理-编辑
  {
    path: "news/window/edit/:type",
    name: "信息管理/弹窗管理/编辑",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/window/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/window/list"
        },
        {
          name: "弹窗管理",
          path: "/news/window/list"
        },
        {
          name: "编辑",
          path: "/news/window/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/window/edit")
  },
  // 活动管理-列表
  {
    path: "news/activity/list",
    name: "信息管理/活动管理/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/activity/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/activity/list"
        },
        {
          name: "活动管理",
          path: "/news/activity/list"
        },
        {
          name: "列表",
          path: "/news/activity/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/activity/list")
  },
  // 活动管理-编辑
  {
    path: "news/activity/edit/:type",
    name: "信息管理/活动管理/编辑",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/activity/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/activity/list"
        },
        {
          name: "活动管理",
          path: "/news/activity/list"
        },
        {
          name: "编辑",
          path: "/news/activity/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/activity/edit")
  },

  // 消息推送-列表
  {
    path: "news/push/list",
    name: "信息管理/消息推送/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/push/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/push/list"
        },
        {
          name: "消息推送",
          path: "/news/push/list"
        },
        {
          name: "列表",
          path: "/news/push/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/push/list")
  },
  // 消息推送-编辑
  {
    path: "news/push/edit/:type",
    name: "信息管理/消息推送/编辑",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/news/push/list",
      requireAuth: true,
      bread: [
        {
          name: "信息管理",
          path: "/news/push/list"
        },
        {
          name: "消息推送",
          path: "/news/push/list"
        },
        {
          name: "编辑",
          path: "/news/push/list"
        }
      ]
    },
    component: () => import("@/views/admin/news/push/edit")
  }
];
