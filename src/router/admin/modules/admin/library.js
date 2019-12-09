/* 知识库 */
export default [
  // 健康评估
  {
    path: "library/health/list",
    name: "知识库/健康评估/健康评估列表",
    meta: {
      keepAlive: true,
      defaultActive: "/library/health/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/health/list"
        },
        {
          name: "健康评估",
          path: "/library/health/list"
        },
        {
          name: "健康评估列表",
          path: "/library/health/list"
        }
      ]
    },
    component: () => import("@/views/admin/library/health/list")
  },
  // 健康评估新增
  {
    path: "library/health/list/add",
    name: "知识库/健康评估/健康评估列表/新增",
    meta: {
      defaultActive: "/library/health/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/health/list"
        },
        {
          name: "健康评估",
          path: "/library/health/list"
        },
        {
          name: "健康评估列表",
          path: "/library/health/list"
        },
        {
          name: "新增",
          path: "/library/health/list/add"
        }
      ]
    },
    component: () => import("@/views/admin/library/health/add")
  },
  // 健康评估编辑
  {
    path: "library/health/list/update",
    name: "知识库/健康评估/健康评估列表/编辑",
    meta: {
      defaultActive: "/library/health/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/health/list"
        },
        {
          name: "健康评估",
          path: "/library/health/list"
        },
        {
          name: "健康评估列表",
          path: "/library/health/list"
        },
        {
          name: "编辑",
          path: "/library/health/list/update"
        }
      ]
    },
    component: () => import("@/views/admin/library/health/update")
  },
  // 健康评估查看
  {
    path: "library/health/list/find",
    name: "知识库/健康评估/健康评估列表/查看",
    meta: {
      defaultActive: "/library/health/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/health/list"
        },
        {
          name: "健康评估",
          path: "/library/health/list"
        },
        {
          name: "健康评估列表",
          path: "/library/health/list"
        },
        {
          name: "查看",
          path: "/library/health/list/find"
        }
      ]
    },
    component: () => import("@/views/admin/library/health/find")
  },
  // 评估栏目
  {
    path: "library/column/list",
    name: "知识库/评估栏目/栏目列表管理",
    meta: {
      keepAlive: true,
      defaultActive: "/library/column/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/column/list"
        },
        {
          name: "评估栏目",
          path: "/library/column/list"
        },
        {
          name: "栏目列表管理",
          path: "/library/column/list"
        }
      ]
    },
    component: () => import("@/views/admin/library/column/list")
  },
  // 评估栏目新增
  {
    path: "library/column/list/add",
    name: "知识库/评估栏目/栏目列表管理/新增",
    meta: {
      defaultActive: "/library/column/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/column/list"
        },
        {
          name: "评估栏目",
          path: "/library/column/list"
        },
        {
          name: "栏目列表管理",
          path: "/library/column/list"
        },
        {
          name: "新增",
          path: "/library/column/list/add"
        }
      ]
    },
    component: () => import("@/views/admin/library/column/add")
  },
  // 评估栏目编辑
  {
    path: "library/column/list/update",
    name: "知识库/评估栏目/栏目列表管理/编辑",
    meta: {
      defaultActive: "/library/column/list",
      requireAuth: true,
      bread: [
        {
          name: "知识库",
          path: "/library/column/list"
        },
        {
          name: "评估栏目",
          path: "/library/column/list"
        },
        {
          name: "栏目列表管理",
          path: "/library/column/list"
        },
        {
          name: "编辑",
          path: "/library/column/list/update"
        }
      ]
    },
    component: () => import("@/views/admin/library/column/update")
  }
];
