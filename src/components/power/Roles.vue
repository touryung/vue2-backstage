<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开权限 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="item in scope.row.children"
              :key="item.id"
              :class="['border-bottom vcenter', index === 0 ? 'border-top' : '']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="item2 in item.children"
                  :key="item2.id"
                  :class="['vcenter', index2 === 0 ? '' : 'border-top']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditRoleDialog(scope.row.id)"
              size="mini"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        ref="editRoleFormRef"
        :model="editRoleFormData"
        label-width="80px"
        :rules="editRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下方按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <el-form
        ref="addRoleFormRef"
        :model="addRoleFormData"
        label-width="80px"
        :rules="editRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下方按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        :default-checked-keys="defaultKeys"
        ref="treeRef"
        show-checkbox
        default-expand-all
      />
      <!-- 下方按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">
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
      roleList: [],
      editRoleDialogVisible: false,
      editRoleFormData: {},
      editRoleFormRules: {
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        roleDesc: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
      },
      addRoleDialogVisible: false,
      addRoleFormData: {},
      setRightDialogVisible: false,
      // 树形权限列表
      rightsList: [],

      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的选项
      defaultKeys: [],
      // 当前分配权限的角色 id
      allotRightsRoleId: "",
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: roleListData } = await this.$axios.get("/roles");
      if (roleListData.meta.status !== 200) {
        return this.$message.error(roleListData.meta.msg);
      }
      this.roleList = roleListData.data;
    },

    // 显示编辑弹窗
    async showEditRoleDialog(id) {
      const { data: roleInfo } = await this.$axios.get(`/roles/${id}`);
      if (roleInfo.meta.status !== 200) {
        return this.$message.error(roleInfo.meta.mag);
      }
      this.editRoleFormData = roleInfo.data;
      this.editRoleDialogVisible = true;
    },

    // 发送编辑请求
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: newRoleInfo } = await this.$axios.put(
          `/roles/${this.editRoleFormData.roleId}`,
          {
            roleName: this.editRoleFormData.roleName,
            roleDesc: this.editRoleFormData.roleDesc,
          }
        );
        if (newRoleInfo.meta.status !== 200) {
          return this.$message.error(newRoleInfo.meta.msg);
        }
        this.editRoleDialogVisible = false;
        this.getRoleList();
        this.$message.success(newRoleInfo.meta.msg);
      });
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: addRoleData } = await this.$axios.post(
          "/roles",
          this.addRoleFormData
        );
        if (addRoleData.meta.status !== 201) {
          return this.$message.error(addRoleData.meta.msg);
        }
        this.addRoleDialogVisible = false;
        this.getRoleList();
        this.$message.success(addRoleData.meta.msg);
      });
    },

    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields();
    },

    // 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: removeResult } = await this.$axios.delete(`/roles/${id}`);
      if (removeResult.meta.status !== 200) {
        return this.$message.error(removeResult.meta.msg);
      }
      this.getRoleList();
      this.$message.success(removeResult.meta.msg);
    },

    async removeRightById(row, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: deleteResult } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      );
      if (deleteResult.meta.status !== 200) {
        return this.$message.error(deleteResult.meta.msg);
      }
      // this.getRoleList();
      // 避免全部重新渲染
      row.children = deleteResult.data;
      this.$message.success(deleteResult.meta.msg);
    },
    // 展示分配权限弹窗
    async showSetRightDialog(role) {
      const { data: getRightsResult } = await this.$axios.get("/rights/tree");

      if (getRightsResult.meta.status !== 200) {
        return this.$message.error(getRightsResult.meta.msg);
      }
      // 清空权限 id
      this.defaultKeys = [];
      // 保存角色 id
      this.allotRightsRoleId = role.id;
      this.getLeafKeys(role, this.defaultKeys);
      this.rightsList = getRightsResult.data;
      this.setRightDialogVisible = true;
    },

    // 递归获取三级权限 id
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 分配权限请求
    async allotRights() {
      // 获取全选半选 id
      const keysStr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ].join(",");

      // 发送请求
      const { data: newRightResult } = await this.$axios.post(
        `roles/${this.allotRightsRoleId}/rights`,
        {
          rids: keysStr,
        }
      );
      if (newRightResult.meta.status !== 200) {
        return this.$message.error(newRightResult.meta.msg);
      }
      this.getRoleList();
      this.setRightDialogVisible = false;
      this.$message.success(newRightResult.meta.msg);
    },
  },
};
</script>

<style lang="scss" scoped>
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
