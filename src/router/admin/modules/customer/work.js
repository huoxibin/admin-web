/* 工单管理 */
export default [
  // 工单类型管理
  {
    path: "/work/category",
    name: "工单管理/工单管理/",
    meta: {
      defaultActive: "/work/order/list",
      requireAuth: true,
      bread: [
        {
          name: "工单管理",
          path: "/work/order/list"
        },
        {
          name: "类型管理",
          path: "/work/category"
        }
      ]
    },
    component: () => import("@/views/customer/work/category")
  },

  // 工单管理
  {
    path: "/work/order/list",
    name: "工单管理/工单管理",
    meta: {
      // keepAlive: true,
      defaultActive: "/work/order/list",
      requireAuth: true,
      bread: [
        {
          name: "工单管理",
          path: "/work/order/list"
        },
        {
          name: "工单管理",
          path: "/work/order/list"
        }
      ]
    },
    component: () => import("@/views/customer/work/order")
  },
  // 工单管理(新增)
  {
    path: "/work/order/:type",
    name: "工单管理/工单管理/新增",
    meta: {
      defaultActive: "/work/order/list",
      requireAuth: true,
      bread: [
        {
          name: "工单管理",
          path: "/work/order/list"
        },
        {
          name: "工单管理",
          path: "/work/order/list"
        },
        {
          name: "新增",
          path: "/work/order/list"
        }
      ]
    },
    component: () => import("@/views/customer/work/order/add.vue")
  },
  // 工单管理-查看
  {
    path: "/work/order/list/preview",
    name: "工单管理/工单管理/查看",
    meta: {
      defaultActive: "/work/order/list",
      requireAuth: true,
      bread: [
        {
          name: "工单管理",
          path: "/work/order/list"
        },
        {
          name: "工单管理",
          path: "/work/order/list"
        },
        {
          name: "查看",
          path: "/work/order/list/preview"
        }
      ]
    },
    component: () => import("@/views/customer/work/order/preview.vue")
  },
   //编辑页面
   {
      path: "/work/order/list/edit",
      name: "工单管理/工单管理/编辑",
      meta: {
         defaultActive: "/work/order/list",
         requireAuth: true,
         bread: [
            {
               name: "工单管理",
               path: "/work/order/list"
            },
            {
               name: "工单管理",
               path: "/work/order/list"
            },
            {
               name: "编辑",
               path: "/work/order/list/edit"
            }
         ]
      },
      component: () => import("@/views/customer/work/order/edit.vue")
   }
];
