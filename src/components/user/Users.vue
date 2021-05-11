<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList" />
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
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
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditUserDialog(scope.row.id)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 导航条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalUserNum"
        background
      />
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserDialogClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        ref="addUserFormRef"
        :model="addUserFormData"
        label-width="70px"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下方按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUserDialogVisible" width="50%">
      <!-- 主体内容区域 -->
      <el-form
        ref="editUserFormRef"
        :model="editUserFormData"
        label-width="70px"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input :value="editUserFormData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下方按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ setRoleUserInfo.username }}</p>
        <p>当前的角色：{{ setRoleUserInfo.role_name }}</p>
        <p>
          分配新角色：<el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱验证规则
    let emailCheckRules = (rules, value, callback) => {
      if (/^\w+@\w+\.\w+$/.test(value)) {
        return callback();
      }
      return callback(new Error("邮箱格式错误！"));
    };
    // 手机号验证规则
    let mobileCheckRules = (rules, value, callback) => {
      if (/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
        return callback();
      }
      return callback(new Error("手机号格式错误！"));
    };
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "", // 查询参数
        pagenum: 1, // 当前页数
        pagesize: 4, // 每页条目个数
      },
      userList: [],
      totalUserNum: 0,

      // 添加用户弹窗是否显示
      addUserDialogVisible: false,
      // 添加用户信息
      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户校验规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 之间",
            trigger: "blur",
          },
        ],
        // 自定义校验规则
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: emailCheckRules, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: mobileCheckRules, trigger: "blur" },
        ],
      },

      editUserFormData: {},
      setRoleUserInfo: {},

      editUserDialogVisible: false,
      setRoleDialogVisible: false,

      roleList: [],
      selectedRoleId: "",
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
      this.totalUserNum = userListData.data.total;
    },
    // 更新每页显示条目个数
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getUserList();
    },
    // 更新页码下标
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
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
    // 关闭弹窗清除数据
    addUserDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: addUserResult } = await this.$axios.post(
          "/users",
          this.addUserFormData
        );
        console.log(addUserResult);

        if (addUserResult.meta.status !== 201) {
          return this.$message.error(addUserResult.meta.msg);
        }

        this.getUserList();
        this.addUserDialogVisible = false;
        this.$message.success(addUserResult.meta.msg);
      });
    },

    // 根据 id 展现用户信息
    async showEditUserDialog(id) {
      const { data: userInfo } = await this.$axios.get(`/users/${id}`);

      if (userInfo.meta.status !== 200) {
        return this.$message.error(userInfo.meta.msg);
      }

      this.editUserDialogVisible = true;
      this.editUserFormData = userInfo.data;
    },
    // 编辑用户信息
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: newUserInfo } = await this.$axios.put(
          `/users/${this.editUserFormData.id}`,
          {
            email: this.editUserFormData.email,
            mobile: this.editUserFormData.mobile,
          }
        );

        if (newUserInfo.meta.status !== 200) {
          return this.$message.error(newUserInfo.meta.msg);
        }

        this.getUserList();
        this.editUserDialogVisible = false;
        this.$message.success(newUserInfo.meta.msg);
      });
    },
    // 根据 id 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      const { data: removeResult } = await this.$axios.delete(`/users/${id}`);

      if (removeResult.meta.status !== 200) {
        return this.$message.error(removeResult.meta.msg);
      }

      this.getUserList();
      this.$message.success(removeResult.meta.msg);
    },
    // 展示用户信息
    async showSetRoleDialog(user) {
      this.setRoleUserInfo = user;
      // 请求角色列表
      const { data: roleResult } = await this.$axios.get("/roles");
      if (roleResult.meta.status !== 200) {
        return this.$message.error(roleResult.meta.msg);
      }
      this.roleList = roleResult.data;
      this.setRoleDialogVisible = true;
    },
    // 发送分配角色请求
    async setRole() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色！");
      }
      const { data: setRoleResult } = await this.$axios.put(
        `users/${this.setRoleUserInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );

      if (setRoleResult.meta.status !== 200) {
        return this.$message.error(setRoleResult.meta.msg);
      }

      this.getUserList();
      this.setRoleDialogVisible = false;
      this.$message.success(setRoleResult.meta.msg);
    },
    // 重置分配权限数据
    setRoleDialogClosed() {
      this.setRoleUserInfo = {};
      this.selectedRoleId = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
