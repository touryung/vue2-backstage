<template>
  <!-- 登录整个页面容器 -->
  <div class="login-container">
    <!-- 登录区域盒子 -->
    <div class="login-box">
      <!-- 头像盒子 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- 表单区域 -->
      <el-form
        class="login-form"
        ref="loginFormRef"
        :model="loginFormData"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginFormData.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-password"
            v-model="loginFormData.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      loginFormData: {
        username: "admin",
        password: "123456",
      },
      // 表单校验规则
      loginFormRules: {
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
      },
    };
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 预校验
        if (!valid) return;
        const { data: requestResult } = await this.$axios(
          "/login",
          "POST",
          this.loginFormData
        );

        // 显示弹窗
        if (requestResult.meta.status !== 200) {
          return this.$message.error("登录失败！");
        }
        this.$message.success("登录成功！");

        // token 存储到会话窗口并跳转
        window.sessionStorage.setItem("token", requestResult.data.token);
        this.$router.replace("/home");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  position: relative;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}

.avatar-box {
  width: 150px;
  height: 150px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login-form {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 20px;

  .login-btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
