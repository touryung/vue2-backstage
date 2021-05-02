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
          <el-button type="primary">
            添加商品
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
      >
        <!-- 是否有效列 -->
        <template v-slot:isOk="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" />
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序列 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template v-slot:operate="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
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
      console.log(cateListData);
      this.cateList = cateListData.data.result;
      this.totalCateNum = cateListData.data.total;
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getCateList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getCateList();
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
</style>
