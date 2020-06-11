<template>
  <div>
    <el-select v-model="queryInfo.compCode" @change="sendData(queryInfo.compCode)" placeholder="请选择">
      <el-option
        v-for="item in compData"
        :key="item.companyCode"
        :label="item.companyName"
        :value="item.companyCode"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "compcon",
  data() {
    return {
      queryInfo: {
        companyCode: "",
        companyName: ""
      },
      compData: []
    };
  },
  mounted() {
    this.getCompData();
  },
  methods: {
    sendData(item){
      console.log(item)
      console.log(this.queryInfo.compCode)
      this.$emit('compData',this.compData)
      this.$emit('compCode',item)
      
    },
    async getCompData() {
      const that = this;
      const token = window.sessionStorage.getItem("token");
      const res = await this.$http.get(`external/public/listcompany`);
      if (res.status == 200) {
        if (res.data.success) {
          this.compData = res.data.data;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>