/* 客服平台工作台 */
export default [
   // 基础模块工作台
   {
      path: "customer/home",
      name: "基础平台-首页",
      // 进入路由需要登陆
      meta: {
         defaultActive: "/customer/home",
         requireAuth: true,
         bread: [
            {
               name: "首页",
               path: "/customer/home"
            }
         ]
      },
      component: () => import("@/views/customer/home")
   }
];
