<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false" />
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="Number(activeIndex)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>
      <el-form
        :model="addFormData"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="handleTabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFormData.goods_name" />
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFormData.goods_price" />
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFormData.goods_weight" />
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFormData.goods_number" />
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                :props="cascaderProps"
                v-model="addFormData.goods_cat"
                @change="handleCateChanged"
                clearable
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(attr, i) in item.attr_vals"
                  :key="i"
                  :label="attr"
                  border
                  size="mini"
                />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeader"
              list-type="picture"
              :on-success="handleUploadSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFormData.goods_introduce"></quill-editor>
            <el-button type="primary" class="goods-add-btn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewUrl" alt="preview" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      addFormData: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        goods_cat: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
      },

      cateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },

      manyTableData: [],
      onlyTableData: [],

      uploadUrl: "http://www.ysqorz.top:8888/api/private/v1/upload",
      uploadHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewUrl: "",

      previewDialogVisible: false,
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
    // 级联选择器改变触发
    handleCateChanged() {
      // 只能获取第三级分类
      if (this.addFormData.goods_cat.length !== 3) {
        this.addFormData.goods_cat = [];
        return;
      }
    },
    // 标签切换钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addFormData.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        // 不跳转
        return false;
      }
    },
    // 切换标签
    async handleTabClicked() {
      // 上面的钩子不通过的话 activeIndex 不会更新
      switch (this.activeIndex) {
        case "1": {
          const { data: getGoodsAttrResult } = await this.$axios.get(
            `/categories/${this.cateId}/attributes/`,
            {
              params: { sel: "many" },
            }
          );
          if (getGoodsAttrResult.meta.status !== 200) {
            return this.$message.error(getGoodsAttrResult.meta.msg);
          }

          getGoodsAttrResult.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });

          this.manyTableData = getGoodsAttrResult.data;
          break;
        }
        case "2": {
          const { data: getGoodsAttrResult } = await this.$axios.get(
            `/categories/${this.cateId}/attributes/`,
            {
              params: { sel: "only" },
            }
          );
          if (getGoodsAttrResult.meta.status !== 200) {
            return this.$message.error(getGoodsAttrResult.meta.msg);
          }
          this.onlyTableData = getGoodsAttrResult.data;
          break;
        }
      }
    },
    // 上传成功
    handleUploadSuccess(response) {
      console.log(response);
      this.addFormData.pics.push({ pic: response.data.tmp_path });
    },
    // 移除事件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      this.addFormData.pics = this.addFormData.pics.filter((v) => v.pic !== filePath);
    },
    handlePreview(file) {
      this.previewUrl =
        this.uploadUrl
          .split("/")
          .slice(0, -4)
          .join("/") +
        "/" +
        file.response.data.url
          .split("/")
          .slice(-2)
          .join("/");
      this.previewDialogVisible = true;
    },
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        // 深拷贝防止级联选择器报错
        const formData = this.$_.cloneDeep(this.addFormData);
        formData.goods_cat = formData.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          this.addFormData.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          });
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          this.addFormData.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          });
        });
        formData.attrs = this.addFormData.attrs;
        console.log(formData);
        const { data: addGoodsResult } = await this.$axios.post("/goods", formData);

        if (addGoodsResult.meta.status !== 201) {
          return this.$message.error(addGoodsResult.meta.msg);
        }
        this.$message.success(addGoodsResult.meta.msg);
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    cateId() {
      if (this.addFormData.goods_cat.length === 3) {
        return this.addFormData.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preview-img {
  width: 100%;
}
.goods-add-btn {
  margin-top: 15px;
}
</style>
