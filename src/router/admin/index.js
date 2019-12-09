const requireRoutes_admin = require.context(
  // 检查目录的相对路径
  "./modules",
  // 是否查询其子目录
  true,
  // .js文件
  /[\w-]+\.js$/
);

// 定义首页子路由合集(children)
let routes = [];

// 遍历子模块push到routes集合里
requireRoutes_admin.keys().map(router => {
  const routesConfig = requireRoutes_admin(router);
  routes.push(...routesConfig.default);
});

export default routes;
