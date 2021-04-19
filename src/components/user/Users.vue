<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            />
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserdialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="#" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <!-- 状态列 -->
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="handleStateChange(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip
              effect="dark"
              content="操作"
              placement="top"
              :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" size="mini" />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="权限"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" />
            </el-tooltip>
            {{ scope.row.mg_state }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 导航条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="提示" :visible.sync="addUserdialogVisible" width="50%">
      <!-- 主体内容区域 -->
      <span>主体内容区域</span>
      <!-- 下方按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserdialogVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "", // 查询参数
        pagenum: 1, // 当前页数
        pagesize: 4, // 每页条目个数
      },
      userList: [],
      total: 0,
      addUserdialogVisible: false,
    };
  },
  // 创建之后立即请求
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户信息
    async getUserList() {
      const { data: userListData } = await this.$axios.get("/users", {
        params: this.queryInfo,
      });

      if (userListData.meta.status !== 200) {
        return this.$message.error(userListData.meta.message);
      }
      this.userList = userListData.data.users;
      this.total = userListData.data.total;
    },
    // 更新每页显示条目个数
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getUserList();
    },
    // 更新页码下标
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getUserList();
    },
    // 更新用户状态并保存到服务器
    async handleStateChange(userInfo) {
      let { data: newUserInfo } = await this.$axios.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      );

      if (newUserInfo.meta.status !== 200) {
        // 保存出错要恢复状态
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("设置用户状态失败！");
      }
      this.$message.success(newUserInfo.meta.msg);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
</style>
