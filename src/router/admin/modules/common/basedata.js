/* 基础数据 */
export default [
  // 科室管理
  {
    path: "/basedata/sopManage/sopInfo",
    name: "基础数据管理/科室管理",
    meta: {
      defaultActive: "/basedata/sopManage/sopInfo",
      requireAuth: true,
      bread: [
        {
          name: "基础数据管理",
          path: "/basedata/sopManage/sopInfo"
        },
        {
          name: "科室管理",
          path: "/basedata/sopManage/sopInfo"
        }
      ]
    },
    component: () => import("@/views/common/basedata/sopManage/sopInfo")
  },
  // 疾病管理
  {
    path: "/basedata/diseaseManage/categoryInfo",
    name: "基础数据管理/疾病管理",
    meta: {
      defaultActive: "/basedata/diseaseManage/categoryInfo",
      requireAuth: true,
      bread: [
        {
          name: "基础数据管理",
          path: "/basedata/diseaseManage/categoryInfo"
        },
        {
          name: "疾病管理",
          path: "/basedata/diseaseManage/categoryInfo"
        }
      ]
    },
    component: () => import("@/views/common/basedata/diseaseManage/categoryInfo")
  },
  // 地域管理列表
  {
    path: "/basedata/area/list",
    name: "地域数据列表",
    meta: {
      requireAuth: true,
      defaultActive: "/basedata/area/list",
      bread: [
        {
          name: "地域数据",
          path: "/basedata/area/list"
        }
      ]
    },
    component: () => import("@/views/common/basedata/area/list")
  }
];
