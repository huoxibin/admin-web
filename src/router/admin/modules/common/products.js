export default [
  ///////////商品类型//////////////
  // 商品类型列表
  {
    path: "/products/productsType/list",
    name: "商品数据-商品类型",
    meta: {
      requireAuth: true,
      defaultActive: "/products/productsType/list",
      bread: [
        {
          name: "商品数据",
          path: "/products/productsData/list"
        },
        {
          name: "商品类型",
          path: "/products/productsType/detail"
        }
      ]
    },
    component: () => import("@/views/common/products/productsType/list")
  },
  ///////////////商品数据//////////////////
  // 商品数据详情
  {
    path: "/products/productsData/detail",
    name: "商品数据-详情",
    meta: {
      requireAuth: true,
      defaultActive: "/products/productsData/detail",
      bread: [
        {
          name: "商品数据",
          path: "/products/productsData/list"
        },
        {
          name: "商品数据详情",
          path: "/products/productsData/detail"
        }
      ]
    },
    component: () => import("@/views/common/products/productsData/detail")
  },
  // 商品数据添加
  {
    path: "/products/productsData/add",
    name: "商品数据-列表",
    meta: {
      requireAuth: true,
      defaultActive: "/products/productsData/add",
      bread: [
        {
          name: "商品数据",
          path: "/products/productsData/list"
        },
        {
          name: "商品数据新增",
          path: "/products/productsData/add"
        }
      ]
    },
    component: () => import("@/views/common/products/productsData/add")
  },
  // 商品数据列表
  {
    path: "/products/productsData/list",
    name: "商品数据-编辑",
    meta: {
      requireAuth: true,
      defaultActive: "/products/productsData/list",
      bread: [
        {
          name: "商品数据",
          path: "/products/productsData/list"
        },
        {
          name: "商品数据",
          path: "/products/productsData/list"
        }
      ]
    },
    component: () => import("@/views/common/products/productsData/list")
  }
];
