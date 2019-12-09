export default [
  // 客户数据管理
  {
    path: "/client/list",
    name: "客户数据-列表",
    meta: {
      requireAuth: true,
      defaultActive: "/client/list",
      bread: [
        {
          name: "客户数据",
          path: "/client/list"
        },
        {
          name: "客户数据",
          path: "/client/list"
        }
      ]
    },
    component: () => import("@/views/common/client")
  },
  {
    path: "/client/list/:type",
    name: "客户数据-编辑",
    meta: {
      requireAuth: true,
      defaultActive: "/client/list",
      bread: [
        {
          name: "客户数据",
          path: "/client/list"
        },
        {
          name: "客户数据",
          path: "/client/list"
        },
        {
          name: "编辑",
          path: "/client/list"
        }
      ]
    },
    component: () => import("@/views/common/client/edit.vue")
  },
  //关联线索详情
  {
    path: "/client/info",
    name: "线索管理",
    meta: {
      requireAuth: true,
      defaultActive: "/client/info",
      bread: [
        {
          name: "线索管理",
          path: "/client/info"
        },
        {
          name: "线索查看",
          path: "/client/info"
        }
      ]
    },
    component: () => import("@/views/common/client/info.vue")
  }
];
