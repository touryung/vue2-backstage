<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      />
      <!-- 选择分类 -->
      <el-row class="cate_option">
        <el-col>
          <span>请选择商品商品分类：</span>
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="handleCateChanged"
            clearable
          />
        </el-col>
      </el-row>
      <!-- 选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-row>
            <el-col>
              <el-button
                type="primary"
                :disabled="selectedKeys.length !== 3"
                @click="addDialogVisible = true"
              >
                添加参数
              </el-button>
            </el-col>
          </el-row>
          <!-- 展示表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 普通标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttrValByIdx(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 新标签输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
                <!-- 新标签添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamById(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                :disabled="selectedKeys.length !== 3"
                @click="addDialogVisible = true"
              >
                添加属性
              </el-button>
            </el-col>
          </el-row>

          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 普通标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttrValByIdx(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 新标签输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
                <!-- 新标签添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamById(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addFormData"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addFormData.attr_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        ref="editFormRef"
        :model="editFormData"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editFormData.attr_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联器及 tab 数据
      cateList: [],
      // 级联参数配置
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      selectedKeys: [],
      activeName: "many",

      // 表格数据
      manyTableData: [],
      onlyTableData: [],
      // 添加对话框数据
      addDialogVisible: false,
      addFormData: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      },

      editDialogVisible: false,
      editFormData: {
        attr_name: "",
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取级联数据
    async getCateList() {
      const { data: getCateListResult } = await this.$axios.get("/categories", {
        params: { type: 3 },
      });
      if (getCateListResult.meta.status !== 200) {
        return this.$message.error(getCateListResult.meta.msg);
      }
      this.cateList = getCateListResult.data;
    },
    // 获取参数列表
    async getParamsList() {
      const { data: getAttributeListResult } = await this.$axios.get(
        `/categories/${this.selectedKeys[2]}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (getAttributeListResult.meta.status !== 200) {
        return this.$message.error(getAttributeListResult.meta.msg);
      }

      getAttributeListResult.data.forEach((item) => {
        // 将字符串分割成数组渲染标签（防止空字符串）
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 独立渲染文本框，防止联动
        item.inputVisible = false;
        item.inputValue = "";
      });

      // 根据 tab 设置表格数据
      if (this.activeName === "many") {
        this.manyTableData = getAttributeListResult.data;
      } else {
        this.onlyTableData = getAttributeListResult.data;
      }
    },
    // 级联选择器改变触发
    handleCateChanged() {
      // 只能获取第三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      this.getParamsList();
    },
    async handleClick() {
      if (this.selectedKeys.length !== 3) return;
      this.getParamsList();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 发送添加参数请求
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: addParamsResult } = await this.$axios.post(
          `/categories/${this.selectedKeys[2]}/attributes`,
          {
            attr_name: this.addFormData.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (addParamsResult.meta.status !== 201) {
          return this.$message.error(addParamsResult.meta.msg);
        }
        this.getParamsList();
        this.addDialogVisible = false;
        this.$message.success(addParamsResult.meta.msg);
      });
    },
    // 获取默认项逻辑
    async showEditDialog(attr_id) {
      const {
        data: getParamResult,
      } = await this.$axios.get(
        `/categories/${this.selectedKeys[2]}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (getParamResult.meta.status !== 200) {
        return this.$message.error(getParamResult.meta.msg);
      }
      this.editFormData = getParamResult.data;
      this.editDialogVisible = true;
    },
    // 修改参数逻辑
    async editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: editParamsResult } = await this.$axios.put(
          `/categories/${this.selectedKeys[2]}/attributes/${this.editFormData.attr_id}`,
          {
            attr_name: this.editFormData.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (editParamsResult.meta.status !== 200) {
          return this.$message.error(editParamsResult.meta.msg);
        }
        this.getParamsList();
        this.editDialogVisible = false;
        this.$message.success(editParamsResult.meta.msg);
      });
    },
    // 删除参数逻辑
    async removeParamById(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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
        `/categories/${this.selectedKeys[2]}/attributes/${attr_id}`
      );
      if (deleteResult.meta.status !== 200) {
        return this.$message.error(deleteResult.meta.msg);
      }
      this.getParamsList();
      this.$message.success(deleteResult.meta.msg);
    },
    showInput(row) {
      row.inputVisible = true;
      // 页面重新渲染之后获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInputRef.$refs.input.focus();
      });
    },
    // 发送更新值请求
    async saveAttrVals(row) {
      const { data: addAttrValsResult } = await this.$axios.put(
        `/categories/${this.selectedKeys[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (addAttrValsResult.meta.status !== 200) {
        return this.$message.error(addAttrValsResult.meta.msg);
      }
      this.$message.success(addAttrValsResult.meta.msg);
    },
    // 文本框确认事件
    async handleInputConfirm(row) {
      // 必须输入内容
      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue.trim());
        this.saveAttrVals(row);
      }
      row.inputValue = "";
      row.inputVisible = false;
    },
    // 删除属性值
    removeAttrValByIdx(row, idx) {
      row.attr_vals.splice(idx, 1);
      this.saveAttrVals(row);
    },
  },
  computed: {
    // 计算弹窗标题
    dialogTitle() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style lang="scss" scoped>
.cate_option {
  margin: 15px 0;
}
.input-new-tag {
  width: 120px;
}
</style>
