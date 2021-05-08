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
              <el-button type="primary" :disabled="selectedKeys.length !== 3">
                添加参数
              </el-button>
            </el-col>
          </el-row>
          <!-- 展示表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand" />
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
                {{ scope.row.attr_name }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" :disabled="selectedKeys.length !== 3">
                添加属性
              </el-button>
            </el-col>
          </el-row>

          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand" />
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="参数名称" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">
                  删除
                </el-button>
                {{ scope.row.attr_name }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
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

      manyTableData: [],
      onlyTableData: [],
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

      console.log(getAttributeListResult.data);

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
        return;
      } else if (this.selectedKeys.length === 0) {
        this.getParamsList();
      }
      this.getParamsList();
    },
    async handleClick() {
      if (this.selectedKeys.length !== 3) return;
      this.getParamsList();
    },
  },
};
</script>

<style lang="scss" scoped>
.cate_option {
  margin: 15px 0;
}
</style>
