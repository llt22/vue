<!-- 机械信息上报 -->
<template>
  <div class="box">
    <div class="oneshow" v-if="show">
        <div class="selectBox" >
        <el-form size="mini" :model="form" inline>
        <el-form-item label="">
              <el-date-picker
                  v-model="form.date"
                  type="date"
                  placeholder="选择日期">
                  </el-date-picker>
          </el-form-item>

          <el-form-item label="">
              <el-select v-model="form.region" placeholder="选择使用部门">
                  <el-option label="大港公司" value="shanghai"></el-option>
                  <el-option label="东港公司" value="beijing"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="">
              <el-select v-model="form.mechanics" placeholder="选择机械类型">
                  <el-option label="1#机械" value="shanghai"></el-option>
                  <el-option label="2#机械" value="beijing"></el-option>
              </el-select>
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

      <keep-alive>
        <el-table
          @selection-change="handleSelectionChange"
          :data="tableData"
          stripe
          :max-height="curHeight"
          style="width: 100%"
        >
          <el-table-column prop="bumen" label="使用部门" width></el-table-column>
          <el-table-column prop="leixing" label="机械类型" width></el-table-column>
          <el-table-column prop="code" label="机械编号" width></el-table-column>
          <el-table-column prop="name" label="机械名称" width></el-table-column>
          <el-table-column  label="设备状态" width>
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

    <div class="twoshow" v-else>
      <div class="selectBox" >
      <el-form size="mini" :model="form" inline>
       <el-form-item label="">
            <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
        </el-form-item>

        <el-form-item label="">
            <el-select v-model="form.region" placeholder="选择使用部门">
                <el-option label="大港公司" value="shanghai"></el-option>
                <el-option label="东港公司" value="beijing"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="">
            <el-select v-model="form.mechanics" placeholder="选择机械类型">
                <el-option label="1#机械" value="shanghai"></el-option>
                <el-option label="2#机械" value="beijing"></el-option>
            </el-select>
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
     <keep-alive>
      <el-table
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        :max-height="curHeight"
        style="width: 100%"
      >
        <el-table-column prop="bumen" label="使用部门" width></el-table-column>
        <el-table-column prop="leixing" label="机械类型" width></el-table-column>
        <el-table-column prop="code" label="机械编号" width></el-table-column>
        <el-table-column prop="name" label="机械名称" width></el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "berth",
//   components: { bittInfoList },
  data() {
    return {
      // input:'',
      show:true,
      sat:true,
      form: {},
      curHeight:'0',
      options: [{
          value: '1#',
          label: '1#'
        }, {
          value: '2#',
          label: '2#'
        }, {
          value: '3#',
          label: '3#'
        }],
      value: [],
      tableData: [
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"门机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"门机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"门机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"机械队",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"机械队",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"机械队",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"机械队",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"机械队",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"挖掘机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机2",
        "code" :"001",
        "name":"门机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机",
        "code" :"001",
        "name":"门机1#",
        "berthDeepth":"001"
      },
      {
        "bumen":"调度室",
        "leixing" :"装载机",
        "code" :"001",
        "name":"001",
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
/deep/ .el-table th {
  height: 41px!important;
}
/deep/ .el-table tr{
  height: 41px!important;
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
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条 必写
  }
  // 滚动条的滑块
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
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
// .box .selectBox/deep/.el-select>.el-input{
//   width:80%;
// }
// .box .selectBox/deep/.el-date-editor.el-input{
//   width:80%
// }
.el-button {
  margin-left: 0px !important;
}

</style>
