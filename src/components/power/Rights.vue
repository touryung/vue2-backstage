<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 列表 -->
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="authName" label="权限名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="level" label="权限等级">
          <!-- 作用域插槽展示标签 -->
          <template v-slot="scope">
            <el-tag v-if="Number(scope.row.level) === 1">一级</el-tag>
            <el-tag type="success" v-else-if="Number(scope.row.level) === 2">
              二级
            </el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: rightListData } = await this.$axios.get("/rights/list");

      if (rightListData.meta.status !== 200) {
        return this.$message.error(rightListData.meta.msg);
      }

      this.rightList = rightListData.data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
