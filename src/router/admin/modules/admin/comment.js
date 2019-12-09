// 评论管理
export default [
  // 哆咖医生
  {
    path: "comment/dokaDockor",
    name: "评论管理/哆咖医生",
    meta: {
      defaultActive: "/comment/dokaDockor",
      requireAuth: true,
      bread: [
        {
          name: "评论管理",
          path: "/comment/dokaDockor"
        },
        {
          name: "哆咖医生",
          path: "/comment/dokaDockor"
        }
      ]
    },
    component: () => import("@/views/admin/comment/dokaDoctor")
  },
	// 哆咖医生
	{
		path: "/comment/dockor",
		name: "评论管理/医哆咖",
		meta: {
			defaultActive: "/comment/dockor",
			requireAuth: true,
			bread: [
				{
					name: "评论管理",
					path: "/comment/dockor"
				},
				{
					name: "医哆咖",
					path: "/comment/dockor"
				}
			]
		},
		component: () => import("@/views/admin/comment/dockor")
	}
];
