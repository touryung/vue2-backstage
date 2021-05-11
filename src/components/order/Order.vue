<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList" />
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="order_number" label="订单编号" />
        <el-table-column prop="order_price" label="订单价格" width="120px" />
        <el-table-column label="是否付款" width="90px">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px" />
        <el-table-column label="下单时间" width="200px">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editAddressDialogVisible = true"
            />
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="progressVisible = true"
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
        :total="totalOrderNum"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </el-card>
    <!-- 修改地址弹窗 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="editAddressDialogClosed"
    >
      <el-form
        :model="addressFormData"
        ref="editAddressFormRef"
        :rules="editGoodsFormRules"
        label-width="90px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityList"
            :props="cascaderProps"
            v-model="addressFormData.address1"
            clearable
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressFormData.address2" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度弹窗 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityList from "./citydata.js";
import progressInfo from "./progressInfo.json";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      totalOrderNum: 0,

      editAddressDialogVisible: false,
      addressFormData: {
        address1: [],
        address2: "",
      },
      editGoodsFormRules: {
        address1: [{ required: true, message: "请输入省市区/县", trigger: "blur" }],
        address2: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
      },
      cascaderProps: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover",
      },
      cityList,

      progressVisible: false,
      progressInfo: progressInfo.data,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: getOrderListResult } = await this.$axios.get("/orders", {
        params: this.queryInfo,
      });
      if (getOrderListResult.meta.status !== 200) {
        return this.$message.error(getOrderListResult.meta.msg);
      }
      this.orderList = getOrderListResult.data.goods;
      this.totalOrderNum = getOrderListResult.data.total;
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getOrderList();
    },
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getOrderList();
    },
    editAddressDialogClosed() {
      this.$refs.editAddressFormRef.resetFields();
    },
    editAddress() {},
  },
};
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
