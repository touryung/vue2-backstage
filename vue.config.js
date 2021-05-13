module.exports = {
  // 链式配置
  chainWebpack: (config) => {
    // 发布模式
    config.when(process.env.NODE_ENV === "production", (config) => {
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js");

      // 通过 externals 加载外部 CDN
      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        lodash: "_",
        echarts: "echarts",
        nprogress: "NProgress",
        "vue-quill-editor": "VueQuillEditor",
      });

      // 添加参数
      config.plugin("html").tap((args) => {
        args[0].isProd = true;
        return args;
      });
    });
    // 开发模式
    config.when(process.env.NODE_ENV === "development", (config) => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js");
    });
  },
};
