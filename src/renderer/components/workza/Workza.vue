<!-- 杂作业信息 -->
<template>
  <div class="box">
    <div :class="computer">
        <el-form :inline="true" size="mini"  ref="searchForm" :model="searchForm" style="width:100%">
          <!-- <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择作业公司" v-model="searchForm.company" clearable  @change="getDeptByCompany">
                  <el-option
                    v-for="(item,index) in company"
                    :key="index"
                    :label="item.companyName"
                    :value="item.companyCode"
                  ></el-option>
              </el-select>
          </el-form-item> -->

          <el-form-item label-width="65px">
              <el-date-picker
                  v-model="searchForm.sldate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                  </el-date-picker>
          </el-form-item>
          <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择类型" v-model="searchForm.kind" clearable  @change="getDeptByCompany">
                  <el-option
                    v-for="(item,index) in jobType"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictLabel"
                  ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="select">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="showOther">高级查询<i class="el-icon-caret-bottom"></i></el-button>
          </el-form-item>

          <el-button-group style="float:right;margin-right: 20px;">
            <el-button icon="el-icon-plus" size="mini" @click="tianjia"></el-button>
            <el-button icon="el-icon-edit" size="mini" @click="xiugai"></el-button>
            <el-button icon="el-icon-delete" size="mini" @click="del"></el-button>
          </el-button-group>
          <div style="margin-top: 17px;">
            <el-form-item  label-width="65px">
              <el-select size="mini" placeholder="选择班次" v-model="searchForm.dictLabel" clearable  @change="getDeptByCompany">
                  <el-option
                    v-for="(item,index) in shifts"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictLabel"
                  ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>

    <keep-alive>
      <el-table
        @selection-change="handleSelectionChange"
        @row-click="current"
        highlight-current-row
        :data="tableData"
        stripe
        :max-height="curHeight"
        style="width: 100%"
      >
        <el-table-column prop="orgDept" label="申请单位" width></el-table-column>
        <el-table-column prop="type" label="杂项分类" width></el-table-column>
        <el-table-column prop="workSche" label="计划作业时间" width></el-table-column>
        <el-table-column prop="site" label="作业地点" width></el-table-column>
        <el-table-column prop="status" label="数据状态" width></el-table-column>
        <el-table-column prop="workContent" label="作业内容" width></el-table-column>
        <el-table-column prop="teamComp" label="劳力安排" width></el-table-column>
        <el-table-column prop="eqpComp" label="机械安排" width></el-table-column>
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
        title="新增杂作业申请"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        size="30%"
        custom-class="demo-drawer"
        ref="drawer">
        <div class="demo-drawer__content">
          <el-form :model="formone"  ref="formone" :rules="rules" style="padding-left:20px">
            <el-form-item label="部门：" :label-width="formLabelWidth" prop="orgDept">
              <el-input v-model="formone.orgDept" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="班次：" :label-width="formLabelWidth" prop="scheduleType">
              <el-select v-model="formone.scheduleType" placeholder="请选择" size="mini">
                <el-option
                    v-for="(item,index) in shifts"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
              </el-select>
            </el-form-item>  
            <el-form-item label="杂项分类：" :label-width="formLabelWidth" prop="type">
              <el-select v-model="formone.type" placeholder="请选择" size="mini">
                <el-option
                    v-for="(item,index) in jobType"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
              </el-select>
            </el-form-item>  
             <el-form-item label="计划作业时间：" :label-width="formLabelWidth" prop="workDate">
              <el-date-picker
                  v-model="formone.workDate"
                  type="date"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="作业内容：" :label-width="formLabelWidth" prop="workContent"> 
              <el-input v-model="formone.workContent" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>


            <el-form-item label="劳务安排：" :label-width="formLabelWidth" > 
                <el-input v-model="formone.teamComp" autocomplete="off" size="mini" style="width:72%" @focus="inputshow" ></el-input>
                <div class="selectbox" style="width:71%;border:1px solid #C8CFDE  " v-show="showboxip">
                    <div style="display:flex">
                      <template>
                        <div class="hang" style="display:flex">
                          <el-checkbox-group v-model="formt"  style="display:flex;flex-flow: column;">
                          <el-checkbox
                              v-for="(city,index) in formone.comp"
                              :label="city.macTypeName"
                              :key="index"
                              style="margin-right:5px;margin-left:15px"
                            ></el-checkbox> 
                        </el-checkbox-group>
                        <div class="row" style="display:flex;flex-flow:column"> 

                          <!-- 循环输入框 -->
                          <!-- <el-input  
                          v-for="(item,index) in formtwo.comp.length"
                          v-model="person.inpt"                         
                          :key="index"
                           size="mini" style="width:50%;padding:0"></el-input> -->
                           <el-input  v-model="formone.tuitu"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formone.yalu"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formone.wajue"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formone.sashui"  size="mini" style="width:50%;padding:0" ></el-input>
                        </div>
                        </div>
                       </template>
                    </div>
                    <div>
                      <button style="    width: 90%;
                          background: rgb(51, 140, 232);
                          border: none;
                          height: 30px;
                          border-radius: 11px;
                          margin: 10px;
                          color:#fff"
                          @click="teamenter"
                          >确定</button>
                    </div>
                </div> 
            </el-form-item>

            
            <el-form-item label="机械安排：" :label-width="formLabelWidth" > 
              <el-input v-model="formone.eqpComp" autocomplete="off" size="mini" style="width:72%" @focus="eqpshow"></el-input>
              <div class="selectbox" style="width:71%;border:1px solid #C8CFDE  " v-show="showboxeq">
                    <div style="display:flex">
                      <template>
                        <div class="hang" style="display:flex">
                          <el-checkbox-group v-model="formt"  style="display:flex;flex-flow: column;">
                          <el-checkbox
                              v-for="(city,index) in formone.comp"
                              :label="city.macTypeName"
                              :key="index"
                              style="margin-right:5px;margin-left:15px"
                            ></el-checkbox> 
                        </el-checkbox-group>
                        <div class="row" style="display:flex;flex-flow:column"> 

                          <!-- 循环输入框 -->
                          <!-- <el-input  
                          v-for="(item,index) in formtwo.comp.length"
                          v-model="person.inpt"                         
                          :key="index"
                           size="mini" style="width:50%;padding:0"></el-input> -->
                           <el-input  v-model="formone.tuitu"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formone.yalu"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formone.wajue"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formone.sashui"  size="mini" style="width:50%;padding:0" ></el-input>
                        </div>
                        </div>
                       </template>
                    </div>
                    <div>
                      <button style="    width: 90%;
                          background: rgb(51, 140, 232);
                          border: none;
                          height: 30px;
                          border-radius: 11px;
                          margin: 10px;
                          color:#fff"
                          @click="eqenter"
                          >确定</button>
                    </div>
                </div> 
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="padding-bottom:7px">
            <el-button @click="cancelFormone('formone')" size="mini">保存并添加</el-button>
            <el-button type="primary" @click="submitForm" size="mini">保 存</el-button>
          </div>
        </div>
      </el-drawer>
