## 概述

使用到的技术

`vue2.x`、`vue-router`、`ElementUI`、`axios`、`echarts`

登录 `Token` 原理：

1. 登录页面输入用户名和密码进行登录
2. 服务器验证通过之后生成该用户的 `token` 并返回
3. 端存储该 `token`
4. 后续所有的请求都携带该 `token` 发送请求
5. 服务器端验证 `token` 是否通过

## `token` 保存

登录成功之后，将 `token` 保存到会话并跳转

```JavaScript
window.sessionStorage.setItem("token", requestResult.data.token);
this.$router.replace("/home");
```

退出登录时，将 `token` 删除并跳转

```JavaScript
window.sessionStorage.removeItem("token");
this.$router.replace("/login");
```

## 路由守卫

控制页面的访问权限，只有登陆了才可以继续进行之后的操作

```JavaScript
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
})
```

## 请求拦截

在登陆了之后访问某个需要 `token` 的页面，在请求之前添加 `header`

```JavaScript
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
```

## 第三方使用

组件一般是进行全局导入，然后按照不同的要求进行 `Vue.use`、`Vue.component` 注册

工具类似 `axios`、`lodash` 之类是导入然后绑定到 `Vue` 原型上

## 添加逻辑

1. 点击按钮弹出弹窗
2. 对弹窗表单布局
3. 关闭弹窗清除表单
4. 对表单添加验证（自定义验证）
5. 点击确定按钮进行表单预校验，发送 `post` 请求

## 修改逻辑

1. 点击按钮弹出弹窗，同时发送 `get` 请求获取数据展示
2. 不需要关闭弹窗清除表单
3. 对表单添加验证（自定义验证）
4. 点击确定按钮进行表单预校验，发送 `put` 请求

## 删除逻辑

1. 无弹窗，点击按钮弹出 `confirm` 对话框
2. 判断 `confirm` 结果，发送 `delete` 请求

## 优化

1. 生成打包报告：`vue-cli-service build --report`
2. 第三方库启用 `CDN`
3. `ElementUI` 按需加载
4. 路由懒加载
5. 首页内容定制

### 添加进度条：`nprogress`

在 `axios` 请求拦截器中进行配置，`request` 时 `start`，`response` 时 `done`

### 移除 console

安装开发依赖：`babel-plugin-transform-remove-console`

按需使用：

```JavaScript
if (process.env.NODE_ENV === "production") {
  productionPlugins.push("transform-remove-console");
}
```

### 自定义打包入口

默认打包入口为 `main.js`，根据状态不同使用不同的入口文件打包

```JavaScript
module.exports = {
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === "production", (config) => {
      config.entry("app").clear().add("./src/main-prod.js");
    });
    config.when(process.env.NODE_ENV === "development", (config) => {
      config.entry("app").clear().add("./src/main-dev.js");
    });
  },
};
```

### 第三方库启用 `CDN`

在 `vue.config.js` 的发布模式中添加第三方库 `CDN` 配置，然后在 `public/index.html` 中添加 `CDN` 链接

最后删除 `main-prod.js` 中第三方样式，删除 `elementUI` 的引入

```JavaScript
config.set("externals", {
  vue: "Vue",
  "vue-router": "VueRouter",
  axios: "axios",
  lodash: "_",
  echarts: "echarts",
  nprogress: "NProgress",
  "vue-quill-editor": "VueQuillEditor",
});
```

### 首页内容定制

在 `vue.config.js` 的发布模式中添加参数，可以使标题和外部 CDN 资源引入等可以根据模式渲染不同的内容

```JavaScript
config.plugin("html").tap((args) => {
  args[0].isProd = true;
  return args;
});
```

之后在 `public/index.html` 中可以用 `<% %>` 模板引擎语法

### 上线优化/管理

- node 中使用静态服务管理
  > `app.use(express.static("./dist"))`
- `gzip`
  > 引入 `compression` 包进行压缩
- `https`
  > 申请 `ssl` 证书，然后将下载的公钥私钥以文件形式在后台引入即可
- `pm2`
  > 管理服务，不开终端也能执行服务

## 题外：Git 合并代码

之前的登录功能是在新分支 `login` 中编写，所以需要首先提交 `login` 分支，然后合并代码，合并步骤如下：

1. `git checkout master` 将分支切换到 `master`
2. `git merge login` 将 `login` 分支合并
3. `git push` 提交 `master` 分支
