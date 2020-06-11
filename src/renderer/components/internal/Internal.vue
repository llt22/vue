<!-- 内部委托 -->
<template>
  <div class="box">
    <!-- 查询  -->
    <div class="selectBox">
      <el-form size="mini" :model="form" inline>
        <el-form-item label="">
            <el-select v-model="form.region" placeholder="请选择作业公司">
                <el-option label="大港公司" value="shanghai"></el-option>
                <el-option label="东港公司" value="beijing"></el-option>
            </el-select>
        </el-form-item>
       
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
            <el-button plain icon="el-icon-plus" style="width:40px;height:28px" @click="create"></el-button>
            <el-button plain icon="el-icon-edit" style="width:40px;height:28px"></el-button>
            <el-button plain icon="el-icon-delete" style="width:40px;height:28px"></el-button>
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
        <el-table-column prop="berthName" label="作业公司" width></el-table-column>
        <el-table-column prop="date" label="委托日期" width></el-table-column>
        <el-table-column prop="leixing" label="委托号" width></el-table-column>
        <el-table-column prop="neirong" label="委托人" width></el-table-column>
        <el-table-column prop="date" label="货名" width></el-table-column>
        <el-table-column prop="name" label="船舶航次" width></el-table-column>
        <el-table-column prop="name" label="唛头" width></el-table-column>
        <el-table-column prop="time" label="源场地" width></el-table-column>
        <el-table-column prop="time" label="目的场地" width></el-table-column>
        <el-table-column prop="time" label="计划件数" width></el-table-column>
        <el-table-column prop="name" label="计划重量" width></el-table-column>
        <el-table-column prop="name" label="实际件数" width></el-table-column>
        <el-table-column prop="time" label="实际重量" width></el-table-column>
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
    <!-- 新增抽屉 -->
    <div class="pop">
      <el-drawer
        title="内部委托申请"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        size="30%"
        custom-class="demo-drawer"
        ref="drawer">
        <div class="demo-drawer__content">
          <el-form :model="formtwo"  ref="formtwo" :rules="rules" style="padding-left:20px;min-height: 768px;">
            <el-form-item label="委托日期：" :label-width="formLabelWidth" prop="startdate">
                <el-date-picker
                    v-model="formtwo.startdate"
                    type="date"
                    size="mini"
                    style="width:72%"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="作业过程：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="大港公司" value="shanghai"></el-option>
                <el-option label="东港公司" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="票货：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="1号票" value="shanghai"></el-option>
                <el-option label="2号票" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="委托人：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="货名：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="唛头：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="船舶航次：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="1号票" value="shanghai"></el-option>
                <el-option label="2号票" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提单：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="计划件数：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="源场地：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="1号票" value="shanghai"></el-option>
                <el-option label="2号票" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的场地：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="1号票" value="shanghai"></el-option>
                <el-option label="2号票" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划重：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="1号票" value="shanghai"></el-option>
                <el-option label="2号票" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：" :label-width="formLabelWidth" prop="chuanbo">
              <el-input type="textarea" v-model="formtwo.name" placeholder="备注" autocomplete="off" size="mini" style="width:72%">
              </el-input>
            </el-form-item>


            <!-- <el-form-item label="泊位：" :label-width="formLabelWidth" prop="bowei"> 
              <el-select v-model="formtwo.bowei" placeholder="请选择" size="mini" >
                <el-option label="大港公司" value="shanghai"></el-option>
                <el-option label="东港公司" value="beijing"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="船舶：" :label-width="formLabelWidth" prop="chuanbo">
              <el-select v-model="formtwo.chuanbo" placeholder="请选择" size="mini">
                <el-option label="大港公司" value="shanghai"></el-option>
                <el-option label="东港公司" value="beijing"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="作业类型：" :label-width="formLabelWidth" prop="leixing">
              <el-select v-model="formtwo.leixing" placeholder="请选择" size="mini">
                <el-option label="大港公司" value="shanghai"></el-option>
                <el-option label="东港公司" value="beijing"></el-option>
              </el-select>
            </el-form-item>  

            <el-form-item label="机械名称：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="作业内容：" :label-width="formLabelWidth" prop="neirong">
              <el-input v-model="formtwo.neirong" autocomplete="off" size="mini" style="width:72%" placeholder="请输入标签"></el-input>
            </el-form-item>
            <el-form-item label="维保开始时间：" :label-width="formLabelWidth" prop="date1">
                <el-date-picker
                    v-model="formtwo.startdate"
                    type="date"
                    size="mini"
                    style="width:72%"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="维保开始时间：" :label-width="formLabelWidth" prop="date1">
            <el-date-picker
                    v-model="formtwo.enddate"
                    type="date"
                    style="width:72%"
                    size="mini"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item> -->
          </el-form>
          <div class="demo-drawer__footer" style="padding-bottom:7px">
            <el-button @click="cancelFormtwo('formtwo')">保存并添加</el-button>
            <el-button type="primary" @click="submitForm">保 存</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>

export default {
  name: "berth",
  data() {
    return {
      dialog:false,
      formLabelWidth:"150px",
      sat:true,
      formtwo:{},
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
      rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          neirong: [
            { required: true, message: '请输入维保内容', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          neirong: [
            { required: true, message: '请输入作业内容', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          bowei: [
            { required: true, message: '请选择泊位', trigger: 'change' }
          ],
          chuanbo: [
            { required: true, message: '请选择船舶', trigger: 'change' }
          ],
          leixing: [
            { required: true, message: '请选择维保类型', trigger: 'change' }
          ],
          startdate: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        },
      tableData: [{
        "berthName":"大港1#",
        "name" :"邦尼2",
        "input" :'',
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"加水一吨"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"加水一吨"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"加水一吨"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"加水一吨"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"加水一吨"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"加水一吨"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼2",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
      },
      {
        "berthName":"大港1#",
        "name" :"邦尼",
        "leixing" :"加水",
        "time":"1.25",
        "date":"2020/04/08 8:12",
        "neirong":"船舶保养"
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

    create(){
      this.dialog = true;
      this.formtwo = {}
    },
    handleClose(){
      this.dialog = false;
    },
    cancelFormtwo(formtwo){
      alert("111")
      // this.$refs[formtwo].validate((valid) => {
      //     if (valid) {
      //       this.dialog = false;
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      
    },
    submitForm(){

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
/deep/.el-drawer__header{
  height: 41px;
  font-size: 16px;
  font-weight: 600;
}
.pop /deep/ .el-form-item__content{
  margin-left: 10px!important;
}
/deep/ .el-drawer__header {
  margin-bottom: 0;
  padding: 8px 16px;
  border-bottom: 1px solid gainsboro;
}
.lanzhuang /deep/ .el-drawer__open .el-drawer.rtl {
  width: 50% !important;
}
// /deep/ .el-drawer.rtl .el-input--mini .el-input__inner{
//   width: 115%;
// }
.tableX .el-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
   background-color: #ccc !important;
   border-radius: 30px !important;
}
/deep/ .el-table th {
  height: 41px!important;
}
/deep/ .el-table tr{
  height: 41px!important;
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
  margin-bottom: 0;
}

.pop /deep/ .el-form-item {
  margin-bottom: 15px;
}
.pop /deep/ .el-form-item__content{
  width: 100%;
}
.pop /deep/ .el-select{
  width: 72%;
}
// .pop /deep/ .el-input--mini .el-input__inner{
//   width: 72%;
// }
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
.el-button {
  margin-left: 0px !important;
}

</style>
