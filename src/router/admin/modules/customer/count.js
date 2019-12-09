/* 统计分析 */
export default [
	// 话务通话统计列表
	{
		path: "/count/phone/list",
		name: "话务通话统计",
		meta: {
			defaultActive: "/count/phone/list",
			requireAuth: true,
			bread: [
				{
					name: "话务通话统计",
					path: "/count/phone/list"
				}
			]
		},
		component: () => import("@/views/customer/count/phone/list")
	},
	// 体温统计详情
	{
		path: "/count/bodytemperature/detail",
		name: "统计分析/用户统计/体温测量统计-详情",
		meta: {
			defaultActive: "/count/bodytemperature/detail",
			requireAuth: true,
			bread: [
				{
					name: "用户统计",
					path: "/count/userInfo"
				},
				{
					name: "体温测量统计",
					path: "/count/bodytemperature/detail"
				}
			]
		},
		component: () => import("@/views/customer/count/user/bodytemperature/detail")
	},
	// 体温统计
	{
		path: "/count/bodytemperature",
		name: "统计分析/用户统计/体温测量统计",
		meta: {
			defaultActive: "/count/bodytemperature",
			requireAuth: true,
			bread: [
				{
					name: "用户统计",
					path: "/count/userInfo"
				},
				{
					name: "体温测量统计",
					path: "/count/bodytemperature"
				}
			]
		},
		component: () => import("@/views/customer/count/user/bodytemperature")
	},
	// 尿检统计
	{
		path: "/count/uroscopy/detail",
		name: "统计分析/用户统计/尿检测量统计-详情",
		meta: {
			defaultActive: "/count/uroscopy/detail",
			requireAuth: true,
			bread: [
				{
					name: "用户统计",
					path: "/count/userInfo"
				},
				{
					name: "尿检测量统计",
					path: "/count/uroscopy/detail"
				}
			]
		},
		component: () => import("@/views/customer/count/user/uroscopy/detail")
	},
	// 尿检统计
	{
		path: "/count/uroscopy",
		name: "统计分析/用户统计/尿检测量统计",
		meta: {
			defaultActive: "/count/uroscopy",
			requireAuth: true,
			bread: [
				{
					name: "用户统计",
					path: "/count/userInfo"
				},
				{
					name: "尿检测量统计",
					path: "/count/uroscopy"
				}
			]
		},
		component: () => import("@/views/customer/count/user/uroscopy")
	},
	// 体脂统计
	{
		path: "/count/bodyfat/detail",
		name: "统计分析/用户统计/体脂测量统计-详情",
		meta: {
			defaultActive: "/count/bodyfat/detail",
			requireAuth: true,
			bread: [
				{
					name: "用户统计",
					path: "/count/userInfo"
				},
				{
					name: "体脂测量统计",
					path: "/count/bodyfat/detail"
				}
			]
		},
		component: () => import("@/views/customer/count/user/bodyfat/detail")
	},
	// 体脂统计
	{
		path: "/count/bodyfat",
		name: "统计分析/用户统计/体脂测量统计",
		meta: {
			defaultActive: "/count/bodyfat",
			requireAuth: true,
			bread: [
				{
					name: "用户统计",
					path: "/count/userInfo"
				},
				{
					name: "体脂测量统计",
					path: "/count/bodyfat"
				}
			]
		},
		component: () => import("@/views/customer/count/user/bodyfat")
	},
  // 医生收支统计
  {
	path: "/count/doctorExpenses",
	name: "统计分析/医生收支统计",
	meta: {
	  defaultActive: "/count/doctorExpenses",
	  requireAuth: true,
	  bread: [
		{
		  name: "统计分析",
		  path: "/count/userInfo"
		},
		{
		  name: "医生收支统计",
		  path: "/count/doctorExpenses"
		}
	  ]
	},
	component: () => import("@/views/customer/count/doctor/doctor-expenses")
  },
  // 用户信息统计
  {
    path: "/count/userInfo",
    name: "统计分析/用户信息统计",
    meta: {
      defaultActive: "/count/userInfo",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/userInfo"
        },
        {
          name: "用户信息统计",
          path: "/count/userInfo"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/baseinfo/list")
  },
	// 用户信息统计详情
	{
		path: "/count/userdetail",
		name: "统计分析/用户信息统计详情",
		meta: {
			defaultActive: "/count/userdetail",
			requireAuth: true,
			bread: [
				{
					name: "用户信息统计",
					path: "/count/userInfo"
				},
				{
					name: "用户信息统计详情",
					path: "/count/userdetail"
				}
			]
		},
		component: () => import("@/views/customer/count/user/baseinfo/list")
	},
  // 家庭统计
  {
    path: "/count/family/list",
    name: "统计分析/家庭统计/列表管理",
    meta: {
      defaultActive: "/count/family/list",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/family/list"
        },
        {
          name: "家庭统计",
          path: "/count/family/list"
        },
        {
          name: "列表管理",
          path: "/count/family/list"
        }
      ]
    },
    component: () => import("@/views/customer/count/family/list")
  },
  // 家庭统计
  {
    path: "/count/family/list/find",
    name: "统计分析/家庭统计/列表管理/家庭人员列表",
    meta: {
      defaultActive: "/count/family/list",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/family/list"
        },
        {
          name: "家庭统计",
          path: "/count/family/list"
        },
        {
          name: "列表管理",
          path: "/count/family/list"
        },
        {
          name: "家庭人员列表",
          path: "/count/family/list/find"
        }
      ]
    },
    component: () => import("@/views/customer/count/family/find")
  },
  // 家庭统计/列表管理/家庭人员列表/人员详情
  {
    path: "/count/family/list/find/detail",
    name: "统计分析/家庭统计/列表管理/家庭人员列表/人员详情",
    meta: {
      defaultActive: "/count/family/list",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/family/list"
        },
        {
          name: "家庭统计",
          path: "/count/family/list"
        },
        {
          name: "列表管理",
          path: "/count/family/list"
        },
        {
          name: "家庭人员列表",
          path: "/count/family/list/find"
        },
        {
          name: "人员详情",
          path: "/count/family/list/find/detail"
        }
      ]
    },
    component: () => import("@/views/customer/count/family/detail")
  },
  // 用户统计-血氧测量统计
  {
    path: "/count/user/oxygen",
    name: "统计分析/用户统计/血氧测量统计",
    meta: {
      keepAlive: true,
      defaultActive: "/count/user/oxygen",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/oxygen"
        },
        {
          name: "用户统计",
          path: "/count/user/oxygen"
        },
        {
          name: "血氧测量统计",
          path: "/count/user/oxygen"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/oxygen/list")
  },
  // 用户统计-血氧测量统计-详情
  {
    path: "/count/user/oxygen/find",
    name: "统计分析/用户统计/血氧测量统计/详情",
    meta: {
      defaultActive: "/count/user/oxygen",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/oxygen"
        },
        {
          name: "用户统计",
          path: "/count/user/oxygen"
        },
        {
          name: "血氧测量统计",
          path: "/count/user/oxygen"
        },
        {
          name: "详情",
          path: "/count/user/oxygen/find"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/oxygen/find")
  },
  // 用户统计-血压测量统计
  {
    path: "/count/user/pressure",
    name: "统计分析/用户统计/血压测量统计",
    meta: {
      keepAlive: true,
      defaultActive: "/count/user/pressure",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/pressure"
        },
        {
          name: "用户统计",
          path: "/count/user/pressure"
        },
        {
          name: "血压测量统计",
          path: "/count/user/pressure"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/pressure/list")
  },
  // 用户统计-血压测量统计-详情
  {
    path: "/count/user/pressure/find",
    name: "统计分析/用户统计/血压测量统计/详情",
    meta: {
      defaultActive: "/count/user/pressure",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/pressure"
        },
        {
          name: "用户统计",
          path: "/count/user/pressure"
        },
        {
          name: "血压测量统计",
          path: "/count/user/pressure"
        },
        {
          name: "详情",
          path: "/count/user/pressure/find"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/pressure/find")
  },
  // 用户统计-心电测量统计
  {
    path: "/count/user/ecg",
    name: "统计分析/用户统计/心电测量统计",
    meta: {
      keepAlive: true,
      defaultActive: "/count/user/ecg",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/ecg"
        },
        {
          name: "用户统计",
          path: "/count/user/ecg"
        },
        {
          name: "心电测量统计",
          path: "/count/user/ecg"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/ecg/list")
  },
  // 用户统计-心电测量统计-详情
  {
    path: "/count/user/ecg/find",
    name: "统计分析/用户统计/心电测量统计/详情",
    meta: {
      defaultActive: "/count/user/ecg",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/ecg"
        },
        {
          name: "用户统计",
          path: "/count/user/ecg"
        },
        {
          name: "心电测量统计",
          path: "/count/user/ecg"
        },
        {
          name: "详情",
          path: "/count/user/ecg/find"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/ecg/find")
  },
  // 用户统计-血糖测量统计
  {
    path: "/count/user/sugar",
    name: "统计分析/用户统计/血糖测量统计",
    meta: {
      keepAlive: true,
      defaultActive: "/count/user/sugar",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/sugar"
        },
        {
          name: "用户统计",
          path: "/count/user/sugar"
        },
        {
          name: "血糖测量统计",
          path: "/count/user/sugar"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/sugar/list")
  },
  // 用户统计-血糖测量统计-详情
  {
    path: "/count/user/sugar/find",
    name: "统计分析/用户统计/血糖测量统计/详情",
    meta: {
      defaultActive: "/count/user/sugar",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/user/sugar"
        },
        {
          name: "用户统计",
          path: "/count/user/sugar"
        },
        {
          name: "血糖测量统计",
          path: "/count/user/sugar"
        },
        {
          name: "详情",
          path: "/count/user/sugar/find"
        }
      ]
    },
    component: () => import("@/views/customer/count/user/sugar/find")
  },
  // 医护统计
  {
    path: "/count/medicalcare/list",
    name: "统计分析/医护统计/列表管理",
    meta: {
      defaultActive: "/count/medicalcare/list",
      requireAuth: true,
      bread: [
        {
          name: "统计分析",
          path: "/count/medicalcare/list"
        },
        {
          name: "医护统计",
          path: "/count/medicalcare/list"
        },
        {
          name: "列表管理",
          path: "/count/medicalcare/list"
        }
      ]
    },
    component: () => import("@/views/customer/count/medicalcare/list")
  }
];
