import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: () =>
          import(/* webpackChunkName: "welcome" */ "../components/Welcome.vue"),
      },
      {
        path: "/users",
        component: () =>
          import(/* webpackChunkName: "users" */ "../components/user/Users.vue"),
      },
      {
        path: "/rights",
        component: () =>
          import(/* webpackChunkName: "rights" */ "../components/power/Rights.vue"),
      },
      {
        path: "/roles",
        component: () =>
          import(/* webpackChunkName: "roles" */ "../components/power/Roles.vue"),
      },
      {
        path: "/categories",
        component: () =>
          import(/* webpackChunkName: "categories" */ "../components/goods/Cate.vue"),
      },
      {
        path: "/params",
        component: () =>
          import(/* webpackChunkName: "params" */ "../components/goods/Params.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 登录页之间放行
  if (to.path === "/login") {
    return next();
  }

  const token = window.sessionStorage.getItem("token");
  // 不是登录页且没有 token 强制跳转
  if (!token) {
    return next("/login");
  }

  window.sessionStorage.setItem("activePath", to.path);
  next();
});

export default router;
