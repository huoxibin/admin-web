/////工作流设置/////
export default [
  // 列表
  {
    path: "/marketing/home",
    name: "营销平台-首页",
    meta: {
      defaultActive: "/marketing/home",
      requireAuth: true,
      bread: [
        {
          name: "首页内容",
          path: "/marketing/home"
        }
      ]
    },
    component: () => import("@/views/marketing/home")
  }
];
