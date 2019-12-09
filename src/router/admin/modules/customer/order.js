/* 订单管理 */
export default [
  // 绿通订单管理
  {
    path: "/order/pass",
    name: "订单管理/绿通订单管理",
    meta: {
      defaultActive: "/order/pass",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/pass"
        },
        {
          name: "绿通订单管理",
          path: "/order/pass"
        }
      ]
    },
    component: () => import("@/views/customer/order/pass")
  },
  //课程订单管理
  {
    path: "/order/course/list",
    name: "订单管理/课程订单管理",
    meta: {
      defaultActive: "/order/course/list",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/orderteam/list"
        },
        {
          name: "课程订单管理",
          path: "order/course/list"
        }
      ]
    },
    component: () => import("@/views/customer/order/course/list")
  },
  // 订单管理列表
  {
    path: "order/orderteam/list",
    name: "订单管理/家医签约单管理/家医签约单列表/",
    meta: {
      defaultActive: "/order/orderteam/list",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/orderteam/list"
        },
        {
          name: "家医签约单管理",
          path: "/order/orderteam/list"
        },
        {
          name: "家医签约单列表",
          path: "/order/orderteam/list"
        }
      ]
    },
    component: () => import("@/views/customer/order/orderteam/list")
  },
  //会员订单列表
  {
    path: "order/memberorders/list",
    name: "订单管理/会员订单统计",
    meta: {
      defaultActive: "/order/memberorders/list",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/memberorders/list"
        },
        {
          name: "会员订单统计",
          path: "/order/memberorders/list"
        }
      ]
    },
    component: () => import("@/views/customer/order/memberorders/list")
  },
  //会员订单列表详情
  {
    path: "order/memberorders/list/details",
    name: "订单管理/会员订单统计/查看",
    meta: {
      defaultActive: "/order/memberorders/list",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/memberorders/list"
        },
        {
          name: "会员订单统计",
          path: "/order/memberorders/list"
        },
        {
          name: "查看",
          path: "/order/memberorders/list/details"
        }
      ]
    },
    component: () => import("@/views/customer/order/memberorders/details")
  },
  //云医订单管理列表
  {
    path: "order/clouddoctor/list",
    name: "订单管理/云医订单管理",
    meta: {
      defaultActive: "/order/clouddoctor/list",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/clouddoctor/list"
        },
        {
          name: "云医订单管理",
          path: "/order/clouddoctor/list"
        }
      ]
    },
    component: () => import("@/views/customer/order/clouddoctor/list")
  },
  // 订单管理列表详情
  {
    path: "order/orderteam/list/details",
    name: "订单管理/家医签约单管理/家医签约单列表/查看家医签约单",
    meta: {
      defaultActive: "/order/orderteam/list",
      requireAuth: true,
      bread: [
        {
          name: "订单管理",
          path: "/order/orderteam/list"
        },
        {
          name: "家医签约单管理",
          path: "/order/orderteam/list"
        },
        {
          name: "家医签约单列表",
          path: "/order/orderteam/list"
        },
        {
          name: "查看家医签约单",
          path: "/order/orderteam/list/details"
        }
      ]
    },
    component: () => import("@/views/customer/order/orderteam/details")
  }
];
