/* 用户管理 */
export default [
  // 哆咖医生会员权益管理
  {
    path: "user/interests",
    name: "用户管理/哆咖医生会员权益管理",
    meta: {
      defaultActive: "/user/interests",
      requireAuth: true,
      bread: [
        {
          name: "用户管理",
          path: "/user/interests"
        },
        {
          name: "哆咖医生会员权益管理",
          path: "/user/interests"
        }
      ]
    },
    component: () => import("@/views/admin/user/interests")
  },
  // 积分规则
  {
    path: "user/integral/Integralmanage/Integralrule",
    name: "用户管理/积分管理/积分规则/",
    meta: {
      defaultActive: "/user/integral/Integralmanage/Integralrule",
      requireAuth: true,
      bread: [
        {
          name: "用户管理",
          path: "user/integral/Integralmanage"
        },
        {
          name: "积分管理",
          path: "user/integral/Integralmanage"
        },
        {
          name: "积分规则",
          path: "user/integral/Integralmanage/Integralrule"
        }
      ]
    },
    component: () =>
      import("@/views/admin/user/integral/Integralmanage/Integralrule")
  },
  // 积分任务
  {
    path: "user/integral/Integralmanage/Integraltask",
    name: "用户管理/积分管理/积分任务/",
    meta: {
      defaultActive: "/user/integral/Integralmanage/Integraltask",
      requireAuth: true,
      bread: [
        {
          name: "用户管理",
          path: "user/integral/Integralmanage"
        },
        {
          name: "积分管理",
          path: "user/integral/Integralmanage"
        },
        {
          name: "积分任务",
          path: "user/integral/Integralmanage/Integraltask"
        }
      ]
    },
    component: () =>
      import("@/views/admin/user/integral/Integralmanage/Integraltask")
  },
  // 家庭等级
  {
    path: "user/integral/familygrade",
    name: "用户管理/家庭等级/",
    meta: {
      defaultActive: "/user/integral/familygrade",
      requireAuth: true,
      bread: [
        {
          name: "用户管理",
          path: "/user/integral/familygrade"
        },
        {
          name: "家庭等级",
          path: "/user/integral/familygrade"
        }
      ]
    },
    component: () => import("@/views/admin/user/integral/familygrade")
  }
];