<!-- 编辑杂作业 -->
      <el-drawer
        title="修改杂作业申请"
        :before-close="handleClose"
        :visible.sync="updatedialog"
        direction="rtl"
        size="30%"
        custom-class="demo-drawer"
        ref="drawer">
        <div class="demo-drawer__content">
          <el-form :model="formtwo"  ref="formtwo" :rules="rules" >
            <el-form-item label="部门：" :label-width="formLabelWidth" prop="orgDept">
              <el-input v-model="formtwo.orgDept" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="班次：" :label-width="formLabelWidth" prop="scheduleType">
              <el-select v-model="formtwo.scheduleType" placeholder="请选择" size="mini">
                <el-option
                    v-for="(item,index) in shifts"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
              </el-select>
            </el-form-item>  
            <el-form-item label="杂项分类：" :label-width="formLabelWidth" prop="type">
              <el-select v-model="formtwo.type" placeholder="请选择" size="mini">
                <el-option
                    v-for="(item,index) in jobType"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
              </el-select>
            </el-form-item>  
             <el-form-item label="计划作业时间：" :label-width="formLabelWidth" prop="workSche">
                <el-input v-model="formtwo.workSche" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="作业内容：" :label-width="formLabelWidth" prop="workContent"> 
                <el-input v-model="formtwo.workContent" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
            <el-form-item label="劳务安排：" :label-width="formLabelWidth" prop="teamComp"> 
                <el-input v-model="formtwo.teamComp" autocomplete="off" size="mini" style="width:72%" @focus="inputshow" ></el-input>
                 <!-- <div class="selectbox" style="width:71%;border:1px solid #C8CFDE  " v-show="showbox">
                    <div style="display:flex">
                      <template>
                        <div class="hang" style="display:flex">
                          <el-checkbox-group v-model="formt" style="display:flex;flex-flow: column;">
                          <el-checkbox
                              v-for="(city,index) in formtwo.comp"
                              :label="city.macTypeName"
                              :key="index"
                              style="margin-right:5px;margin-left:15px"
                            ></el-checkbox>
                        </el-checkbox-group>
                        <div class="row" style="display:flex;flex-flow:column">  -->

                          <!-- 循环输入框 -->
                          <!-- <el-input  
                          v-for="(item,index) in formtwo.comp.length"
                          v-model="person.inpt"                         
                          :key="index"
                           size="mini" style="width:50%;padding:0"></el-input> -->
                           <!-- <el-input  v-model="formtwo.tuitu"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formtwo.yalu"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formtwo.wajue"  size="mini" style="width:50%;padding:0" ></el-input>
                           <el-input  v-model="formtwo.sashui"  size="mini" style="width:50%;padding:0" ></el-input>
                        </div>
                        </div>
                       </template>
                    </div>
                    <div>
                      <button style="    width: 90%;
                          background: rgb(51, 140, 232);
                          border: none;
                          height: 30px;
                          border-radius: 11px;
                          margin: 10px;
                          color:#fff"
                          @click="teamenter"
                          >确定</button>
                    </div>
                </div>  -->
            </el-form-item>
            <el-form-item label="机械安排：" :label-width="formLabelWidth" prop="eqpComp"> 
              <el-input v-model="formtwo.eqpComp" autocomplete="off" size="mini" style="width:72%"></el-input>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="padding-bottom:7px">
            <el-button @click="cancelFormone('formtwo')" size="mini">保存并添加</el-button>
            <el-button type="primary" @click="submitForm" size="mini">保 存</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>

