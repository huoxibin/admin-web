import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import adminViews from "./admin";
import workOrder from "./admin/exprot/work";
import { Loading } from "element-ui";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		// 运营平台登录
		{
			path: "/login",
			name: "登录",
			meta: {
				title: "登录"
			},
			component: () => import("@/views/login")
		},
		// 主页
		{
			path: "/",
			name: "home",
			//redirect: "/admin/home", //重定向到运营平台工作台
			// 进入路由需要登陆
			meta: {
				title: "哆咖智云运营平台",
				requireAuth: true,
				bread: [
					{
						name: "home",
						path: "/"
					}
				]
			},
			component: () => import("@/views/layout"),
			children: adminViews
		},
		//对接智齿，聊天的时候嵌入的web页面
		...workOrder,
		// 404 and 401
		{
			path: "/401",
			name: "401",
			// 进入路由需要登陆
			meta: {
				title: "哆咖智云运营平台"
			},
			component: () => import("@/views/error")
		},
		{
			path: "*",
			name: "404",
			// 进入路由需要登陆
			meta: {
				title: "哆咖智云运营平台"
			},
			component: () => import("@/views/error")
		}
	],
	// 跳转路由后滚动行为
	scrollBehavior () {
		return {
			x: 0,
			y: 0
		};
	}
});
//路由错误
router.onError((error) => {
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	if (isChunkLoadFailed) {
		window.location.reload();
		//router.replace(router.history.pending.fullPath);
	}
	else {
		console.log(error)
	}
});
// 路由拦截
router.beforeEach((to, from, next) => {
	// titile
	document.title = to.matched[ 0 ].meta.title;

	// 面包屑
	store.commit("SET_BREADCRUMBS", to.meta.bread);

	// 统计分析标记familNo
	if (to.path === "/count/family/list/find") {
		if (!to.fullPath.includes("familyNo")) {
			next({
				path: "/count/family/list/find",
				query: {
					familyNo: from.query.familyNo
				}
			});
		}
	}

	// 登录拦截
	if (to.meta.requireAuth) {
		//  是否需要登录
		if (store.getters.accessToken) {
			//  是否登录成功
			if (!store.getters.userInfo) {
				//  如果没有获取用户信息
				let loading = Loading.service(); //  loading
				store.dispatch("GetInfo").then(() => {
					//  获取用户信息
					loading.close(); //  关闭loading
					// 权限拦截
					if (from.path == '/login') { //从登陆过来
						if (store.getters.menuInfo) {
							const menuURL = store.getters.menuInfo.menuURL[ 0 ];
							window.sessionStorage.platformName = menuURL.menuName;
							window.sessionStorage.publicMenuInfo = JSON.stringify(store.getters.menuInfo.menu[ 0 ]);
							switch (menuURL.menuName) {
								case '营销平台': {
									router.options.routes[ 1 ].redirect = '/marketing/home';
								}
									break;
								case '基础平台': {
									router.options.routes[ 1 ].redirect = '/common/home';
								}
									break;
								case '客服平台': {
									router.options.routes[ 1 ].redirect = '/customer/home';
								}
									break;
								case '运营平台': {
									router.options.routes[ 1 ].redirect = '/admin/home';
								}
									break;
								case '监管平台': {
									window.location.href = store.getters.menuInfo.menu[ 0 ].linkUrl;
									return;
								}
									break;
								case '接口平台': {
									window.location.href = store.getters.menuInfo.menu[ 0 ].linkUrl;
									return;
								}
									break;
							}
							const toPath = router.options.routes[ 1 ].redirect;
							const adminMenu = [ ...menuURL.urlList, toPath ];
							const status = adminMenu.some(item => toPath.includes(item));


							signalInit(store.getters.userInfo.imAccid, store.getters.userInfo.imToken);


							if (status) {
								next({
									path: toPath,
									replace: true
								});
							}
							else {
								next({
									path: "/401",
									replace: true
								});
							}
						}
						else {
							alert("获取菜单失败,请刷新重试！");
						}
					}
					else {
						if (store.getters.menuInfo) {
							const menuURL = store.getters.menuInfo.menuURL.filter(
								item => item.menuName === window.sessionStorage.platformName
							);
							const toPath = to.path;
							const adminMenu = [ ...menuURL[ 0 ].urlList, ...[ "/" ] ];
							const status = adminMenu.some(item => toPath.includes(item));
							if (status) {
								next();
							}
							else {
								next({
									path: "/401",
									replace: true
								});
							}
						}
						else {
							alert("获取菜单失败,请刷新重试！");
						}
					}

				});
			}
			else {
				next();
			}
		}
		else {
			//  返回登录
			next({
				path: "/login",
				replace: true
			});
		}
	}
	else {
		document.title = to.name;
		next();
	}
});

export default router;
