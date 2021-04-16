## 初始化

创建项目并添加配置插件：`elementUI` 和依赖：`axios`

## 配置路由

删除默认代码，更改路由文件，`<router-view>` 是路由占位符

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
