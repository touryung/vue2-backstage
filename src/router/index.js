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
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
];

const router = new VueRouter({
  routes,
});

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

  next();
});

export default router;
