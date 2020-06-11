<!-- 泊位信息上报 -->
<template>
  <div class="box">
    <!-- 查询  -->
    <div class="selectBox">
      <el-form size="mini" :model="form" inline>
       <el-form-item label="">
            <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- 查询按钮 -->
          <el-button type="primary" icon="el-icon-search" >查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button plain icon="el-icon-upload"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 缆桩弹出 -->

    <!-- 泊位数据列表 -->
    <keep-alive>
      <el-table
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        :max-height="curHeight"
        style="width: 100%"
      >
        <el-table-column prop="berthName" label="拖轮" width></el-table-column>
        <el-table-column prop="lanzhuang" label="马力" width></el-table-column>
        <el-table-column prop="name" label="联系人" width></el-table-column>
        <el-table-column prop="phone" label="联系电话" width></el-table-column>
        <el-table-column  label="是否可用" width>
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.sat"
                    active-color="#338CE8"
                    inactive-color="#C2C9D3">
                </el-switch>
            </template>
        </el-table-column>
      </el-table>
    </keep-alive>
    <!-- 分页区域 -->
    <div class="page">
        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="100">
        </el-pagination>
    </div>
  </div>
</template>

<script>
// import bittInfoList from "./bittInfoList.vue";
export default {
  name: "tugboat",
//   components: { bittInfoList },
  data() {
    return {
      input:'',
      sat:true,
      form: {},
      curHeight:'0',
      tableData: [{
        "berthName":"拖轮1#",
        "lanzhuang" :"1500",
        "name" :'王小明',
        "phone":"001",
        "berthDeepth":"001"
      },
      {
        "berthName":"拖轮2#",
        "lanzhuang" :"1000",
        "name" :"李志军",
        "phone":"14658965255",
        "berthDeepth":"001"
      },
      {
        "berthName":"拖轮3#",
        "lanzhuang" :"1500",
        "name" :"方文山",
        "phone":"001",
        "berthDeepth":"001"
      },
      {
        "berthName":"拖轮4#",
        "lanzhuang" :"800",
        "name" :"李志军",
        "phone":"001",
        "berthDeepth":"001"
      },
      {
        "berthName":"拖轮5#",
        "lanzhuang" :"900",
        "name" :"李都是",
        "phone":"15558525698",
        "berthDeepth":"001"
      },
      ],
      // 查询
      queryall: {
        startpage: 1,
        pagesize: 10
      },

      // 分页
      totalNum: 1,
      // 当前页码
      currentPage: 2,
      // 对话框隐藏
      // 通过flag控制进行添加操作还是修改操作,为true的时候进行的是添加操作
      flag: true,
      nowData: {},
      compData: [],
    };
  },
  beforeMount(){
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.curHeight = h - 230; 
  },
  methods: {

    // 多选
    handleSelectionChange(val) {

    },


    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val;

    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val;

    },
    // 对话框关闭
  }
};
</script>

<style lang="less" scoped>

.lanzhuang /deep/ .el-drawer__open .el-drawer.rtl {
  width: 50% !important;
}

.tableX .el-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
   background-color: #ccc !important;
   border-radius: 30px !important;
}
.form-t {
  margin-bottom: 50px;
  padding: 0 1rem;
}
.form-t /deep/ .el-form-item__content {
  margin-left: 1rem !important;
  width: 60%;
}

/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
/deep/ .el-form-item {
  display: flex;
  margin-bottom: 0!important;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  // line-height: 35px;
  padding-right: 1rem;
  height: 51px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.box {
  border-bottom: 1px solid #e1e4eb;
  border-top: none !important;
  border-radius: 4px 4px 0 0;
  margin-top:20px;
}
.box .selectBox{
  background: #F5F7FA;
}
.title {
  background: #f5f7fa;
  height: 40px;
  line-height: 40px;
  p {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #303133;
    letter-spacing: 0;
    line-height: 16px;
    padding-left: 14px;
    line-height: 40px;
  }
}

/deep/ .el-table .cell {
  white-space: nowrap;
}
/deep/ .el-form-item--mini .el-form-item__label {
  line-height: 0;
}
/deep/ .el-pagination {
  text-align: right;
}
/deep/ .el-table th > .cell {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #606266;
}
/deep/ .el-drawer__header {
  margin-bottom: 0;
  padding: 8px 16px;
  border-bottom: 1px solid gainsboro;
}
/deep/ .el-drawer__body {
  overflow-y: auto;
}
/deep/ .el-table .el-button:focus,
.el-button:hover {
  background-color: #fff;
  color: #338ce8;
  border: 1px solid #e1e4eb;
}
/deep/ .v-modal {
  z-index: 200 !important;
}
/deep/ .el-table .el-button--mini {
  color: #1684f6;
  border-color: transparent;
  background: transparent;
}
/deep/ .el-table th {
  border-left: 1px solid #ebeef5;
}
/deep/ .el-table th:nth-child(1) {
  border-left: none;
}
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f7fa;
}
/deep/.el-pagination.is-background .btn-next,
/deep/ .el-pagination.is-background .btn-prev,
/deep/ .el-pagination.is-background .el-pager li {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-radius: 3px;
  border-radius: 3px;
}
// /deep/ .el-table {
//   max-height: 400px;
// }
/deep/ .el-table th {
  height: 41px!important;
}
/deep/ .el-table tr{
  height: 41px!important;
}
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 20px 0;
}
.selectBox {
  /deep/ .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 6px;
  }
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-left: none;
  line-height: 28px;
  height: 39px;
  padding-top: 11px;
  padding-left: 14px;
  padding-right: 12px;
}
.el-button {
  margin-left: 0px !important;
}
</style>
