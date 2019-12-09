// 合同管理
export default [
    ////////////////合同////////////////////

    // 合同详情
    {
        path: "/contract/contractInfo/detail",
        name: "合同管理/合同详情",
        meta: {
            defaultActive: "/contract/contractInfo/list",
            requireAuth: true,
            bread: [
                {
                    name: "合同管理",
                    path: "/contract/contractInfo/list"
                },
                {
                    name: "加盟合同",
                    path: "/contract/contractInfo/detail"
                }
            ]
        },
        component: () => import("@/views/marketing/contract/contractInfo/detail")
    },
    // 合同新增
    {
        path: "/contract/contractInfo/add",
        name: "合同管理/加盟合同/合同新增",
        meta: {
            defaultActive: "/contract/contractInfo/add",
            requireAuth: true,
            bread: [
                {
                    name: "合同管理",
                    path: "/contract/contractInfo/list"
                },
                {
                    name: "新增加盟合同",
                    path: "/contract/contractInfo/add"
                }
            ]
        },
        component: () => import("@/views/marketing/contract/contractInfo/add")
    },
    // 合同列表页
    {
        path: "contract/contractInfo/list",
        name: "合同管理/加盟列表",
        meta: {
            defaultActive: "/contract/contractInfo/list",
            requireAuth: true,
            bread: [
                {
                    name: "合同管理",
                    path: "/contract/contractInfo/list"
                },
                {
                    name: "加盟合同",
                    path: "/contract/contractInfo/list"
                }
            ]
        },
        component: () => import("@/views/marketing/contract/contractInfo/list")
    }
];