export default {
  name: "equipment",
  data() {
    return {
      checked:true,
      showboxip:false,
      showboxeq:false,
      person:{},
      form:{
        type:[]
      },
      company:[],
      jobType:[],
      shifts:[],
      dialog:false,
      formt:[],
      delId:'', //删除id
      curHeight:'0',
        
      formone:{
        comp:[ {
            "macTypeName": "推土机",
            "id": "1250000211267123121",
            "bind": false
        },
        {
            "macTypeName": "压路机",
            "id": "1250000211267424256",
            "bind": false
        },
        {
            "macTypeName": "大挖掘机",
            "id": "1250000211267424257",
            "bind": false
        },
        {
            "macTypeName": "洒水车",
            "id": "1250000211267424258",
            "bind": false
        }]
      },
      formtwo:{},
      updatedialog:false,
      showOrHidden:false,
      searchForm:{},
      version:"v1",
      value: [],
      formLabelWidth:"150px",
       rules: {
          orgDept: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          workDate: [
            { required: true, message: '请输入计划作业时间', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          workContent: [
            { required: true, message: '请输入作业内容', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          eqpComp: [
            { required: true, message: '请输入机械安排', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          teamComp: [
            { required: true, message: '请输入机械安排', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择杂项分类', trigger: 'change' }
          ],
          scheduleType: [
            { required: true, message: '请选择班次', trigger: 'change' }
          ],
        },
      tableData: [],
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
  created(){
    this.getlistcreated();
    this.$http.get(`/psys-master-service/api/external/public/listworkcompany`)
      .then(res=>{

        this.company = res.data.data
      })
    this.$http.get(`/psys-master-service/api/external/public/listdict?dicttype=SCHEDULE`)
      .then(res=>{

        this.shifts = res.data.data
      })
    this.$http.get(`/psys-master-service/api/external/public/listdict?dicttype=MISCELLANEOUS`)
      .then(res=>{

        this.jobType = res.data.data
      })
  },
  methods: {
    getlistcreated(){
      this.$http.get(`/psys-ireport-service/api/external/dreportextrajob/${this.version}/queryextra?startpage=1&pagesize=10`)
      .then(res=>{
        this.tableData = res.data.data.pages
      })
    },
        //保存并添加
        cancelFormone(formone){
          this.$refs[formone].validate((valid) => {
              if (valid) {
                console.log(this.formone)
                this.dialog = false;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },

    //点击当前行
    current(row, column, event){
        this.formtwo = row;
        this.delId = row.id
    },
    // 删除当前行
    del(){
      this.$http.delete(`/psys-ireport-service/api/external/dreportextrajob/${this.version}/delete/${this.delId}`)
        .then(res=>{
          if(res.data.code == '0000'){
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getlistcreated();
          }else{
            this.$message({
              message: `删除失败${res.data.msg}`,
              type: "error"
            });
          }
        })
    },
    inputshow(){
      this.showboxip = true;
    },
    eqpshow(){
      this.showboxeq = true;
    },
    teamenter(){
      this.showboxip = !this.showboxip;
      // this.formone.teamComp = this.formt
    },
    eqenter(){
      this.showboxeq = !this.showboxeq;
    },
    tianjia(){
      // this.formone = {}
      this.dialog = true
    },
    xiugai(){
      this.updatedialog = true
    },
    showOther(){
        if(this.showOrHidden){
          this.showOrHidden = false;
        }else
          this.showOrHidden = true;
      },
      submitForm(){

      },

      //条件查询
      select(){
        let condition = {}
        if(this.searchForm.sldate){
          condition = {
              'workDate':this.searchForm.sldate?this.searchForm.sldate:'',
              'scheduleType':this.searchForm.dictLabel?this.searchForm.dictLabel:'',
              'type':this.searchForm.kind?this.searchForm.kind:''
          }
        }else{
          condition = {
              'scheduleType':this.searchForm.dictLabel?this.searchForm.dictLabel:'',
              'type':this.searchForm.kind?this.searchForm.kind:''
          }
        }
          this.$http.get(`/psys-ireport-service/api/external/dreportextrajob/${this.version}/queryextra?startpage=1&pagesize=10`,{
            params:condition
          }).then(res=>{
            
            this.tableData = res.data.data.pages;
          })

      },
      increase(){

      },
      getDeptByCompany(){

      },
      handleClose(){
        this.dialog = false;
        this.updatedialog = false;
        this.formtwo = {}
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
.row /deep/.el-input__inner{
  padding: 0 5px;
}
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
  width: 72%;
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
