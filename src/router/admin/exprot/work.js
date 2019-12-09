export default [
  {
    path: "/work/:type",
    name: "工单管理",
    component: () => import("@/views/customer/export/work")
  }
];
