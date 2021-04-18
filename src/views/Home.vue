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
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapsed"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="String(item.id)"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="String(subItem.id)"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 菜单 id 与类名映射
      iconsObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-lifangti2",
        101: "iconfont icon-s-goods",
        102: "iconfont icon-dingdan",
        145: "iconfont icon-data",
      },
      isCollapsed: false,
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
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
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
  transition: width 0.3s;
  overflow: hidden;

  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 5px;
}
.toggle-button {
  height: 24px;
  background-color: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
  user-select: none;
}
</style>
