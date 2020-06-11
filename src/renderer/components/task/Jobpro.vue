<template>
  <div class="box">
    <!-- 查询项目 -->
    <div class="selectBox" style="display:flex;justify-content: space-between;padding-right: 20px;">
      <div class="left">
        <el-form ref="form" size="mini" :model="form" inline>
          <el-form-item label="过程种类:" >
            <el-select filterable v-model="form.region" placeholder="请选择" clearable>
              <el-option
                v-for="(item) in company"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称:">
            <el-input 
              v-model="form.name"      
              @input="form.name=verifyfilter('char',form.name)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 查询按钮 -->
            <el-button type="primary" icon="el-icon-search" @click="findList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-button plain size="mini" icon="el-icon-plus" @click="createpro"></el-button>
        <!-- <el-button plain size="mini" icon="el-icon-delete"></el-button> -->
      </div>
    </div>
    <!-- 信息列表 -->
    <keep-alive>
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        stripe
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column prop="oprocessName" label="作业过程名称"></el-table-column>
        <el-table-column prop="shortCode" label="速记码" width="120"></el-table-column>
        <el-table-column label="过程分类" width="120">
          <template slot-scope="scope">
            {{getOppType(scope.row.oppType)}}
          </template>
        </el-table-column>
        <el-table-column label="是否为理货量" width="120">
          <template slot-scope="scope">
            {{scope.row.istally == "0" ? "是":"否" }}
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="录入人姓名"></el-table-column>
        <el-table-column prop="opaType" label="过程种类">
          <template slot-scope="scope">
            {{getOpaType(scope.row.opaType)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" @click="handleupdate(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
            </el-button>
            <!-- 列表按钮 -->
            <el-button size="mini" @click="handleList(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiao" style="color:rgb(130, 49, 142)"></i>列表
            </el-button>
            <!-- 删除按钮 -->
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">
              <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </keep-alive>
    <!-- 编辑抽屉 -->
    <el-drawer
      title="修改过程种类"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item
            label="作业过程名称："
            :label-width="formLabelWidth"
            style="padding:0 20px;width:70%">
            <el-input v-model="form.oprocessName" autocomplete="off" @input="form.oprocessName=verifyfilter('chareOperation',form.oprocessName)"></el-input>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-input v-model="form.shortCode" autocomplete="off" @input="form.shortCode=verifyfilter('char',form.shortCode)"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="过程分类："
            :label-width="formLabelWidth"
            style="padding:0 20px;width:70%"
          >
            <el-input v-model="form.opbType" autocomplete="off"></el-input>
          </el-form-item> -->

          <el-form-item label="过程种类:" :label-width="formLabelWidth"
            style="padding:0 20px;width:70%">
            <el-select filterable v-model="form.opaType" placeholder="请选择" clearable>
              <el-option
                v-for="(item) in company"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="过程分类:" :label-width="formLabelWidth"
                        style="padding:0 20px;width:70%">
            <el-select filterable v-model="form.oppType" placeholder="请选择" clearable>
              <el-option
                      v-for="(item) in oppTypes"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业理货量：" style="padding:0 20px;width:70%;padding-left: 54px;">
            <el-radio-group v-model="form.istally">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-switch v-model="form.status" active-value="0" inactive-value="1"></el-switch>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="dialog=false">取 消</el-button>
          <el-button type="primary" @click="saveform">保 存</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 新增抽屉 -->
    <el-drawer
      title="新增作业过程"
      :before-close="handleClose"
      :visible.sync="dialogtwo"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="formone" >
          <el-form-item
            label="作业过程名称："
            :label-width="formLabelWidth"
            style="padding:0 20px;width:70%"
          >
            <el-input v-model="formone.oprocessName" autocomplete="off" @input="formone.oprocessName=verifyfilter('chareOperation',formone.oprocessName)"></el-input>
          </el-form-item>

          <!-- <el-form-item
            label="过程种类："
            :label-width="formLabelWidth"
            style="padding:0 20px;width:70%"
          >
            <el-input v-model="formone.opaType" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="过程种类:" :label-width="formLabelWidth"
            style="padding:0 20px;width:70%">
            <el-select filterable v-model="formone.region" placeholder="请选择" clearable>
              <el-option
                v-for="(item) in company"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="过程分类:" :label-width="formLabelWidth"
                        style="padding:0 20px;width:70%">
            <el-select filterable v-model="formone.oppType" placeholder="请选择" clearable>
              <el-option
                      v-for="(item) in oppTypes"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-input v-model="formone.shortCode" autocomplete="off"  @input="formone.shortCode=verifyfilter('char',formone.shortCode)"></el-input>
          </el-form-item>
          <el-form-item label="作业理货量：" style="padding:0 20px;width:70%;padding-left: 54px;">
            <el-radio-group v-model="formone.istally">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-switch v-model="formone.status" active-value="0" inactive-value="1"></el-switch>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="dialogtwo= false">取 消</el-button>
          <el-button type="primary" @click="saveformone">保 存</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 作业子过程 -->
    <el-drawer class="yesgoods" title="子过程"  :visible.sync="drawerthree" size="70%" >
      <div style="padding-right: 10px;padding-left: 10px">
        <div class="anniu">
          <el-button plain icon="el-icon-plus" size="mini" @click="createson"></el-button>
        </div>
        <el-table
          :data="tableDatathree"
          stripe
          border
          :cell-style='cellStyle'
          style="width:100%;"
          @selection-change="handleSelectionChange">
          <el-table-column prop="oprocessName" label="子过程"></el-table-column>
          <el-table-column prop="shortCode" label="速记码"></el-table-column>
          <el-table-column label="过程分类">
            <template slot-scope="scope">
              {{getOppType(scope.row.oppType)}}
            </template>
          </el-table-column>
          <el-table-column prop="istally" label="作为理货量">
            <template slot-scope="scope">
              {{scope.row.istally == "0" ? "是":"否" }}
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="录入人"></el-table-column>
          <el-table-column label="过程种类">
            <template slot-scope="scope">
              {{getOpaType(scope.row.opaType)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" min-width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="gljg(scope.$index, scope.row)" class="editBtn">
                <i class="iconfont icon-liebiaotubiao_guanlianjigou" style="color:#EFAE12"></i>关联机构
              </el-button>
              <el-button
                size="mini"
                @click="handleEditonetwo(scope.$index, scope.row)"
                class="editBtn"
              >
                <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
              </el-button>
              <el-popconfirm
                  @onConfirm="sub1(scope.$index,scope.row)"
                  title="您确定删除吗?">
                  <el-button size="mini" type slot="reference" class="deleteBtn">
                    <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
                  </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
                  background
                  @size-change="handleChildrenSizeChange"
                  :total="children.totalNum"
                  :current-page="children.currentPage"
                  :page-size="children.pagesize"
                  @current-change="handleChildrenCurrentChange"
                  layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
        <!-- <el-button @click="innerDrawer = true">打开里面的!</el-button> -->
        <!-- 关联机构 -->
        <div class="relatedInstitutions">
          <el-drawer :title="companyName" :visible.sync="relationDrawer" :append-to-body="true" :before-close="handleClose" direction="rtl">
            <div class="headerspan-item">关联机构</div>
            <div class="form-t">
              <el-form>
                <el-form-item :label-width="'120px'">
                  <el-checkbox-group v-model="checkedComp" @change="compChange">
                    <el-checkbox
                            v-for="(city,index) in comp"
                            :label="city.companyName"
                            :key="index"
                    >{{city.companyName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
            <div class="demo-drawer__footer">
              <el-button size @click="cancel()">取 消</el-button>
              <el-button
                      size
                      type="primary"
                      @click="mprocesscomp()"
                      :loading="loading"
              >{{ loading ? '提交中 ...' : '保 存' }}</el-button>
            </div>
          </el-drawer>
        </div>
      </div>
    </el-drawer>
    <!-- 修改子过程 -->
    <el-drawer
      title="编辑子过程"
      :before-close="handleClose"
      :visible.sync="dialogson"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item
            label="作业过程名称："
            :label-width="formLabelWidth"
            style="padding:0 20px;width:70%"
          >
            <el-input v-model="form.oprocessName" autocomplete="off" @input="form.oprocessName=verifyfilter('chareOperation',form.oprocessName)"></el-input>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-input v-model="form.shortCode" autocomplete="off"  @input="form.shortCode=verifyfilter('char',form.shortCode)"></el-input>
          </el-form-item>
          <el-form-item label="过程种类:" :label-width="formLabelWidth"
            style="padding:0 20px;width:70%">
            <el-select filterable v-model="form.opaType" placeholder="请选择" clearable>
              <el-option
                v-for="(item) in company"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="过程分类:" :label-width="formLabelWidth"
                        style="padding:0 20px;width:70%">
            <el-select filterable v-model="form.oppType" placeholder="请选择" clearable>
              <el-option
                      v-for="(item) in oppTypes"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业理货量：" style="padding:0 20px;width:70%;padding-left: 54px;">
            <el-radio-group v-model="form.istally">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-switch v-model="form.status" active-value="0" inactive-value="1"></el-switch>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="dialogson=false">取 消</el-button>
          <el-button type="primary" @click="saveform">保 存</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 新增子过程 -->
    <el-drawer
      title="新增子过程"
      :before-close="handleClose"
      :visible.sync="dialogcreate"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="formone">
          <el-form-item
            label="子过程名称："
            :label-width="formLabelWidth"
            style="padding:0 20px;width:70%"
          >
            <el-input v-model="formone.oprocessName" autocomplete="off"  @input="formone.oprocessName=verifyfilter('chareOperation',formone.oprocessName)"></el-input>
          </el-form-item>

         <el-form-item label="过程种类:" :label-width="formLabelWidth"
            style="padding:0 20px;width:70%">
            <el-select filterable v-model="formone.region" placeholder="请选择" clearable>
              <el-option
                v-for="(item) in company"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="过程分类:" :label-width="formLabelWidth"
                        style="padding:0 20px;width:70%">
            <el-select filterable v-model="formone.oppType" placeholder="请选择" clearable>
              <el-option
                      v-for="(item) in oppTypes"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="速记码：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-input v-model="formone.shortCode" autocomplete="off" @input="formone.shortCode=verifyfilter('char',paramform.shortCode)"></el-input>
          </el-form-item>
          <el-form-item label="作业理货量：" style="padding:0 20px;width:70%;padding-left: 54px;">
            <el-radio-group v-model="formone.istally">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" :label-width="formLabelWidth" style="padding:0 20px;width:70%">
            <el-switch v-model="formone.status" active-value="0" inactive-value="1"></el-switch>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="dialogcreate = false">取 消</el-button>
          <el-button type="primary" @click="saveson">保 存</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 分页区域 -->
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        :total="total"
        :current-page="currentPage"
        :page-sizes="[10,15,20,25,30,35]"
        :page-size="pagesize"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      >
        <!-- <div class="demo-drawer__footer" style="padding-bottom:15px">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="saveformone">保 存</el-button>
        </div>-->
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "worktime",
  data() {
    return {
      oprocessId: "",
      dialogson: false,
      dialogcreate: false,
      father: "",
      compId: [],
      comp: [],
      loading: false,
      nowData: {}, // 临时存放操作数据
      companyName: "",
      checkedComp: [],
      glform: {
        type: []
      },
      oppTypes:[{
        "dictLabel": "商务",
        "dictValue": "01"
      },
        {
          "dictLabel": "调度",
          "dictValue": "02"
        },
        {
          "dictLabel": "库场",
          "dictValue": "03"
        }],
      drawerthree: false,
      dialog: false,
      company: [], //所属公司
      dialogtwo: false,
      formLabelWidth: "130px",
      timer: null,
      currentPage: 1, //初始页
      pagesize: 10, //每页显示几条
      total: 0, //总页数
      children:{
        totalNum:0,
        currentPage: 1,
        pagesize: 10
      },
      form: {
        id: "",
        oprocessName:''
      },
      formone: {
        opaType: "",
        opbType: "",
        oppType: "",
        oprocessCode: "",
        oprocessName: "",
        opyType: "",
        parentId: 0,
        shortCode: "",
        status: '0'
      },
      //列表
      tableData: [],
      relationDrawer: false,
      tableDatathree: [],
      //表单验证
      addFormRule: {
        compName: [
          { required: true, message: "请输入作业过程名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "请输入创建者名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ]
      },
      // 当前页码
      currentPage: 1,
      // 通过flag控制进行添加操作还是修改操作,为true的时候进行的是添加操作
      flag: true,
      // 存放选中的项
      multipleSelection: []
    };
  },
   mounted() {

   },
  //初始化钩子查询..
  created() {
    //过程种类
    // this.$http
    //   .get("/psys-master-service/api/external/public/listpareoprocess?startpage=1&pagesize=10")
    //   .then(res => {
    //     this.company = res.data.data;
    //   });
      this.$http
      .get("/psys-master-service/api/external/public/listdict?dicttype=OPROCESS_TYPE")
      .then(res => {
        this.company = res.data.data;
      });
    //过程分类
    this.$http
      .get("/psys-master-service/api/external/public/listdict?dicttype=OPP_TYPE")
      .then(res => {
        this.oppTypes = res.data.data;
        this.getworktimeInfoList();
      });
  },
  methods: {
    handleupdate(index, row) {
      this.dialog = true;
      this.form = row;
    },
    // 关联机构信息
    async   mprocesscomp() {
      const that = this;
      let trueId = new Set();
      if (that.checkedComp.length !== 0) {
        trueId = that.comp.filter(n => n.bind).map(n => n.id);
        console.log(trueId);
        if (trueId.length !== 0) {
          that.selectId = trueId;
        }
      } else {
        that.selectId = new Array();
      }
      const data = {
        compId: that.selectId,
        oprocessId: that.nowData.id
      };
      const res = await that.$http.post(
              "/psys-master-service/api/external/oprocesscomp/insert",
              data
      );
      if (res.data.success) {
        if (that.relationDrawer) {

          that.relationDrawer = false;
        }
        that.$message.success(res.data.msg);
      } else {
        that.$message.warning(res.data.msg);
      }
    },
    compChange(v) {
      if (v.length !== 0) {
        this.checkedComp = v;
        this.comp.forEach(i => {
          i.bind = false;
        });

        this.comp
                .filter(n => this.checkedComp.includes(n.companyName))
                .forEach(i => {
                  i.bind = true;
                });
      }
    },
    getOppType(oppType){
      var opps = this.oppTypes.filter(i=> i.dictValue == oppType);
      if(opps!=undefined && opps.length>0){
        return  opps[0].dictLabel;
      }else
        return '';
    },
    cellStyle(){
      return 'border-left: none;border-right: none;';
    },
    getOpaType(oppType){
      if(this.company){
 var opps = this.company.filter(i=> i.oprocessCode == oppType);
      if(opps!=undefined && opps.length>0){
        return  opps[0].oprocessName;
      }else
        return '';
      }
     
    },
    createson(index, row) {
      this.dialogcreate = true;
      this.formone = {};
      this.formone.status = '0';
    },
    //删除子过程
    sub1(index, row) {
      this.$http
        .delete(`/psys-master-service/api/external/oprocess/deletebyid?id=${row.id}`)
        .then(res => {
          if (res.data.code == "0000") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.$http
              .get(
                `/psys-master-service/api/external/oprocess/getlistbyparentid?parentId=${row.parentId}&startpage=1&pagesize=10`
              )
              .then(res => {
                this.tableDatathree = res.data.data.result.pages;
              });
          }else{
            this.$message.error("删除失败："+res.data.msg);
          }
        });
    },
    //编辑子过程信息
    handleEditonetwo(index, row) {
      this.form = row;
      this.dialogson = true;
    },
    async gljg(index, row) {
      this.relationDrawer = true;
      this.oprocessId = row.id;
      this.nowData = row;
      const that = this;
      let data = [];
      let ids = new Array();
      const res = await this.$http.get(`/psys-master-service/api/external/oprocess/selectcompbind?id=${row.id}`);

      if (res.data.success) {
        this.comp = res.data.data.bindList;
        this.companyName = res.data.data.companyName;
        if (that.comp.length !== 0) {
          for (const n of that.comp) {
            // 如果绑定
            if (n.bind) {
              data.push(n.companyName);
              ids.push(n.id);
            }
          }
          this.checkedComp = this.newArr(data);
          this.selectId = this.newArr(ids);
        }
      } else {
        that.$message.warning(res.data.msg);
      }
    },
    newArr(arr) {
      return Array.from(new Set(arr));
    },
    cancel() {this.relationDrawer = false;},

    createpro() {
      this.dialogtwo = true;
      this.formone = {};
      this.formone.status = '0';
    },
    saveson() {
      this.$http
        .post("/psys-master-service/api/external/oprocess/insert", {
          istally: this.formone.istally,
          opaType: this.formone.region,
          oprocessName: this.formone.oprocessName,
          shortCode: this.formone.shortCode,
          status: this.formone.status,
          oppType:this.formone.oppType,
          parentId: this.father,
          status: this.formone.status
        })
        .then(res => {
          if (res.data.success) {
            this.dialogcreate = false;
            this.tableDatathree.push(this.formone);
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$http
              .get(`/psys-master-service/api/external/oprocess/getlistbyparentid?parentId=${this.father}&startpage=1&pagesize=10`)
              .then(res => {
                this.tableDatathree = res.data.data.result.pages;
              });
          }
        });
    },
    saveformone() {
      this.$http
        .post("/psys-master-service/api/external/oprocess/insert", {
          istally: this.formone.istally,
          opaType: this.formone.region,
          oprocessName: this.formone.oprocessName,
          shortCode: this.formone.shortCode,
          status: this.formone.status,
          oppType:this.formone.oppType,
          parentId: "0"
        })
        .then(res => {
          if (res.data.success) {
            this.dialogtwo = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getworktimeInfoList();
          }else{
            this.$message.error("新增失败：" + res.data.msg);
          }
        });
    },
    // 点击查询按钮触发 的函数
    findList() {
      this.$http
        .get(
          `/psys-master-service/api/external/oprocess/queryall?startpage=1&pagesize=10&oprocessName=${this.form.name?this.form.name:''}&opaType=${this.form.region?this.form.region:''}`
        )
        .then(res => {
          if (res.data.success) {
            this.tableData = res.data.data.pages;
          }else{
            this.$message.error("查询失败：" + res.data.msg);
          }
        });
    },
    //列表操作
    handleList(index, row) {
      this.drawerthree = true;
      this.father = row.id;
      this.$http
        .get(
          `/psys-master-service/api/external/oprocess/getlistbyparentid?parentId=${row.id}&startpage=1&pagesize=10`
        )
        .then(res => {
          this.tableDatathree = res.data.data.result.pages;
          this.children.totalNum = res.data.data.result.totalNum;
        });
    },

    // 编辑作业过程
    handleEdit(index, row) {
      this.dialog = true;
      this.form = row;
    },
    saveform() {
      this.dialog = false;
      this.dialogson = false;

      this.$http
        .put("/psys-master-service/api/external/oprocess/update", {
          id: this.form.id,
          oprocessName: this.form.oprocessName,
          oprocessCode: this.form.oprocessCode,
          shortCode: this.form.shortCode,
          opaType: this.form.opaType,
          opbType: this.form.opbType,
          opyType: this.form.opyType,
          istally: this.form.istally,
          oppType: this.form.oppType,
          parentId: this.form.parentId,
          status:this.form.status
        })
        .then(res => {
          if (res.data.code == "0000") {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            // this.getworktimeInfoList();
          } else {
            this.$message({
              message: "修改失败："+res.data.msg,
              type: "warning"
            });
          }
        });
    },
    // 删除作业过程
    handleDelete(index, info) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`/psys-master-service/api/external/oprocess/deletebyid?id=${info.id}`)
            .then(res => {
              if (res.data.code == "0000") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getworktimeInfoList();
              } else {
                this.$message({
                  message: "修改失败",
                  type: "warning"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 每页显示的条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.$http
        .get("/psys-master-service/api/external/oprocess/queryall", {
          params: {
            startpage: 1,
            pagesize: val
          }
        })
        .then(res => {
          this.tableData = res.data.data.pages;
          this.total = res.data.data.totalNum;
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$http
              .get("/psys-master-service/api/external/oprocess/queryall", {
                params: {
                  startpage: val,
                  pagesize: 10
                }
              })
              .then(res => {
                this.tableData = res.data.data.pages;
                this.total = res.data.data.totalNum;
              });
    },
    handleChildrenSizeChange(val) {
      this.children.pagesize = val;
      this.$http
              .get(`/psys-master-service/api/external/oprocess/getlistbyparentid?parentId=${this.father}`, {
                params: {
                  startpage: 1,
                  pagesize: val
                }
              })
              .then(res => {
                this.tableDatathree = res.data.data.result.pages;
                this.children.totalNum = res.data.data.result.totalNum;
              });
    },
    handleChildrenCurrentChange(val) {
      this.children.currentPage = val;
      this.$http
              .get(`/psys-master-service/api/external/oprocess/getlistbyparentid?parentId=${this.father}`, {
                params: {
                  startpage: val,
                  pagesize: 10
                }
              })
              .then(res => {
                this.tableDatathree = res.data.data.result.pages;
                this.children.totalNum = res.data.data.result.totalNum;
              });
    },

    // 选中框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 关闭抽屉操作
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      
      // this.dialog = false;
      // this.dialogtwo = false;
      // this.innerDrawer = false;
      // this.dialogson = false;
      // this.dialogcreate = false;
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      this.dialogtwo = false;
    },

    // 获取总列表数据
    getworktimeInfoList() {
      this.$http
        .get("/psys-master-service/api/external/oprocess/queryall", {
          params: {
            startpage: this.currentPage,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          this.tableData = res.data.data.pages;
          this.total = res.data.data.totalNum;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.gongsi {
  height: 41px;
  line-height: 41px;
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-top: none;
  padding-left: 15px;
  font-size: 14px;
}
.yesgoods /deep/ .el-drawer__body {
  padding-top: 0;
  margin-top: 0 !important;
  background: #f5f7fa;
}
.gljigou /deep/ .el-drawer__body {
  margin-top: 0 !important;
  background: #f5f7fa;
}
.yesgoods .gljigou /deep/ .el-drawer__body {
  padding-top: 0;
  margin-top: 0 !important;
}
.yesgoods .anniu {
  text-align: right;
  padding: 10px 20px 10px;
  background: #fff;
}

.yesgoods .anniu,
/deep/ .el-drawer__body {
  margin-top: 0 !important;
}
/deep/ .el-drawer__body {
  margin-top: 25px !important;
}
/deep/.el-drawer__header {
  padding-bottom: 20px !important;
  margin-bottom: 0 !important;
  background: #f5f7fa;
}
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
.page {
  padding: 10px;
  background: #ffffff;
  border-radius: 4px 4px 0 0;
}
.box {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-radius: 4px 4px 0 0;
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
/deep/ .el-table .el-button:focus,
.el-button:hover {
  background-color: #fff;
  color: #338ce8;
  border: 1px solid #e1e4eb;
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

.selectBox {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-left: none;
  line-height: 28px;
  height: 39px;
  padding-top: 11px;
  padding-left: 14px;
}
.el-button {
  margin-left: 0px !important;
}
.relatedInstitutions /deep/ .el-drawer__open .el-drawer.rtl {
    width: 30% !important;
    background: #f5f7fa;
}
.headerspan {
    background: #ffffff;
    border-bottom: 1px solid #e1e4eb;
    line-height: 40px;
    padding-left: 1rem;
}
.headerspan-item {
    line-height: 40px;
    padding-left: 1rem;
    font-size: 14px;
    color: #606266;
    letter-spacing: 0;
}

</style>