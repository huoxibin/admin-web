/* 医护管理 */
export default [
	// 绿通医生管理
	{
		path: "/feedback/suggestion/list",
		name: "意见反馈管理/意见反馈管理",
		meta: {
			defaultActive: "/feedback/suggestion/list",
			requireAuth: true,
			bread: [
				{
					name: "意见反馈管理",
					path: "/feedback/suggestion/list"
				}
			]
		},
		component: () => import("@/views/customer/feedback/suggestion/list")
	}
	]