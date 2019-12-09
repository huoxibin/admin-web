// vue.config.js
const path = require('path');
const Compressionlugin=require('compression-webpack-plugin');
const projectRoot = path.resolve(__dirname, '../')
const Timestamp = new Date().getTime();
module.exports = {
	lintOnSave: false, //  lint 错误是否编译警告
	parallel: require("os").cpus().length > 1, // 构建时开启多进程处理babel编译
	devServer: {
		proxy: {
			//一般接口
			"/data/my": {
				target: "http://admin.dev.yidoka.cn/data/my",
				changeOrigin: true,
				pathRewrite: {
					"^/data/my": "/"
				}
			},
			//富文本的
			"/data/new": {
				target: "http://admin.dev.yidoka.cn/data/new",
				changeOrigin: true,
				pathRewrite: {
					"^/data/new": "/"
				}
			},
			//上传图片的
			"/data/uploadImg": {
				target: "http://admin.dev.yidoka.cn/data/uploadImg",
				changeOrigin: true,
				pathRewrite: {
					"^/data/uploadImg": "/"
				}
			},
			//导入excel的
			"/data/excel": {
				target: "http://admin.dev.yidoka.cn/data/excel",
				changeOrigin: true,
				pathRewrite: {
					"^/data/excel": "/"
				}
			},
			//导出Execl的
			"/data/exportExecl": {
				target: "http://admin.dev.yidoka.cn/data/exportExecl",
				changeOrigin: true,
				pathRewrite: {
					"^/data/exportExecl": "/"
				}
			}
		}
	},
	configureWebpack: { // webpack 配置
		output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
			publicPath: '/',
			filename: `[name].${ process.env.VUE_APP_VERSION }.${ Timestamp }.js`,
      chunkFilename: `[name].${ process.env.VUE_APP_VERSION }.${ Timestamp }.js`
		  //filename: `[name].js`,
			//chunkFilename: `[name].js`
		},
		plugins: [
			new Compressionlugin({
				test:/\.js$|\.html$|\.css/, //匹配文件名
				threshold:10240,//对超过10k 的文件压缩
				deleteOriginalAssets: false,//是否删除原文件
			})
		]
	},
	// chainWebpack: config => {
	// 	config.module
	// 		.rule('lint')
	// 		.test(/\.js$/)
	// 		.pre()
	// 		.exclude.add(`${process.env.BASE_URL}/src/plugins`)
	// 		.end()
	// 		// Even create named uses (loaders)
	// 		.use('eslint')
	// 		.loader('eslint-loader')
	// 		.options({
	// 			rules: {
	// 				semi: 'off'
	// 			}
	// 		});
	// }

};
