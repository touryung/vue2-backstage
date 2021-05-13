<template>
  <el-card>
    {{ data }}
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      data: "Welcome",
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-card {
  text-align: center;
}
</style>
