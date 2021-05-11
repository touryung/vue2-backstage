<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框和添加用户按钮 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList" />
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goGoodsAddPage">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 列表数据 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="goods_name" label="商品名称" />
        <el-table-column prop="goods_price" label="商品价格（元）" width="120px" />
        <el-table-column prop="goods_weight" label="商品重量" width="80px" />
        <el-table-column label="创建时间" width="170px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 导航条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        :total="totalGoodsNum"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </el-card>
    <!-- 编辑商品弹窗 -->
    <el-dialog title="编辑商品信息" :visible.sync="editGoodsDialogVisible" width="50%">
      <el-form :model="editGoodsFormData" ref="editGoodsFormRef">
        <el-form-item label="商品名称">
          <el-input v-model="editGoodsFormData.goods_name" />
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editGoodsFormData.goods_price" />
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="editGoodsFormData.goods_weight" />
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="editGoodsFormData.goods_number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      totalGoodsNum: 0,

      editGoodsDialogVisible: false,
      editGoodsFormData: {},
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: getGoodsListResult } = await this.$axios.get("/goods", {
        params: this.queryInfo,
      });
      if (getGoodsListResult.meta.status !== 200) {
        return this.$message.error(getGoodsListResult.meta.msg);
      }
      this.goodsList = getGoodsListResult.data.goods;
      this.totalGoodsNum = getGoodsListResult.data.total;
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getGoodsList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getGoodsList();
    },
    async removeGoodsById(goods_id) {
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
      const { data: deleteResult } = await this.$axios.delete(`goods/${goods_id}`);
      if (deleteResult.meta.status !== 200) {
        return this.$message.error(deleteResult.meta.msg);
      }
      this.getGoodsList();
      this.$message.success(deleteResult.meta.msg);
    },
    // 跳转到添加路由
    goGoodsAddPage() {
      this.$router.push("/goods/add");
    },

    async showEditDialog(goods_id) {
      const { data: getGoodsResult } = await this.$axios.get(`goods/${goods_id}`);
      if (getGoodsResult.meta.status !== 200) {
        return this.$message.error(getGoodsResult.meta.msg);
      }
      this.editGoodsFormData = getGoodsResult.data;
      this.editGoodsDialogVisible = true;
    },
    editGoods() {
      this.$refs.editGoodsFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: editGoodsResult } = await this.$axios.put(
          `goods/${this.editGoodsFormData.goods_id}`,
          this.editGoodsFormData
        );
        if (editGoodsResult.meta.status !== 200) {
          return this.$message.error(editGoodsResult.meta.msg);
        }
        this.editGoodsDialogVisible = false;
        this.getGoodsList();
        this.$message.success("修改商品成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
