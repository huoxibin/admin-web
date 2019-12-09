# router

- 菜单页

  ```javaScript
  /**
   *  keepAlive     该路由是否要使用 keep alive 缓存
   *  defaultActive 该路由默认指向的菜单路径
   *  requireAuth   该路由是否需要登录才能访问
   */
  {
    path: "first/second",
    name: "二级菜单",
    meta: {
      keepAlive: true,
      defaultActive: "/first/second",
      requireAuth: true,
      bread: [
        {
          name: "一级菜单",
          path: "/first/second"
        },
        {
          name: "二级菜单",
          path: "/first/second"
        }
      ]
    },
    component: () => import("@/views/admin/first/second")
  }
  ```

- 非菜单页

  ```javaScript
  {
    path: "first/second/:type",
    name: "二级菜单 - 编辑",
    meta: {
      keepAlive: true,
      defaultActive: "/first/second",
      requireAuth: true,
      bread: [
        {
          name: "一级菜单",
          path: "/first/second"
        },
        {
          name: "二级菜单",
          path: "/first/second"
        },
        {
          name: "编辑",
          path: "/first/second/edit"
        }
      ]
    },
    component: () => import("@/views/admin/first/second/edit.vue")
  }
  ```
