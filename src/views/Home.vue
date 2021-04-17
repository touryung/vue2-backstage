<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <!-- 头部左侧 -->
      <div>
        <img src="../assets/avatar.png" alt="avatar" />
        <span>后台管理系统</span>
      </div>
      <el-button type="button" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>一级菜单</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>二级菜单</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
    };
  },
  // 生命周期函数，创建之后立即获取数据
  created() {
    this.getMenuListData();
  },
  methods: {
    // 登出
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    // 请求侧边栏数据
    async getMenuListData() {
      const { data: menuListData } = await this.$axios("/menus", "GET");
      if (menuListData.meta.status !== 200) {
        return this.$message.error(menuListData.meta.message);
      }
      this.menuList = menuListData.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    img {
      width: 50px;
    }

    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
