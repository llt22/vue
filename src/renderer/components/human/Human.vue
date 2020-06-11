<!-- 人员信息上报 -->

<template>
  <div class="box">
    <div class="left" v-if="show">
        <div :class="computer">
        <el-form :inline="true" size="mini"  ref="searchForm" :model="searchForm" style="width:100%">
          <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择公司" v-model="searchForm.company" clearable  @change="getDeptByCompany">
              </el-select>
          </el-form-item>
          <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择部门" v-model="searchForm.company" clearable  @change="getDeptByCompany">
              </el-select>
          </el-form-item>
          <el-form-item label-width="65px">
              <el-date-picker
                  v-model="searchForm.sldate"
                  type="date"
                  placeholder="选择日期">
                  </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="select">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="showOther">高级查询<i class="el-icon-caret-bottom"></i></el-button>
          </el-form-item>

          <el-button-group style="float:right;margin-right: 20px;">
            <el-button icon="el-icon-s-promotion" size="mini" @click="tianjia"></el-button>
          </el-button-group>
          <div style="margin-top: 17px;">
            <el-form-item  label-width="65px">
              <el-select size="mini" v-model="searchForm.comp" clearable  @change="getDeptByCompany" placeholder="选择班次">
              </el-select>
            </el-form-item>
            <el-form-item  label-width="65px">
              <el-select size="mini" v-model="searchForm.comp" clearable  @change="getDeptByCompany" placeholder="选择出勤状态">
              </el-select>
            </el-form-item>
          </div>
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
        <el-table-column prop="bumen" label="岗位" width></el-table-column>
        <el-table-column prop="leixing" label="工号" width></el-table-column>
        <el-table-column prop="mingcheng" label="姓名" width></el-table-column>
        <el-table-column prop="bianhao" label="联系电话" width></el-table-column>
        <el-table-column prop="bianhao" label="出勤" width>
            <template slot-scope="scope">
              <el-checkbox  name="type" v-model="scope.row.remarks"></el-checkbox>
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
    <div class="right" v-else>
        <div :class="computer">
        <el-form :inline="true" size="mini"  ref="searchForm" :model="searchForm" style="width:100%">
          <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择公司" v-model="searchForm.company" clearable  @change="getDeptByCompany">
              </el-select>
          </el-form-item>
          <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择部门" v-model="searchForm.company" clearable  @change="getDeptByCompany">
              </el-select>
          </el-form-item>
          <el-form-item label-width="65px">
              <el-date-picker
                  v-model="searchForm.sldate"
                  type="date"
                  placeholder="选择日期">
                  </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="select">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="showOther">高级查询<i class="el-icon-caret-bottom"></i></el-button>
          </el-form-item>

          <el-button-group style="float:right;margin-right: 20px;">
            <el-button icon="el-icon-plus" size="mini" @click="tianjia"></el-button>
            <el-button icon="el-icon-edit" size="mini" ></el-button>
            <el-button icon="el-icon-search" size="mini" ></el-button>
          </el-button-group>
          <div style="margin-top: 17px;">
            <el-form-item  label-width="65px">
              <el-select size="mini" v-model="searchForm.comp" clearable  @change="getDeptByCompany" placeholder="选择班次">
              </el-select>
            </el-form-item>
            <el-form-item  label-width="65px">
              <el-select size="mini" v-model="searchForm.comp" clearable  @change="getDeptByCompany" placeholder="选择出勤状态">
              </el-select>
            </el-form-item>
          </div>
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
        <el-table-column prop="bumen" label="岗位" width></el-table-column>
        <el-table-column prop="leixing" label="工号" width></el-table-column>
        <el-table-column prop="mingcheng" label="姓名" width></el-table-column>
        <el-table-column prop="bianhao" label="联系电话" width></el-table-column>
        <el-table-column prop="bianhao" label="出勤" width>
            <template slot-scope="scope">
              <el-checkbox  name="type" v-model="scope.row.remarks"></el-checkbox>
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
  </div>
</template>

<script>
// import bittInfoList from "./bittInfoList.vue";
export default {
  name: "equipment",
//   components: { bittInfoList },
  data() {
    return {
      show:true,
      sat:true,
      curHeight:'0',
      formone:{},
      showOrHidden:false,
      searchForm:{},
      value: [],
      formLabelWidth:"150px",
       rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          neirong: [
            { required: true, message: '请输入维保内容', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          bianhao: [
            { required: true, message: '请输入机械编号', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          bumen: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          leixing: [
            { required: true, message: '请选择机械类型', trigger: 'change' }
          ],
          weibao: [
            { required: true, message: '请选择维保类型', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        },
      tableData: [{
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"调度室",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"库场队",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"库场队",
        "leixing":"003",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"库场队",
        "leixing":"门机",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
      },
      {
        "bumen":"机械队",
        "leixing":"门机",
        "mingcheng":"-",
        "bianhao":"M25-1",
        "time" :"2020-04-10 10:00~2020-04-10 15:30",
        "zhuangtai":"-",
        "neirong" :"-"
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
  computed:{
      computer:function () {
        if(this.showOrHidden){
          return 'top';
        }else{
          return 'top2';
        }
      }
    },
  beforeMount(){
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.curHeight = h - 230; 
  },
  methods: {
        cancelFormone(formone){
      this.$refs[formone].validate((valid) => {
          if (valid) {
            this.dialog = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    tianjia(){
      this.dialog = true
    },
    showOther(){
        if(this.showOrHidden){
          this.showOrHidden = false;
        }else
          this.showOrHidden = true;
      },
      cancelFormone(){

      },
      submitForm(){

      },
      select(){

      },
      increase(){

      },
      getDeptByCompany(){

      },
      handleClose(){
        this.dialog = false;
      },
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
/deep/ .el-drawer__header {
  margin-bottom: 0;
  padding: 8px 16px;
  border-bottom: 1px solid gainsboro;
}
.pop /deep/ .el-form-item__content{
  margin-left: 20px!important;
}
/deep/.el-drawer__header{
  height: 41px;
  font-size: 16px;
  font-weight: 600;
}
.pop /deep/ .el-form-item {
  margin-bottom: 20px;
}
.pop /deep/ .el-form-item {
  margin-bottom: 20px;
}
.pop /deep/ .el-form-item__content{
  width: 100%;
}
.pop /deep/ .el-select{
  width: 72%;
}
.box /deep/ .el-form-item__content{
  width: 86%;
}
.box /deep/ .el-date-editor.el-input{
  width: 100%;
}
.box .top{
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 0 20px;
  background: #F5F7FA;
  height: 80px;
  border: 1px solid #E1E4EB;
  border-top: none;
}

.box .top2{
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 0 20px;
  background: #F5F7FA;
  height: 40px;
  border: 1px solid #E1E4EB;
  border-top: none;
}
.box /deep/ .el-form--inline .el-form-item{
  margin-right: 0;
}
.top /deep/ .el-select>.el-input{
  width:93%
}
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
  // margin-bottom: 0!important;
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

.el-button {
  margin-left: 0px !important;
}

</style>
