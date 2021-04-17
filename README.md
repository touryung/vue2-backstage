## 概述

前后端分离，前端是基于 `Vue` 的 `SPA`

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

更改路由文件，`<router-view>` 是路由占位符，在 `App.vue` 组件中用于展示路由页面

范围根路径的路由重定向：`redirect` 属性

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

## 输入框图标

在阿里图标库中选择需要的图标，然后下载，放到素材文件夹，引入样式即可

## 发送请求

在 `api/ajax.js` 封装基础 ajax 请求，首先需要先设置 `axios` 的请求根路径

## 弹框提示

使用 `ElementUI` 中的弹窗组件，需要挂载到 `Vue` 原型，调用 `success` 和 `error` 方法，传入显示的信息

## 逻辑部分

### 路由守卫

控制页面的访问权限，只有登陆了才可以继续进行之后的操作

在 `router/index.js` 中配置路由守卫

```JavaScript
router.beforeEach((to, from, next) => {
  /*
   * to：要访问的路由
   * from：当前路由
   * next：通行函数
   *   - next()：运行通行
   *   - next("/login")：强制跳转
   */
})
```

### 表单数据绑定

```JavaScript
<el-form :model="loginFormData">
  <el-form-item prop="username">
    <el-input v-model="loginFormData.username"></el-input>
  </el-form-item>
</el-form>
```

表单使用 `:model` 将数据对象 `loginFormData` 绑定到组件上

输入框通过 `v-model` 双向绑定到 `model` 对象里的变量

### `token` 保存

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

### 其它

其它关于表单数据校验规则，预校验以及重置表单数据等逻辑在 `ElementUI` 官网都能找到详细用法

## 题外：Git 合并代码

之前的登录功能是在新分支 `login` 中编写，所以需要首先提交 `login` 分支，然后合并代码，合并步骤如下：

1. `git checkout master` 将分支切换到 `master`
2. `git merge login` 将 `login` 分支合并
3. `git push` 提交 `master` 分支
