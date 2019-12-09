/* 系统设置 */
export default [
  // 提现设置
  {
    path: "system/money",
    name: "系统设置/提现设置",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/staff/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/money"
        },
        {
          name: "提现设置",
          path: "/system/money"
        }
      ]
    },
    component: () => import("@/views/common/system/money")
  },
  // 员工列表
  {
    path: "system/staff/list",
    name: "系统设置/员工管理/员工列表",
    // 进入路由需要登陆
    meta: {
      keepAlive: true,
      defaultActive: "/system/staff/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/staff/list"
        },
        {
          name: "员工管理",
          path: "/system/staff/list"
        },
        {
          name: "员工列表",
          path: "/system/staff/list"
        }
      ]
    },
    component: () => import("@/views/common/system/staff/list")
  },
  // 新增员工
  {
    path: "system/staff/list/add",
    name: "系统设置/员工管理/员工列表/新增员工",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/staff/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/staff/list"
        },
        {
          name: "员工管理",
          path: "/system/staff/list"
        },
        {
          name: "员工列表",
          path: "/system/staff/list"
        },
        {
          name: "新增员工",
          path: "/system/staff/list/add"
        }
      ]
    },
    component: () => import("@/views/common/system/staff/add")
  },
  // 修改员工
  {
    path: "system/staff/list/update",
    name: "系统设置/员工管理/员工列表/修改员工",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/staff/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/staff/list"
        },
        {
          name: "员工管理",
          path: "/system/staff/list"
        },
        {
          name: "员工列表",
          path: "/system/staff/list"
        },
        {
          name: "修改员工",
          path: "/system/staff/list/update"
        }
      ]
    },
    component: () => import("@/views/common/system/staff/update")
  },
  // 区域管理
  {
    path: "system/region/list",
    name: "系统设置/区域管理/区域列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/region/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/region/list"
        },
        {
          name: "区域管理",
          path: "/system/region/list"
        },
        {
          name: "区域列表",
          path: "/system/region/list"
        }
      ]
    },
    component: () => import("@/views/common/system/region")
  },
  // 部门管理
  {
    path: "system/department/list",
    name: "系统设置/部门管理/部门列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/department/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/department/list"
        },
        {
          name: "部门管理",
          path: "/system/department/list"
        },
        {
          name: "部门列表",
          path: "/system/department/list"
        }
      ]
    },
    component: () => import("@/views/common/system/department")
  },
  // 职位管理
  {
    path: "system/position/list",
    name: "系统设置/职位管理/职位列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/position/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/position/list"
        },
        {
          name: "职位管理",
          path: "/system/position/list"
        },
        {
          name: "职位列表",
          path: "/system/position/list"
        }
      ]
    },
    component: () => import("@/views/common/system/position")
  },
  // 角色管理
  {
    path: "system/role/list",
    name: "系统设置/角色管理/角色列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/role/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/role/list"
        },
        {
          name: "角色管理",
          path: "/system/role/list"
        },
        {
          name: "角色列表",
          path: "/system/role/list"
        }
      ]
    },
    component: () => import("@/views/common/system/role")
  },
  // 权限管理
  {
    path: "system/Jurisdiction/list",
    name: "系统设置/权限管理/菜单列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/Jurisdiction/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/Jurisdiction/list"
        },
        {
          name: "权限管理",
          path: "/system/Jurisdiction/list"
        },
        {
          name: "菜单列表",
          path: "/system/Jurisdiction/list"
        }
      ]
    },
    component: () => import("@/views/common/system/Jurisdiction")
  },
  // 日志管理
  {
    path: "/system/log/list",
    name: "系统设置/日志管理/日志列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/system/log/list",
      requireAuth: true,
      bread: [
        {
          name: "系统设置",
          path: "/system/log/list"
        },
        {
          name: "日志管理",
          path: "/system/log/list"
        },
        {
          name: "日志列表",
          path: "/system/log/list"
        }
      ]
    },
    component: () => import("@/views/common/system/log")
  },
	// 外接设备管理
	{
		path: "/system/device",
		name: "系统设置/外接设备管理",
		// 进入路由需要登陆
		meta: {
			defaultActive: "/system/device",
			requireAuth: true,
			keepAlive: true, //缓存页面
			bread: [
				{
					name: "外接设备管理",
					path: "/system/device"
				}
			]
		},
		component: () => import("@/views/common/system/device")
	},
	// 外接设备新增
	{
		path: "/system/device/add",
		name: "外接设备管理",
		meta: {
			defaultActive: "/system/device/add",
			requireAuth: true,
			bread: [
				{
					name: "外接设备管理",
					path: "/system/device"
				},
				{
					name: "新增",
					path: "/system/device/add"
				}
			]
		},
		component: () => import("@/views/common/system/device/add")
	},
	// 外接设备详情
	{
		path: "/system/device/detail",
		name: "外接设备管理/详情",
		meta: {
			defaultActive: "/system/device/detail",
			requireAuth: true,
			bread: [
				{
					name: "外接设备管理",
					path: "/system/device"
				},
				{
					name: "详情",
					path: "/system/device/detail"
				},
			]
		},
		component: () => import("@/views/common/system/device/detail")
	},

];
