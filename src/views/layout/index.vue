<template>
  <!-- index -->
  <div class="home">
    <!-- header -->
    <admin-header @togglePlatform="togglePlatform"/>

    <!-- main -->
    <div class="main">
      <!-- nav -->
      <div class="navMenu">
        <!-- Switch开关 -->
        <div class="navTab">
          <el-switch
            :width="switchWidth"
            v-model="navTab"
            @change="tabNav"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>

        <!--首页菜单列表 -->

        <!-- 导航菜单列表 -->
        <el-menu
          v-if="menuInfo"
          class="el-menu-vertical-demo"
          :default-active="$route.meta.defaultActive"
          active-text-color="#007fb8"
          background-color="#eaeaea"
          router
          unique-opened
          :collapse="!navTab"
        >
          <el-menu-item
            v-if="hashome"
            :index="home.linkUrl"
          >
            <i :class="home.icon"></i>
            <span>{{home.menuName}}</span>
          </el-menu-item>
          <el-submenu
            v-for="(first, firstIndex) in menu"
            :key="firstIndex"
            :index="first.linkUrl"
          >
            <!-- 一级标题 -->
            <template slot="title">
              <i :class="first.icon"></i>
              <span>{{ first.menuName }}</span>
            </template>

            <!-- 二级标题（没有三级） -->
            <el-menu-item
              v-if="first.children.length !== 0 && second.children.length === 0"
              v-for="(second, secondIndex) in first.children"
              :key="secondIndex"
              :index="second.linkUrl"
            >
              <i :class="second.icon"></i>
              <span>{{ second.menuName }}</span>
            </el-menu-item>

            <!-- 二级标题（有三级） -->
            <el-submenu
              v-if="first.children.length !== 0 && second.children.length !== 0"
              v-for="(second, secondIndex) in first.children"
              :key="secondIndex"
              :index="second.linkUrl"
            >
              <template slot="title">
                <i :class="second.icon"></i>
                <span>{{ second.menuName }}</span>
              </template>

              <!-- 三级标题 -->
              <el-menu-item
                v-for="(third, thirdIndex) in second.children"
                :key="thirdIndex"
                :index="third.linkUrl"
              >
                <i :class="third.icon"></i>
                <span>{{ third.menuName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </div>

      <!-- show -->
      <div class="content">
        <!-- bread -->
        <div class="bread">
          <el-breadcrumb
            style="line-height: 40px;"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item
              v-for="(item, index) in breadCrumbs"
              :key="index"
              :to="item.path"
            >{{ item.name }}
            </el-breadcrumb-item
            >
          </el-breadcrumb>
          <el-button
            @click="refresh"
            size="mini"
            type="primary"
            icon="el-icon-refresh"
          >刷 新
          </el-button
          >
        </div>

        <!-- router -->
        <div class="show">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </div>
    </div>

    <!-- footer -->
    <admin-footer/>
  </div>
</template>

<script>
	import { getCookie, setCookie, removeCookie } from "@/utils/cookie";
	import adminHeader from "./header";
	import adminFooter from "./footer";
	import "./icon.css";
	import { mapGetters } from "vuex";

	export default {
		components: {adminHeader, adminFooter},
		computed: {
			...mapGetters([ "breadCrumbs" ]),
			// ...mapGetters(["accessToken", "menuInfo", "breadCrumbs"]),
			// menu() {
			//   const menus = this.menuInfo.menu;
			//   const menu = menus.filter(item => item.menuName === "运营平台");
			//   return menu[0].children;
			// }
		},
		data () {
			return {
				switchWidth: 50,
				navTab: true,
				menus: JSON.parse(sessionStorage.publicMenuInfo),
				menu: [],
				menuInfo: this.$store.getters.menuInfo,
				home: {},
				hashome: false
			};
		},
		methods: {
			refresh () {
				//this.$router.push(this.$router.history.current.path);
				window.location.reload();
			},
			tabNav (val) {
				this.navTab = val;
			},
			togglePlatform (menuName) {
				let _menu = this.$store.getters.menuInfo.menu.filter(item => item.menuName === menuName);

				if(menuName!=='接口平台' && menuName!=='监管平台'){
					this.menu = _menu[ 0 ].children;
					window.sessionStorage.publicMenuInfo = JSON.stringify(_menu[ 0 ]);
					this.home = [];
					this.getHome(menuName); //设置不同的平台的home 页
				}

				switch (menuName) {
					case "运营平台":
						window.sessionStorage.platformName = "运营平台";
						this.$router.push({
							path: "/admin/home"
						});
						break;

					case "营销平台":
						window.sessionStorage.platformName = "营销平台";
						this.$router.push({
							path: "/marketing/home"
						})
						break;
					case "基础平台":
						window.sessionStorage.platformName = "基础平台";
						this.$router.push({
							path: "/common/home"
						})
						break;
					case "客服平台":
						window.sessionStorage.platformName = "客服平台";
						this.$router.push({
							path: "/customer/home"
						})
						break;
					case "接口平台": {
						//window.sessionStorage.platformName = "接口平台";
						window.open(_menu[ 0 ].linkUrl);
					}
						break;
					case "监管平台":
						//window.sessionStorage.platformName = "监管平台";
						window.open(_menu[ 0 ].linkUrl);
						break;
				}
			},
			getHome (name) {
        if(name!=='接口平台'){
					let homeInfo = this.$store.getters.homeInfo;
					let that = this;
					that.hashome = false;
					homeInfo.forEach(item => {
						if (item.platform == name) {
							that.home = item;
							that.hashome = true;
						}
					})
        }
			},
		},
		mounted () {
			this.menu = this.menus.children;
			this.getHome(this.menus.menuName);
		}
	};
</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-flow: column wrap;
    overflow: hidden;
  }

  .main {
    width: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .content {
    flex: 1;
    height: auto;
    display: flex;
    overflow: hidden;
    flex-flow: column wrap;
  }

  .bread {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    background: rgba(238, 246, 248, 1);
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .show {
    width: 100%;
    flex: 1;
    overflow: auto;
    position: relative;
  }

  .navMenu {
    width: auto;
    height: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    background: #eaeaea;
    border-right: 1px solid #ccc;
  }

  .navTab {
    display: flex;
    background: #fff;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-submenu__title {
    height: 60px;
    line-height: 60px;
  }

  .red {
    background: red;
  }
</style>
