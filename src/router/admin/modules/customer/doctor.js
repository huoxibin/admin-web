/* 医护管理 */
export default [
  // 绿通医生管理
  {
    path: "/doctor/ltDoctor/list",
    name: "医护管理/绿通医生管理",
    meta: {
      defaultActive: "/doctor/ltDoctor/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "绿通医生管理",
          path: "/doctor/ltDoctor/list"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/ltDoctor/list")
  },
  // 团队管理
  {
    path: "doctor/team/list",
    name: "医护管理/团队管理/家医团队列表",
    meta: {
      keepAlive: true,
      defaultActive: "/doctor/team/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "团队管理",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队列表",
          path: "/doctor/team/list"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/team/list")
  },
  //医护管理
  {
    path: "doctor/healthCare/list",
    name: "医护管理/医护管理",
    meta: {
      keepAlive: true,
      defaultActive: "/doctor/healthCare/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/healthCare/list"
        },
        {
          name: "医护管理",
          path: "/doctor/healthCare/list"
        },
        {
          name: "医护管理列表",
          path: "/doctor/healthCare/list"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/healthCare/list")
  },
  //新增医生
  {
    path: "doctor/healthCare/list/add",
    name: "医护管理/医护管理/新增",
    meta: {
      defaultActive: "/doctor/healthCare/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/healthCare/list"
        },
        {
          name: "医护管理",
          path: "/doctor/healthCare/list"
        },
        {
          name: "新增",
          path: "/doctor/healthCare/list/add"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/healthCare/add")
  },
  //查看医生
  {
    path: "doctor/healthCare/list/find",
    name: "医护管理/医护管理/查看",
    meta: {
      defaultActive: "/doctor/healthCare/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/healthCare/list"
        },
        {
          name: "医护管理",
          path: "/doctor/healthCare/list"
        },
        {
          name: "查看",
          path: "/doctor/healthCare/list/find"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/healthCare/find")
  },
  // 新增团队
  {
    path: "doctor/team/list/add",
    name: "医护管理/团队管理/家医团队列表/新增家医团队",
    meta: {
      defaultActive: "/doctor/team/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "团队管理",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队列表",
          path: "/doctor/team/list"
        },
        {
          name: "新增家医团队",
          path: "/doctor/team/list/add"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/team/add")
  },
  // 编辑团队
  {
    path: "doctor/team/list/update",
    name: "医护管理/团队管理/家医团队列表/编辑家医团队",
    meta: {
      defaultActive: "/doctor/team/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "团队管理",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队列表",
          path: "/doctor/team/list"
        },
        {
          name: "编辑家医团队",
          path: "/doctor/team/list/update"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/team/update")
  },
  // 查看团队
  {
    path: "doctor/team/list/find",
    name: "医护管理/团队管理/家医团队列表/家医团队详情",
    meta: {
      defaultActive: "/doctor/team/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "团队管理",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队列表",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队详情",
          path: "/doctor/team/list/find"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/team/find")
  },
  // 家医详情
  {
    path: "doctor/team/list/find/member",
    name: "医护管理/团队管理/家医团队列表/家医团队详情/家医详情",
    meta: {
      defaultActive: "/doctor/team/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "团队管理",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队列表",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队详情",
          path: "/doctor/team/list/find"
        },
        {
          name: "家医详情",
          path: "/doctor/team/list/find/member"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/team/member")
  },
  // 服务包详情
  {
    path: "doctor/team/list/find/package",
    name: "医护管理/团队管理/家医团队列表/家医团队详情/服务包详情",
    meta: {
      defaultActive: "/doctor/team/list",
      requireAuth: true,
      bread: [
        {
          name: "医护管理",
          path: "/doctor/team/list"
        },
        {
          name: "团队管理",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队列表",
          path: "/doctor/team/list"
        },
        {
          name: "家医团队详情",
          path: "/doctor/team/list/find"
        },
        {
          name: "服务包详情",
          path: "/doctor/team/list/find/package"
        }
      ]
    },
    component: () => import("@/views/customer/doctor/team/package")
  }
];
