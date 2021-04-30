<template>
  <pre>
    {{ data }}
  </pre>
</template>

<script>
export default {
  data() {
    return {
      data: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let data = await this.$axios.get("menus");
      this.data = JSON.stringify(data, null, 2);
    },
  },
};
</script>

<style lang="scss" scoped></style>
