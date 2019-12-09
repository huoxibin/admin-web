export default [
	{
		path: '/groupphone/baseinfo/index',
		name: '话务分组管理/基本信息',
		meta: {
			defaultActive: '/groupphone/baseinfo/index',
			requireAuth: true,
			bread: [
				{
					name: '话务分组管理',
					path: '/groupphone/baseinfo/index'
				}
			]
		},
		component:()=>import('@/views/customer/groupphone/baseInfo')
	}
]


