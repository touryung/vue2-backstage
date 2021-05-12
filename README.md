## 概述

使用到的技术

- `Vue`
- `Vue-router`
- `ElementUI`
- `Axios`
- `Echarts`

登录 Token 原理：

1. 登录页面输入用户名和密码进行登录
2. 服务器验证通过之后生成该用户的 `token` 并返回
3. 端存储该 `token`
4. 后续所有的请求都携带该 `token` 发送请求
5. 服务器端验证 `token` 是否通过

### 路由守卫

控制页面的访问权限，只有登陆了才可以继续进行之后的操作

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

## 题外：Git 合并代码

之前的登录功能是在新分支 `login` 中编写，所以需要首先提交 `login` 分支，然后合并代码，合并步骤如下：

1. `git checkout master` 将分支切换到 `master`
2. `git merge login` 将 `login` 分支合并
3. `git push` 提交 `master` 分支

## 添加用户逻辑

1. 点击添加按钮弹出弹窗
2. 对弹窗表单布局
3. 关闭弹窗清除表单
4. 对表单添加验证，包括自定义验证
5. 点击确定按钮进行表单预校验，发送请求

## 优化

1. 生成打包报告
2. 第三方库启用 `CDN`
3. `ElementUI` 按需加载
4. 路由懒加载
5. 首页内容定制

### 进度条：`nprogress`

在 `axios` 请求拦截器中进行配置，`request` 时 `start`，`response` 时 `done`
