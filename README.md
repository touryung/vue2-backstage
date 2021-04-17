## 概述

前后端分离，前端是基于 Vue 的 SPA

前端技术栈

- `Vue`
- `Vue-router`
- `ElementUI`
- `Axios`
- `Echarts`

后端技术栈

- `Node.js`
- `Express`
- `Mongodb`

## 初始化

创建项目并添加配置插件：`elementUI` 和依赖：`axios`，删除默认代码

## 配置路由

更改路由文件，`<router-view>` 是路由占位符

路由重定向：`redirect`

路由懒加载：

```JavaScript
{
  path: "/login",
  component: () =>
    import(/* webpackChunkName: "login" */ "../components/Login.vue"),
}
```

## 编写页面代码

安装 `CSS` 预处理器（`sass`），`sass`，`sass-loader`，`dart-sass`

登录 Token 原理：

1. 登录页面输入用户名和密码进行登录
2. 服务器验证通过之后生成该用户的 `token` 并返回
3. 端存储该 `token`
4. 后续所有的请求都携带该 `token` 发送请求
5. 服务器端验证 `token` 是否通过

## 图标

在阿里图标库中选择需要的图标，然后下载，放到素材文件夹，引入样式即可

## 发送请求

## 弹框提示
