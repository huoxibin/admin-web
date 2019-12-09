/* 机构管理 */
export default [
  // 医院机构列表
  {
    path: "mechanism/Hospital/list",
    name: "机构管理/医院机构/医院机构列表",
    meta: {
      keepAlive: true,
      defaultActive: "/mechanism/Hospital/list",
      requireAuth: true,
      bread: [
        {
          name: "机构管理",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构列表",
          path: "/mechanism/Hospital/list"
        }
      ]
    },
    component: () => import("@/views/common/mechanism/Hospital/list")
  },
  // 医院机构详情
  {
    path: "mechanism/Hospital/list/find",
    name: "机构管理/医院机构/医院机构列表/医院机构详情",
    meta: {
      defaultActive: "/mechanism/Hospital/list",
      requireAuth: true,
      bread: [
        {
          name: "机构管理",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构列表",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构详情",
          path: "/mechanism/Hospital/list/find"
        }
      ]
    },
    component: () => import("@/views/common/mechanism/Hospital/find")
  },
  // 编辑医院机构
  {
    path: "mechanism/Hospital/list/update",
    name: "机构管理/医院机构/医院机构列表/编辑医院机构",
    meta: {
      defaultActive: "/mechanism/Hospital/list",
      requireAuth: true,
      bread: [
        {
          name: "机构管理",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "医院机构列表",
          path: "/mechanism/Hospital/list"
        },
        {
          name: "编辑医院机构",
          path: "/mechanism/Hospital/list/update"
        }
      ]
    },
    component: () => import("@/views/common/mechanism/Hospital/update")
  }
];
