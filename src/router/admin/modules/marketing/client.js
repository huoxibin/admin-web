export default [
  // 客户数据管理
  // {
  //   path: "/client/list",
  //   name: "客户数据-列表",
  //   meta: {
  //     requireAuth: true,
  //     defaultActive: "/client/list",
  //     bread: [
  //       {
  //         name: "客户数据",
  //         path: "/custorm/intention/list"
  //       },
  //       {
  //         name: "客户数据",
  //         path: "/client/list"
  //       }
  //     ]
  //   },
  //   component: () => import("@/views/marketing/client")
  // },
  {
    path: "/marketing/client/list/:type",
    name: "客户数据",
    meta: {
      requireAuth: true,
      defaultActive: "/marketing/client/list",
      bread: [
        {
          name: "意向客户",
          path: "/custorm/intention/list"
        },
        {
          name: "编辑",
          path: "/marketing/client/list"
        }
      ]
    },
    component: () => import("@/views/marketing/client/edit.vue")
  }
];
