/* 商品管理 */
export default [

  // 直播课程新增
  // {
  //   path: "/commodity/playCourse/add",
  //   name: "商品管理/课程管理/直播课程",
  //   meta: {
  //     defaultActive: "/commodity/playCourse/add",
  //     requireAuth: true,
  //     bread: [
  //       {
  //         name: "商品管理",
  //         path: "/commodity/service/list"
  //       },
  //       {
  //         name: "直播课程",
  //         path: "/commodity/playCourse/list"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/common/commodity/playCourse/add/index")
  // },

  // // 直播课程详情
  // {
  //   path: "/commodity/playCourse/detail",
  //   name: "商品管理/课程管理/直播课程",
  //   meta: {
  //     defaultActive: "/commodity/playCourse/list",
  //     requireAuth: true,
  //     bread: [
  //       {
  //         name: "商品管理",
  //         path: "/commodity/service/list"
  //       },
  //       {
  //         name: "直播课程",
  //         path: "/commodity/playCourse/list"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/common/commodity/playCourse/detail/index")
  // },
  // // 直播课程列表
  // {
  //   path: "/commodity/playCourse/list",
  //   name: "商品管理/课程管理/直播课程",
  //   meta: {
  //     defaultActive: "/commodity/playCourse/list",
  //     requireAuth: true,
	// 		keepAlive: true, //缓存页面
  //     bread: [
  //       {
  //         name: "商品管理",
  //         path: "/commodity/service/list"
  //       },
  //       {
  //         name: "直播课程",
  //         path: "/commodity/playCourse/list"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/common/commodity/playCourse/list/index")
  // },
  // // 点播课程新增
  // {
  //   path: "/commodity/course/add",
  //   name: "商品管理/课程详情/编辑",
  //   meta: {
  //     defaultActive: "/commodity/course/add",
  //     requireAuth: true,
  //     bread: [
  //       {
  //         name: "商品管理",
  //         path: "/commodity/service/list"
  //       },
  //       {
  //         name: "课程管理",
  //         path: "/commodity/course/list"
  //       },
  //       {
  //         name: "新增课程",
  //         path: "/commodity/course/add"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/common/commodity/course/add")
  // },
  // // 点播课程详情
  // {
  //   path: "/commodity/course/detail",
  //   name: "商品管理/课程管理/点播课程",
  //   meta: {
  //     defaultActive: "/commodity/course/list",
  //     requireAuth: true,
  //     bread: [
  //       {
  //         name: "商品管理",
  //         path: "/commodity/service/list"
  //       },
  //       {
  //         name: "课程管理",
  //         path: "/commodity/course/list"
  //       },
  //       {
  //         name: "点播课程",
  //         path: "/commodity/course/list"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/common/commodity/course/detail/index")
  // },
  // // 点播课程列表
  // {
  //   path: "/commodity/course/list",
  //   name: "商品管理/课程管理/点播课程",
  //   meta: {
  //     defaultActive: "/commodity/course/list",
  //     requireAuth: true,
  //     keepAlive: true, //缓存页面
  //     bread: [
  //       {
  //         name: "商品管理",
  //         path: "/commodity/service/list"
  //       },
  //       {
  //         name: "课程管理",
  //         path: "/commodity/course/list"
  //       },
  //       {
  //         name: "点播课程",
  //         path: "/commodity/course/list"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/common/commodity/course/list/index")
  // },
  // 服务码
  {
    path: "commodity/service/list",
    name: "商品管理/服务码/服务码列表",
    meta: {
      defaultActive: "/commodity/service/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/service/list"
        },
        {
          name: "服务码",
          path: "/commodity/service/list"
        },
        {
          name: "服务码列表",
          path: "/commodity/service/list"
        }
      ]
    },
    component: () => import("@/views/common/commodity/service/list")
  },
  // 服务包管理
  {
    path: "commodity/package/list",
    name: "商品管理/服务包管理/服务包列表",
    meta: {
      keepAlive: true,
      defaultActive: "/commodity/package/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包列表",
          path: "/commodity/package/list"
        }
      ]
    },
    component: () => import("@/views/common/commodity/package/list")
  },
  // 服务包管理新增
  {
    path: "commodity/package/list/add",
    name: "商品管理/服务包管理/服务包列表/新增",
    meta: {
      defaultActive: "/commodity/package/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包列表",
          path: "/commodity/package/list"
        },
        {
          name: "新增",
          path: "/commodity/package/list/add"
        }
      ]
    },
    component: () => import("@/views/common/commodity/package/add")
  },
  // 服务包管理编辑
  {
    path: "commodity/package/list/update",
    name: "商品管理/服务包管理/服务包列表/编辑",
    meta: {
      defaultActive: "/commodity/package/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包列表",
          path: "/commodity/package/list"
        },
        {
          name: "编辑",
          path: "/commodity/package/list/update"
        }
      ]
    },
    component: () => import("@/views/common/commodity/package/update")
  },
  // 服务包管理查看
  {
    path: "commodity/package/list/find",
    name: "商品管理/服务包管理/服务包列表/查看",
    meta: {
      defaultActive: "/commodity/package/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包管理",
          path: "/commodity/package/list"
        },
        {
          name: "服务包列表",
          path: "/commodity/package/list"
        },
        {
          name: "查看",
          path: "/commodity/package/list/find"
        }
      ]
    },
    component: () => import("@/views/common/commodity/package/find")
  },
  //设备管理
  {
    path: "commodity/equipment/list",
    name: "商品管理/设备管理/列表",
    meta: {
      keepAlive: true,
      defaultActive: "/commodity/equipment/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/equipment/list"
        },
        {
          name: "设备管理",
          path: "/commodity/equipment/list"
        },
        {
          name: "列表",
          path: "/commodity/equipment/list"
        }
      ]
    },
    component: () => import("@/views/common/commodity/equipment/list")
  },
  //设备管理-查看
  {
    path: "commodity/equipment/list/find",
    name: "商品管理/设备管理/列表/详情",
    meta: {
      defaultActive: "/commodity/equipment/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/equipment/list"
        },
        {
          name: "设备管理",
          path: "/commodity/equipment/list"
        },
        {
          name: "列表",
          path: "/commodity/equipment/list"
        },
        {
          name: "详情",
          path: "/commodity/equipment/list/find"
        }
      ]
    },
    component: () => import("@/views/common/commodity/equipment/find")
  },
  // 会员服务配置
  {
    path: "commodity/vip/list",
    name: "商品管理/会员服务配置/列表",
    meta: {
      keepAlive: true,
      defaultActive: "/commodity/vip/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/vip/list"
        },
        {
          name: "会员服务配置",
          path: "/commodity/vip/list"
        },
        {
          name: "列表",
          path: "/commodity/vip/list"
        }
      ]
    },
    component: () => import("@/views/common/commodity/vip/list")
  },
  // 会员服务配置新增
  {
    path: "commodity/vip/list/add",
    name: "商品管理/会员服务配置/列表/新增",
    meta: {
      defaultActive: "/commodity/vip/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/vip/list"
        },
        {
          name: "会员服务配置",
          path: "/commodity/vip/list"
        },
        {
          name: "列表",
          path: "/commodity/vip/list"
        },
        {
          name: "新增",
          path: "/commodity/vip/list/add"
        }
      ]
    },
    component: () => import("@/views/common/commodity/vip/add")
  },
  // 会员服务配置查看
  {
    path: "commodity/vip/list/find",
    name: "商品管理/会员服务配置/列表/查看",
    meta: {
      defaultActive: "/commodity/vip/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/vip/list"
        },
        {
          name: "会员服务配置",
          path: "/commodity/vip/list"
        },
        {
          name: "列表",
          path: "/commodity/vip/list"
        },
        {
          name: "查看",
          path: "/commodity/vip/list/find"
        }
      ]
    },
    component: () => import("@/views/common/commodity/vip/find")
  },
  // 会员服务配置编辑
  {
    path: "commodity/vip/list/update",
    name: "商品管理/会员服务配置/列表/编辑",
    meta: {
      defaultActive: "/commodity/vip/list",
      requireAuth: true,
      bread: [
        {
          name: "商品管理",
          path: "/commodity/vip/list"
        },
        {
          name: "会员服务配置",
          path: "/commodity/vip/list"
        },
        {
          name: "列表",
          path: "/commodity/vip/list"
        },
        {
          name: "编辑",
          path: "/commodity/vip/list/update"
        }
      ]
    },
    component: () => import("@/views/common/commodity/vip/update")
  }
];
