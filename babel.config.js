const productionPlugins = [];

// 发布模式才运行的插件
if (process.env.NODE_ENV === "production") {
  productionPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
    ...productionPlugins,
  ],
};
