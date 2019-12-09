/* 课程管理 */
export default [
	// 主题管理
	{
		path: "/commodity/theme/list",
		name: "点播课程",
		meta: {
			defaultActive: "/commodity/theme/list",
			requireAuth: true,
			bread: [
				{
					name: "主题管理",
					path: "/commodity/theme/list"
				}
			]
		},
		component: () => import("@/views/admin/course/theme/list")
	},
	// 直播课程新增
	{
		path: "/commodity/playCourse/add",
		name: "课程管理/直播课程-新增",
		meta: {
			defaultActive: "/commodity/playCourse/add",
			requireAuth: true,
			bread: [
				{
					name: "直播课程",
					path: "/commodity/playCourse/list"
				}
			]
		},
		component: () => import("@/views/admin/course/playCourse/add/index")
	},

	// 直播课程详情
	{
		path: "/commodity/playCourse/detail",
		name: "课程管理/直播课程-详情",
		meta: {
			defaultActive: "/commodity/playCourse/list",
			requireAuth: true,
			bread: [
				{
					name: "直播课程",
					path: "/commodity/playCourse/list"
				}
			]
		},
		component: () => import("@/views/admin/course/playCourse/detail/index")
	},
	// 直播课程列表
	{
		path: "/commodity/playCourse/list",
		name: "课程管理/直播课程",
		meta: {
			defaultActive: "/commodity/playCourse/list",
			requireAuth: true,
			keepAlive: true, //缓存页面
			bread: [
				{
					name: "直播课程",
					path: "/commodity/playCourse/list"
				}
			]
		},
		component: () => import("@/views/admin/course/playCourse/list/index")
	},
	// 点播课程新增
	{
		path: "/commodity/course/add",
		name: "课程详情/编辑",
		meta: {
			defaultActive: "/commodity/course/add",
			requireAuth: true,
			bread: [
				{
					name: "课程管理",
					path: "/commodity/course/list"
				},
				{
					name: "新增课程",
					path: "/commodity/course/add"
				}
			]
		},
		component: () => import("@/views/admin/course/course/add")
	},
	// 点播课程详情
	{
		path: "/commodity/course/detail",
		name: "课程管理/点播课程-详情",
		meta: {
			defaultActive: "/commodity/course/list",
			requireAuth: true,
			bread: [
				{
					name: "课程管理",
					path: "/commodity/course/list"
				},
				{
					name: "点播课程",
					path: "/commodity/course/list"
				}
			]
		},
		component: () => import("@/views/admin/course/course/detail/index")
	},
	// 点播课程列表
	{
		path: "/commodity/course/list",
		name: "课程管理/点播课程",
		meta: {
			defaultActive: "/commodity/course/list",
			requireAuth: true,
			keepAlive: true, //缓存页面
			bread: [
				{
					name: "课程管理",
					path: "/commodity/course/list"
				},
				{
					name: "点播课程",
					path: "/commodity/course/list"
				}
			]
		},
		component: () => import("@/views/admin/course/course/list/index")
	}
];
