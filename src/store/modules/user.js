import { getCookie, setCookie, removeCookie } from "@/utils/cookie";
import { LoginIn, GetInfo, LoginOut, ChangeToken } from "@/api/login";
import axios from "axios";

const user = {
	state: {
		accessToken: getCookie("accessToken"), //  请求token
		refreshToken: getCookie("refreshToken"), //  换取token
		userId: getCookie("userId"), //  用户ID
		menuInfo: null, //  用户菜单
		userInfo: null, //  用户信息
		breadCrumbs: null, //  面包屑
		publicMenuInfo: null, //临时存放个平台菜单
		userLoginState: null, // 用户登录状态
		trafficChannel: null,//组别
	},

	mutations: {
		// trafficChannel
		SET_ChANNEL: (state, trafficChannel) => {
			state.trafficChannel = trafficChannel;
		},
		// token
		SET_USERSTATE: (state, loginInfo) => {
			state.userLoginState = loginInfo.userLoginState;
		},
		// token
		SET_TOKEN: (state, loginInfo) => {
			state.accessToken = loginInfo.accessToken;
			state.refreshToken = loginInfo.refreshToken;
		},
		// userId
		SET_USERID: (state, userId) => {
			state.userId = userId;
		},
		// menuInfo
		SET_MENUINFO: (state, menuInfo) => {
			state.menuInfo = menuInfo;
		},
		// userInfo
		SET_USERINFO: (state, userInfo) => {
			state.userInfo = userInfo;
		},
		// homeInfo
		SET_HOMEINFO: (state, homeInfo) => {
			state.homeInfo = homeInfo;
		},
		// breadCrumbs
		SET_BREADCRUMBS: (state, breadCrumbs) => {
			state.breadCrumbs = breadCrumbs;
		},
		// clear
		CLEAR_INFO: state => {
			state.accessToken = null;
			state.refreshToken = null;
			state.userId = null;
			state.menuInfo = null;
			state.userInfo = null;
			state.homeInfo = null;
		}
	},
	actions: {
		// 登录
		LoginIn ({commit}, data) {
			return new Promise((resolve, reject) => {
				LoginIn(data.loginName, data.pwd)
					.then(res => {
						let state = 0;
						if (res.state === 0) {
							const data = res.data;
							if (data.menuInfo.menuURL.length === 0) {
								state = "该用户无权限登录！";
							}
							commit("SET_TOKEN", data.loginInfo);
							setCookie("accessToken", data.loginInfo.accessToken);
							setCookie("refreshToken", data.loginInfo.refreshToken);
							commit("SET_USERID", data.loginInfo.id);
							setCookie("userId", data.loginInfo.id);
						}
						else {
							state = res.msg;
						}
						resolve(state);
					})
					.catch(error => {
						reject(error);
					});
			});
		},

		// 换取token
		ChangeToken ({commit}) {
			return new Promise((resolve, reject) => {
				ChangeToken()
					.then(res => {
						let state = 0;
						if (res.state === 0) {
							const data = res.data;
							commit("SET_TOKEN", data);
							setCookie("accessToken", data.accessToken);
							setCookie("refreshToken", data.refreshToken);
							commit("SET_USERID", data.loginInfo.id);
							setCookie("userId", data.loginInfo.id);
						}
						else {
							state = res.msg;
						}
						resolve(state);
					})
					.catch(error => {
						reject(error);
					});
			});
		},

		// 获取信息

		GetInfo ({commit}) {
			return new Promise((resolve, reject) => {
				GetInfo()
					.then(res => {
						let state = 0;
						if (res.state === 0) {
							const data = res.data;
							//增加平台的home 菜单项目
							let homeInfo = [
								{
									icon: "news-icon",
									id: -1,
									platform: '营销平台',
									menuName: "首页",
									linkUrl: '/marketing/home'
								},
								{
									icon: "news-icon",
									id: -1,
									platform: '客服平台',
									menuName: "首页",
									linkUrl: '/customer/home'
								},
								{
									icon: "news-icon",
									id: -1,
									platform: '运营平台',
									menuName: "首页",
									linkUrl: '/admin/home'
								}
							]
							commit("SET_USERINFO", data.userInfo);
							commit("SET_HOMEINFO", homeInfo);
							commit("SET_MENUINFO", data.menuInfo);
							commit('SET_ChANNEL', data.trafficChannel);
							if (!window.sessionStorage.publicMenuInfo) {
								window.sessionStorage.publicMenuInfo = JSON.stringify(data.menuInfo.menu[ 0 ]);
								window.sessionStorage.platformName = data.menuInfo.menu[ 0 ].menuName;
							}
							// 每隔一分钟获取用户登录状态
							setInterval(() => {
								let url = '/ap/login/resetLastLoginTime';
								axios
									.post("/data/my", {
										pathL: url
									})
									.then(response => {
									})
									.catch(err => {
										reject(err);
									});
							}, 60000)
						}
						else {
							state = res.msg;
						}
						resolve(state);
					})
					.catch(error => {
						reject(error);
					});
			});
		},

		// 退出
		LoginOut ({commit}) {
			return new Promise((resolve, reject) => {
				LoginOut()
					.then(res => {
						let state = 0;
						if (res.state === 0) {
							commit("CLEAR_INFO");
							removeCookie("accessToken");
							removeCookie("refreshToken");
							removeCookie("userId");
							sessionStorage.clear();
						}
						else {
							state = res.msg;
						}
						resolve(state);
					})
					.catch(error => {
						reject(error);
					});
			});
		},

		ChangeChannel ({commit}, val) {
			commit('SET_ChANNEL', val)
		}
	}
};

export default user;
