<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加商品按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 商品表格 -->
      <tree-table
        :data="cateList"
        :columns="tableColumns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        index-text="#"
        class="tree-table"
      >
        <!-- 是否有效列 -->
        <template v-slot:isOk="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" />
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序列 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template v-slot:operate="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 导航条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 7, 9, 11]"
        :page-size="5"
        :total="totalCateNum"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
      <!-- 添加分类弹窗 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 主体内容区域 -->
        <el-form
          ref="addCateFormRef"
          :model="addCateFormData"
          label-width="80px"
          :rules="addCateFormRules"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateFormData.cat_name" />
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              :options="parentCateList"
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChanged"
              :change-on-select="true"
              clearable
            />
          </el-form-item>
        </el-form>
        <!-- 下方按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类弹窗 -->
      <el-dialog title="添加分类" :visible.sync="editCateDialogVisible" width="50%">
        <!-- 主体内容区域 -->
        <el-form
          ref="editCateFormRef"
          :model="editCateFormData"
          label-width="80px"
          :rules="addCateFormRules"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateFormData.cat_name" />
          </el-form-item>
        </el-form>
        <!-- 下方按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3, // 获取一二三级商品
        pagenum: 1,
        pagesize: 5,
      },
      totalCateNum: 0,
      // table 列定义
      tableColumns: [
        {
          label: "商品名称",
          prop: "cat_name",
        },
        // 指定模板列
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
        },
      ],
      addCateDialogVisible: false,
      addCateFormData: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      // 获取的预数据
      parentCateList: [],
      // 级联参数配置
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选中的 id
      selectedKeys: [],

      editCateDialogVisible: false,
      editCateFormData: {},
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品列表
    async getCateList() {
      const { data: cateListData } = await this.$axios.get("/categories", {
        params: this.queryInfo,
      });
      if (cateListData.meta.status !== 200) {
        return this.$message.error(cateListData.meta.msg);
      }
      this.cateList = cateListData.data.result;
      this.totalCateNum = cateListData.data.total;
    },
    // 分页事件监听
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getCateList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getCateList();
    },
    // 展示添加分类弹窗并请求级联选择器数据
    showAddCatDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: getParentCateListResult } = await this.$axios.get("/categories", {
        params: { type: 2 },
      });
      if (getParentCateListResult.meta.status !== 200) {
        return this.$message.error(getParentCateListResult.meta.msg);
      }
      this.parentCateList = getParentCateListResult.data;
      console.log(getParentCateListResult.data);
    },
    // 根据级联选择器的改变更新请求数据
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateFormData.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateFormData.cat_level = this.selectedKeys.length;
      } else {
        this.addCateFormData.cat_pid = 0;
        this.addCateFormData.cat_level = 0;
      }
    },
    // 弹窗关闭重置数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateFormData.cat_pid = 0;
      this.addCateFormData.cat_level = 0;
    },
    // 发送添加请求
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: addCateResult } = await this.$axios.post(
          "/categories",
          this.addCateFormData
        );
        if (addCateResult.meta.status !== 201) {
          return this.$message.error(addCateResult.meta.msg);
        }
        this.getCateList();
        this.addCateDialogVisible = false;
        this.$message.success(addCateResult.meta.msg);
      });
    },
    // 展示表单预数据和提交编辑请求以及关闭弹窗事件
    async showEditCateDialog(id) {
      const { data: editCateResult } = await this.$axios.get(`/categories/${id}`);
      if (editCateResult.meta.status !== 200) {
        return this.$message.error(editCateResult.meta.msg);
      }
      this.editCateFormData = editCateResult.data;
      this.editCateDialogVisible = true;
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: editCateResult } = await this.$axios.put(
          `/categories/${this.editCateFormData.cat_id}`,
          {
            cat_name: this.editCateFormData.cat_name,
          }
        );
        if (editCateResult.meta.status !== 200) {
          return this.$message.error(editCateResult.meta.msg);
        }
        this.getCateList();
        this.editCateDialogVisible = false;
        this.$message.success(editCateResult.meta.msg);
      });
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields();
    },
    // 删除商品分类
    async deleteCateById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const { data: deleteResult } = await this.$axios.delete(`/categories/${id}`);
      if (deleteResult.meta.status !== 200) {
        return this.$message.error(deleteResult.meta.msg);
      }
      this.getCateList();
      this.$message.success(deleteResult.meta.msg);
    },
  },
};
</script>

<style lang="scss" scoped>
i.el-icon-success {
  color: green;
}
i.el-icon-error {
  color: red;
}
.tree-table {
  margin-top: 15px;
}
// 级联选择器宽度占满
.el-cascader {
  width: 100%;
}
</style>
