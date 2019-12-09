/* 运营平台工作台 */
export default [
	// 运营平台工作台
	{
	  path: "admin/home",
	  name: "运营平台-首页",
	  // 进入路由需要登陆
	  meta: {
		defaultActive: "/admin/home",
		requireAuth: true,
		bread: [
		  {
			name: "首页",
			path: "/admin/home"
		  }
		]
	  },
	  component: () => import("@/views/admin/home")
	}
  ];
  