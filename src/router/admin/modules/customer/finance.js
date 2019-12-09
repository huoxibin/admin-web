/* 财务管理 */
export default [
  // 医生账户提现管理
  {
    path: "/finance/management/list",
    name: "财务管理/医生账户提现管理",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/finance/management/list",
      requireAuth: true,
      bread: [
        {
          name: "财务管理",
          path: "/finance/management/list"
        },
        {
          name: "医生账户提现管理",
          path: "/finance/management/list"
        },
        {
          name: "列表",
          path: "/finance/management/list"
        }
      ]
    },
    component: () => import("@/views/customer/finance/management/list")
  },
  // 账户明细-医生
  {
    path: "finance/doctor/list",
    name: "财务管理/账户明细-医生",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/finance/doctor/list",
      requireAuth: true,
      bread: [
        {
          name: "财务管理",
          path: "/finance/doctor/list"
        },
        {
          name: "账户明细-医生",
          path: "/finance/doctor/list"
        },
        {
          name: "列表",
          path: "/finance/doctor/list"
        }
      ]
    },
    component: () => import("@/views/customer/finance/doctor/list")
  },
  // 账户明细-患者
  {
    path: "finance/patient/list",
    name: "财务管理/账户明细-患者/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/finance/patient/list",
      requireAuth: true,
      bread: [
        {
          name: "财务管理",
          path: "/finance/patient/list"
        },
        {
          name: "账户明细-患者",
          path: "/finance/patient/list"
        },
        {
          name: "列表",
          path: "/finance/patient/list"
        }
      ]
    },
    component: () => import("@/views/customer/finance/patient/list")
  },
  // 医生账户管理
  {
    path: "finance/account/list",
    name: "财务管理/医生账户管理/列表",
    // 进入路由需要登陆
    meta: {
      defaultActive: "/finance/account/list",
      requireAuth: true,
      bread: [
        {
          name: "财务管理",
          path: "/finance/account/list"
        },
        {
          name: "医生账户管理",
          path: "/finance/account/list"
        },
        {
          name: "列表",
          path: "/finance/account/list"
        }
      ]
    },
    component: () => import("@/views/customer/finance/account/list")
  }
];
