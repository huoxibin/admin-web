// 客户管理
export default [
    ////////////////意向////////////////////

    // 意向详情
    {
        path: "/custorm/intention/detail",
        name: "客户管理/意向查看",
        meta: {
            defaultActive: "/custorm/intention/list",
            requireAuth: true,
            bread: [
                {
                    name: "客户管理",
                    path: "/custorm/intention/list"
                },
                {
                    name: "意向查看",
                    path: "/custorm/intention/detail"
                }
            ]
        },
        component: () => import("@/views/marketing/custorm/intention/detail")
    },
    // 意向新增
    {
        path: "/custorm/intention/add",
        name: "客户管理/意向新增",
        meta: {
            defaultActive: "/custorm/intention/add",
            requireAuth: true,
            bread: [
                {
                    name: "客户管理",
                    path: "/custorm/intention/list"
                },
                {
                    name: "线索新增",
                    path: "/custorm/intention/add"
                }
            ]
        },
        component: () => import("@/views/marketing/custorm/intention/add")
    },
    // 意向列表页
    {
        path: "/custorm/intention/list",
        name: "客户管理/意向",
        meta: {
            defaultActive: "/custorm/intention/list",
            requireAuth: true,
            bread: [
                {
                    name: "客户管理",
                    path: "/custorm/intention/list"
                },
                {
                    name: "全部意向",
                    path: "/custorm/intention/list"
                }
            ]
        },
        component: () => import("@/views/marketing/custorm/intention/list")
    },
    ////////////////线索////////////////////

    // 线索详情
    {
        path: "/custorm/clue/detail",
        name: "线索管理/线索查看",
        meta: {
            defaultActive: "/custorm/clue/list",
            requireAuth: true,
            bread: [
                {
                    name: "线索管理",
                    path: "/custorm/clue/list"
                },
                {
                    name: "线索查看",
                    path: "/custorm/clue/detail"
                }
            ]
        },
        component: () => import("@/views/marketing/custorm/clue/detail")
    },
    // 线索新增
    {
        path: "/custorm/clue/add",
        name: "客户管理/线索编辑",
        meta: {
            defaultActive: "/custorm/clue/add",
            requireAuth: true,
            bread: [
                {
                    name: "线索管理",
                    path: "/custorm/clue/list"
                },
                {
                    name: "线索编辑",
                    path: "/custorm/clue/add"
                }
            ]
        },
        component: () => import("@/views/marketing/custorm/clue/add")
    },
    // 线索列表页
    {
        path: "/custorm/clue/list",
        name: "客户管理/线索",
        meta: {
            defaultActive: "/custorm/clue/list",
            requireAuth: true,
            bread: [
                {
                    name: "线索管理",
                    path: "/custorm/clue/list"
                },
                {
                    name: "全部线索",
                    path: "/custorm/clue/list"
                }
            ]
        },
        component: () => import("@/views/marketing/custorm/clue/list")
    }
];
