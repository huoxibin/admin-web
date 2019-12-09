/////工作流设置/////
export default [
  // 列表
  {
    path: "/home",
    name: "营销平台",
    meta: {
      defaultActive: "/home",
      requireAuth: true,
      bread: [
        {
          name: "首页内容",
          path: "/home"
        }
      ]
    },
    component: () => import("@/views/marketing/home")
  },
  // 列表
  {
    path: "/work/list",
    name: "工作流设置/工作列表",
    meta: {
      defaultActive: "/work/list",
      requireAuth: true,
      bread: [
        {
          name: "工作流设置",
          path: "/work/list"
        },
        {
          name: "工作列表",
          path: "/work/list"
        }
      ]
    },
    component: () => import("@/views/marketing/work/list")
  },
  /////详情/////
  {
    path: "/work/list",
    name: "工作流设置/工作详情",
    meta: {
      defaultActive: "/work/detail",
      requireAuth: true,
      bread: [
        {
          name: "工作流设置",
          path: "/work/list"
        },
        {
          name: "工作列表",
          path: "/work/detail"
        }
      ]
    },
    component: () => import("@/views/marketing/work/detail")
  }
];
