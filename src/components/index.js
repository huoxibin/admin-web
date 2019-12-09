import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
const requireComponent = require.context(
  // 其组件目录的相对路径
  "./base",
  // 是否查询其子目录
  false,
  // "_base-"  .vue文件
  /_base-[\w-]+\.vue$/
);
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    // 剥去文件名开头的 `./` 和结尾的扩展名

    camelCase(fileName.replace(/^\.\/_/, "").replace(/\.\w+$/, ""))
  );
  // 全局注册组件
  Vue.component(componentName, componentConfig.default || componentConfig);
});


const packageComponent = require.context(
  // 其组件目录的相对路径
  "./package",
  // 是否查询其子目录
  false,
  // "_base-"  .vue文件
  /.vue$/
);

packageComponent.keys().map(fileName => {
  const componentConfig = packageComponent(fileName);
  fileName = fileName.replace('./', "").replace(/.vue$/, '');
  const componentName = upperFirst(
	// 剥去文件名开头的 `./` 和结尾的扩展名
	camelCase('dk-' + fileName.replace("Vue", ""))
  );
  //全局注册组件
  Vue.component(componentName, componentConfig.default || componentConfig);
});

const commonComponent = require.context(
  // 其组件目录的相对路径
  "./common",
  // 是否查询其子目录
  false,
  // "_base-"  .vue文件
  /.vue$/
);
commonComponent.keys().forEach(fileName => {
  // 获取组件配置
  //debugger
  const componentConfig = commonComponent(fileName);
  fileName = fileName.replace("./", "").replace(/.vue$/, "");
  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
	// 剥去文件名开头的 `./` 和结尾的扩展名
	camelCase("sys-" + fileName.replace("vue", ""))
  );
  // 全局注册组件
  Vue.component(componentName, componentConfig.default || componentConfig);
});