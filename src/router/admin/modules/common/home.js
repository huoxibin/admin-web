/* 基础模块工作台 */
export default [
	// 基础模块工作台
	{
	  path: "common/home",
	  name: "首页",
	  // 进入路由需要登陆
	  meta: {
		defaultActive: "/common/home",
		requireAuth: true,
		bread: [
		  {
			name: "首页",
			path: "/common/home"
		  }
		]
	  },
	  component: () => import("@/views/common/home")
	}
  ];
  