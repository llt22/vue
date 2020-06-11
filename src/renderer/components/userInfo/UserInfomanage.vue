<template>
  <div class="container">
    <!-- 查询表单 -->
    <el-card style="display:flex;padding:15px;background: #F5F7FA;box-shadow:none;border: #E1E4EB;" :class="computer">
      <div class="sele" style="width: 100%;display: flex;justify-content: space-between;" id="card"  ref="searchCard">
        <el-form :inline="true" size="mini" :model="searchForm" >
          <el-form-item label="登录名称" >
            <el-input v-model="searchForm.name" clearable style="background-color: #FFFFFF"  @input="searchForm.name=verifyfilter('spaceChar',searchForm.name)"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="searchForm.phone" clearable style="background-color: #FFFFFF" @input="searchForm.phone=verifyfilter('number',searchForm.phone)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="select(1)">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="showOther">高级查询<i class="el-icon-caret-bottom"></i></el-button>
          </el-form-item>

          <div class="sele" style="width: 100%;display: flex;justify-content: flex-start;margin-top: 17px;" id="card2">
            <el-form-item label="公司" >
              <el-select size="mini" v-model="searchForm.company" filterable clearable style="background-color: #FFFFFF"  @change="getDeptByCompany">
                <el-option
                        v-for="item in companyData"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门">
              <el-select size="mini"  filterable v-model="searchForm.department" style="background-color: #FFFFFF" clearable >
                <el-option
                        v-for="item in deptData"
                        :key="item.DEPT_CODE"
                        :label="item.DEPT_NAME"
                        :value="item.DEPT_CODE" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>

        <el-button-group class="form_cionBtn">
          <el-button icon="el-icon-plus" size="mini" @click="increase"></el-button>
        </el-button-group>
      </div>

    </el-card>

    <!-- 表格 -->
    <template>
      <el-table
              highlight-current-row
              :data="tableData"
              :cell-style='cellStyle'
              stripe
              border
              style="width:100%;">
        <el-table-column prop="accNo" label="登录名称" sortable width="150">
        </el-table-column>
        <el-table-column prop="userName" label="用户名称" sortable width="120">
        </el-table-column>
        <el-table-column prop="userNo" label="用户工号" sortable width="120">
        </el-table-column>
        <el-table-column label="用户类型" sortable width="120">
          <template slot-scope="scope">
            {{scope.row.userType == "02" ? "内部":"外部" }}
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司" sortable width="150">
        </el-table-column>
        <el-table-column prop="deptName" label="部门" sortable width="180">
        </el-table-column>
        <el-table-column prop="deptPost" label="岗位" sortable width="80"> </el-table-column>
        <el-table-column prop="mobile" label="手机" sortable width="150"> </el-table-column>
        <el-table-column prop="email" label="用户邮箱" sortable width="180">
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag type="success" round size="mini" plain v-if="scope.row.state == 0">正常</el-tag>
            <el-tag type="danger" round size="mini" plain v-if="scope.row.state == 1">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" width="200px">
          <template slot-scope="scope">
            <el-button
                    size="mini"
                    class="delete-button"
                    @click="handleEdit(scope.$index, scope.row)"><i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑</el-button>
            <el-popconfirm @onConfirm="deleteUserInfo(scope.$index, scope.row)" title="您确定删除吗？">
              <el-button class="delete-button" size="mini" slot="reference">
                <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-card class="card_pagination" style="border-top: none;
        height: 31px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: none;
        border-radius: 0;">
      <div class="page" style="padding-right: 50px;">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.page"
                :page-sizes="[10, 15, 30, 45]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryInfo.totalNum">
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增、修改用户对话框 -->
    <el-drawer
            :visible.sync="editOrAdd"
            :direction="direction"
            title="修改用户信息"
            :before-close="handleClose"
            size="40%">
      <div class="demo-drawer__content">
          <el-col :span="12" >
            <el-form ref="userForm"
                     :model="editForm"
                     :rules="userRules" label-width="90px"  size="mini" style="margin-bottom: 80px">
              <el-form-item label="登录账号:" prop="accNo">
                <el-input ref="loginUser" v-model="editForm.accNo" @input="editForm.accNo=verifyfilter('char',editForm.accNo)" readonly></el-input>
              </el-form-item>
              <el-form-item label="密码:"  class="form_item">
                <el-input ref="password" show-password clearable v-model="editForm.password"></el-input>
              </el-form-item>
              <el-form-item label="用户名称:" prop="userName" class="form_item">
                <el-input  v-model="editForm.userName" @input="editForm.userName=verifyfilter('char',editForm.userName)"></el-input>
              </el-form-item>
              <el-form-item label="用户工号:" prop="userNo" class="form_item">
                <el-input v-model="editForm.userNo"  @input="editForm.userNo=verifyfilter('char',editForm.userNo)"></el-input>
              </el-form-item>
              <el-form-item label="用户类型:" prop="userType" class="form_item">
                <el-select
                        v-model="editForm.userType"
                        placeholder=""
                        filterable
                        style="width:100%">
                  <el-option label="内部用户" value="02"></el-option>
                  <el-option label="外部用户" value="01"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件类型:" prop="cardType" class="form_item">
                <el-select
                        v-model="editForm.cardType"
                        placeholder=""
                        filterable
                        style="width:100%">
                  <el-option
                          v-for="item in cardTypeData"
                          :key="item.dictValue"
                          :label="item.dictLabel"
                          :value="item.dictValue" />
                </el-select>
              </el-form-item>

              <el-form-item label="证件号:" prop="card" class="form_item">
                <el-input v-model="editForm.card" @input="editForm.card=verifyfilter('char',editForm.card)"></el-input>
              </el-form-item>
              <el-form-item label="公司:" prop="company" class="form_item">
                <el-select v-model="editForm.company" filterable @change="getDeptEdit('')">
                  <el-option
                          v-for="item in companyData"
                          :key="item.id"
                          :label="item.companyName"
                          :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="部门:" prop="dept" class="form_item">
                <el-select v-model="editForm.dept" filterable value-key="ID" @change="deptChange">
                  <el-option
                          v-for="item in deptDataList"
                          :key="item.ID"
                          :label="item.DEPT_NAME"
                          :value="item.ID" />
                </el-select>
              </el-form-item>
              <el-form-item label="岗位:" prop="deptPost" class="form_item">
                <el-select v-model="editForm.deptPost" filterable>
                  <el-option
                          v-for="item in deptPostData"
                          :key="item.id"
                          :label="item.postName"
                          :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="手机:" prop="phone" class="form_item">
                <el-input v-model="editForm.phone" @input="editForm.phone=verifyfilter('number',editForm.phone)"></el-input>
              </el-form-item>
              <el-form-item label="邮箱:" prop="email" class="form_item">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="状态:" prop="delFlag" class="form_item" >
                <el-switch
                        v-model="editForm.delFlag"
                        active-value="0"
                        inactive-value="1"
                        active-text="启用"
                        inactive-text="停用">
                </el-switch>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <div class="right_title" style="padding:0 20px;">角色列表</div>
            <!-- 树形控件 -->
              <el-tree
                      :data="rightsList"
                      :props="treeProps"
                      show-checkbox
                      default-expand-all
                      node-key="id"
                      ref="ruleTree"
                      :default-checked-keys="defkey"
                      style="padding:0 20px">
              </el-tree>
          </el-col>
      </div>
      <div class="demo-drawer__footer">
        <el-button  @click="closedrawer">取 消</el-button>
        <el-button type="primary" @click="enterUser">保 存</el-button>
      </div>
    </el-drawer>

    <el-drawer
            :visible.sync="addDrawer"
            :direction="direction"
            title="新增用户信息"
            :before-close="handleClose"
            size="40%">
      <div class="demo-drawer__content">
        <el-col :span="12" >
          <el-form ref="addForm"
                   :model="addForm"
                   :rules="userRules" label-width="90px"  size="mini" style="margin-bottom: 80px">
            <el-form-item label="登录账号:" prop="accNo">
              <el-input ref="loginUser" v-model="addForm.accNo" @input="addForm.accNo=verifyfilter('char',addForm.accNo)"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password" class="form_item">
              <el-input ref="password" show-password clearable v-model="addForm.password" ></el-input>
            </el-form-item>
            <el-form-item label="用户名称:" prop="userName" class="form_item">
              <el-input  v-model="addForm.userName" @input="addForm.userName=verifyfilter('char',addForm.userName)"></el-input>
            </el-form-item>
            <el-form-item label="用户工号:" prop="userNo" class="form_item">
              <el-input v-model="addForm.userNo"  @input="addForm.userNo=verifyfilter('char',addForm.userNo)"></el-input>
            </el-form-item>
            <el-form-item label="用户类型:" prop="userType" class="form_item">
              <el-select
                      v-model="addForm.userType"
                      placeholder=""
                      filterable
                      style="width:100%">
                <el-option label="内部用户" value="02"></el-option>
                <el-option label="外部用户" value="01"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件类型:" prop="cardType" class="form_item">
              <el-select
                      v-model="addForm.cardType"
                      placeholder=""
                      filterable
                      style="width:100%">
                <el-option
                        v-for="item in cardTypeData"
                        :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue" />
              </el-select>
            </el-form-item>

            <el-form-item label="证件号:" prop="card" class="form_item">
              <el-input v-model="addForm.card" @input="addForm.card=verifyfilter('char',addForm.card)"></el-input>
            </el-form-item>
            <el-form-item label="公司:" prop="company" class="form_item">
              <el-select v-model="addForm.company" filterable @change="getDeptAdd('')">
                <el-option
                        v-for="item in companyData"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门:" prop="dept" class="form_item">
              <el-select v-model="addForm.dept" filterable value-key="ID" @change="deptChange">
                <el-option
                        v-for="item in deptAddList"
                        :key="item.ID"
                        :label="item.DEPT_NAME"
                        :value="item.ID" />
              </el-select>
            </el-form-item>
            <el-form-item label="岗位:" prop="deptPost" class="form_item">
              <el-select v-model="addForm.deptPost" filterable>
                <el-option
                        v-for="item in deptPostData"
                        :key="item.id"
                        :label="item.postName"
                        :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机:" prop="phone" class="form_item">
              <el-input v-model="addForm.phone" @input="addForm.phone=verifyfilter('number',addForm.phone)"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email" class="form_item">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="状态:" prop="delFlag" class="form_item" >
              <el-switch
                      v-model="addForm.delFlag"
                      active-value="0"
                      inactive-value="1"
                      active-text="启用"
                      inactive-text="停用">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div class="right_title" style="padding:0 20px;">角色列表</div>
          <!-- 树形控件 -->
          <el-tree
                  :data="rightsList"
                  :props="treeProps"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="addRuleTree"
                  :default-checked-keys="defkey"
                  style="padding:0 20px">
          </el-tree>
        </el-col>
      </div>
      <div class="demo-drawer__footer">
        <el-button  @click="addDrawer=false">取 消</el-button>
        <el-button type="primary" @click="addUser">保 存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    data() {
      let phone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\d{8}$/;
      let isPhone = (rule, value, callback) => {
        if (!phone.test(value)) {
          return callback(new Error('请输入正确格式的手机号'))
        } else {
          callback()
        }
      };
      let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      let isEmail = (rule, value, callback) => {
        if(value.length<=0) callback();
        if (!email.test(value)) {
          return callback(new Error('请输入正确格式的邮箱地址'))
        } else {
          callback()
        }
      };
      return {
        popoverWidth:0,
        inpDisable: true,
        dialogFormVisible:false,
        showOrHidden:false,
        // 新增表单
        ruleForm: {
          user_no:'',
          user_name:''
        },
        addDrawer:false,
        // 校验规则
        userRules: {
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          ],
          accNo:[
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          userName:[
            { required: true, message: '请输入用户姓名', trigger: 'blur' },
            { min: 2, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          userNo:[
            { required: true, message: '请输入用户工号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          cardType:[
            { required: false, message: '请选择证件类型', trigger: 'blur' }
          ],
          card:[
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          company:[
            { required: true, message: '请选择所属公司', trigger: 'blur' },
          ],
          dept:[
            { required: true, message: '请选择所属部门', trigger: 'blur' },
          ],
          deptPost:[
            { required: true, message: '请选择岗位', trigger: 'blur' },
          ],
          phone:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: isPhone}
          ],
          email:[
            {validator:isEmail}
          ],
          userType:[
            { required: true, message: '请选择用户类型', trigger: 'blur' },
          ]
        },
        // 查询表单
        searchForm: {
          name: "", //角色名称
          phone: "", //权限字符
          department: "", //角色状态
          company: "" //所属公司
        },
        drawTitle: '修改用户信息',
        //编辑表单
        editForm: {
          accNo:'',
          userName:'',
          userNo:'',
          cardType:'01',
          card:'',
          company:'',
          dept:'',
          deptPost:'',
          phone:'',
          email:'',
          delFlag:'0',
          userType:'02',
          password: '',
          id:''
        },
        //编辑表单
        addForm: {
          accNo:'',
          userName:'',
          userNo:'',
          cardType:'01',
          card:'',
          company:'',
          dept:'',
          deptPost:'',
          phone:'',
          email:'',
          delFlag:'0',
          userType:'02',
          password: '',
          id:''
        },
        //表格
        tableData: [],
        companyData: [],//公司列表
        cardTypeData: [],//证件类型信息
        deptData: [],//部门列表
        deptDataList: [],//修改新增用户信息部门列表
        deptAddList: [],//修改新增用户信息部门列表
        deptPostData: [],//岗位列表
        //抽屉数据
        editOrAdd: false, //显示
        direction: "rtl",//方向

        // 菜单权限树形数据
        rightsList: [],
        //树形控件的绑定对象
        treeProps: {
          children: "children",
          label: "name"
        },
        //默认选中的节点数据
        defkey: [],

        // 角色列表数据
        queryInfo: {
          // 当前页数
          page: 1,
          //每页显示多少数据
          pagesize: 10,
          totalNum: 1
        }
      };
    },
    methods: {
      deptChange(){
        this.$forceUpdate();
      },
      //根据公司ID获取部门信息
      getDeptEdit(deptId){
        this.editForm.dept = deptId;
        this.$http.get(`/psys-master-service/api/external/sysdept/getdeptbycomp?compId=${this.editForm.company}`,{})
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.deptDataList = res.data.data;
                    } else{
                      this.$message.error("查询部门列表信息失败错误代码："+res.data.code + res.data.msg);
                    }
                  }else{
                    this.$message.error("查询部门列表信息失败。状态码："+res.status);
                  }
                });
      },
      getDeptAdd(deptId){
        this.addForm.dept = deptId;
        this.$http.get(`/psys-master-service/api/external/sysdept/getdeptbycomp?compId=${this.addForm.company}`,{})
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.deptAddList = res.data.data;
                    } else{
                      this.$message.error("查询部门列表信息失败错误代码："+res.data.code + res.data.msg);
                    }
                  }else{
                    this.$message.error("查询部门列表信息失败。状态码："+res.status);
                  }
                });
      },
      //根据公司ID获取部门信息
      getDeptByCompany(){
        if(this.searchForm.company=='')
          return;
        this.searchForm.department = "";
        this.$http.get(`/psys-master-service/api/external/sysdept/getdeptbycomp?compId=${this.searchForm.company}`,{})
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.deptData = res.data.data;
                    } else{
                      this.$message.error("查询部门列表信息失败错误代码："+res.data.code + res.data.msg);
                    }
                  }else{
                    this.$message.error("查询部门列表信息失败。状态码："+res.status);
                  }
                });
      },
      getAllDeptPost(){
        this.$http.get(`/psys-master-service/api/external/sysdeptpost/selectall`,{})
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.deptPostData = res.data.data;
                    } else{
                      this.$message.error("查询岗位信息列表信息失败错误代码："+res.data.code + res.data.msg);
                    }
                  }else{
                    this.$message.error("查询岗位信息失败。状态码："+res.status);
                  }
                });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 新增
      increase(){
        this.editForm.id = '';
        this.inpDisable = false;
        this.addDrawer = true;

        this.getRoleTree('');
        if(this.$refs.addForm!=undefined)
          this.$refs.addForm.resetFields();
      },
      // 编辑
      handleEdit(index, row) {
        this.inpDisable = true;
        this.editForm = row;
        this.editOrAdd = true;

        if(this.$refs.userForm!=undefined)
          this.$refs.userForm.resetFields();

        this.editForm.id=row.id;
        this.editForm.delFlag = row.state;
        this.editForm.phone = row.phone;
        this.editForm.email = row.email;
        this.editForm.phone = row.mobile;
        this.editForm.accNo = row.accNo;
        this.editForm.userName = row.userName;
        this.editForm.userNo = row.userNo;
        this.editForm.cardType = row.cardType;
        this.editForm.card = row.card;
        this.editForm.company = row.companyId;
        this.getDeptEdit(row.deptId);
        this.editForm.deptPost = row.deptPost;
        this.editForm.userType = row.userType;
        this.editForm.password = '';
        this.getRoleTree(row.id);
      },
      addUser(){
        this.$refs['addForm'].validate(async (valid) => {
          if (valid) {
            var data = {
              "accNo":this.addForm.accNo,
              "userNo": this.addForm.userNo,
              "userName": this.addForm.userName,
              "card": this.addForm.card,
              "cardType": this.addForm.cardType,
              "companyId": this.addForm.company,
              "deptId": this.addForm.dept,
              "deptCode": this.addForm.dept,
              'deptPost': this.addForm.deptPost,
              'email': this.addForm.email,
              'phone': this.addForm.phone,
              'mobile': this.addForm.phone,
              'state': this.addForm.delFlag,
              'roleIds': this.$refs.addRuleTree.getCheckedKeys(),
              userType: this.addForm.userType
            };
            data.accPwd = this.$md5(this.addForm.password);
            this.$http.post(`/psys-master-service/api/external/sysuser/insert`,data).then(res=>{
              if(res.status==200 ){
                if(res.data.success){
                  this.addDrawer = false;
                  this.$message.success( "新增用户信息成功。");
                  this.select();
                } else{
                  this.$message.error( "新增用户信息失败，错误代码："+res.data.code + res.data.msg );
                }
              }else{
                this.$message.error("新增用户信息失败。状态码："+res.status);
              }
            });
          }else{
            this.$message.error("验证失败！");
          }
        });
      },
      enterUser(){
        this.$refs['userForm'].validate(async (valid) => {
          if (valid) {
            var data = {
              "accNo":this.editForm.accNo,
              "userNo": this.editForm.userNo,
              "userName": this.editForm.userName,
              "card": this.editForm.card,
              "cardType": this.editForm.cardType,
              "companyId": this.editForm.company,
              "deptId": this.editForm.dept,
              "deptCode": this.editForm.dept,
              'deptPost': this.editForm.deptPost,
              'email': this.editForm.email,
              'phone': this.editForm.phone,
              'mobile': this.editForm.phone,
              'state': this.editForm.delFlag,
              'roleIds': this.$refs.ruleTree.getCheckedKeys(),
              userType: this.editForm.userType
            };
            if(this.editForm.password.trim().length>0)
              data.accPwd = this.$md5(this.editForm.password);
            if(this.editForm.id!=null && this.editForm.id.length>0){
              data.id = this.editForm.id;
              this.$http.put(`/psys-master-service/api/external/sysuser/update`,data).then(res=>{
                if(res.status==200 ){
                  if(res.data.success){
                    this.editOrAdd = false;
                    this.select();
                    this.$message.success( "修改用户信息成功。");
                  } else{
                    this.$message.error( "修改用户信息失败，错误代码："+res.data.code + res.data.msg );
                  }
                }else{
                  this.$message.error("修改用户信息失败。状态码："+res.status);
                }
              });
            }
          }else{
            this.$message.error("验证失败！");
          }
        });
      },
      showOther(){
        if(this.showOrHidden){
          this.showOrHidden = false;
        }else
          this.showOrHidden = true;
      },
      select(index){
        if(index==1)
          this.queryInfo.page=1;
        this.$http.get(`/psys-master-service/api/external/sysuser/selectbypage?startpage=${this.queryInfo.page}&pagesize=${this.queryInfo.pagesize}`
                +`&companyId=${this.searchForm.company}&deptCode=${this.searchForm.department}&phone=${this.searchForm.phone}&accNo=${this.searchForm.name}`)
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.tableData = res.data.data.pages;
                      this.queryInfo.totalNum = res.data.data.totalNum;
                    } else{
                      this.$message.error( "查询用户信息失败，错误代码："+res.data.code + res.data.msg );
                    }
                  }else{
                    this.$message.error("查询用户信息失败。状态码："+res.status);
                  }
                })
      },
      // 根据id删除用户角色
      deleteUserInfo(index,row) {
        this.$http.delete(`/psys-master-service/api/external/sysuser/deletebyuserno?id=${row.id}`)
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.$message.success( "删除用户信息成功!");
                      this.select();
                    } else{
                      this.$message.error( "删除用户信息失败，错误代码："+res.data.code + res.data.msg );
                    }
                  }else{
                    this.$message.error("删除用户信息失败。状态码："+res.status);
                  }
                });
      },
      closedrawer(){
        this.editOrAdd = false;
      },
      // 每页显示的条数
      handleSizeChange(val) {
        this.queryInfo.pagesize = val;
        this.select();
      },
      handleClose(done) {
        this.$confirm("确认关闭？")
                .then(_ => {
                  done();
                })
                .catch(_ => {});
      },
      // 当前页
      handleCurrentChange(val) {
        this.queryInfo.startpage = val;
        this.select();
      },
      getRoleTree(userId){
        //获取角色树
        this.$http.get(`/psys-master-service/api/external/sysuser/getroletree?userId=${userId}`,{})
                .then(res=>{
                  if(res.status==200 ){
                    if(res.data.success){
                      this.rightsList = res.data.data.treeNodeList;
                      this.defkey = res.data.data.selectedNode;
                    } else{
                      this.$message.error("获取角色失败错误代码："+res.data.code + res.data.msg);
                    }
                  }else{
                    this.$message.error("获取角色信息失败。状态码："+res.status);
                  }
                });
      },
      cellStyle(){
        return 'border-left: none;border-right: none;';
      }
    },
    mounted() {
      this.popoverWidth = this.$refs.searchCard.offsetWidth;
    },
    created(){

      //查询公司列表
      this.$http.get(`/psys-master-service/api/external/public/listcompany`,{})
              .then(res=>{
                if(res.status==200 ){
                  if(res.data.success){
                    this.companyData = res.data.data;
                  } else{
                    this.$message.error("查询公司列表信息失败错误代码："+res.data.code + res.data.msg);
                  }
                }else{
                  this.$message.error("查询公司列表信息失败。状态码："+res.status);
                }
              });
      //证件类型列表
      this.$http.get(`/psys-master-service/api/external/public/listdict?dicttype=CARD_TYPE`,{})
              .then(res=>{
                if(res.status==200 ){
                  if(res.data.success){
                    this.cardTypeData = res.data.data;
                  } else{
                    this.$message.error("查询证件类型信息失败错误代码："+res.data.code + res.data.msg);
                  }
                }else{
                  this.$message.error("查询证件类型信息失败。状态码："+res.status);
                }
              });
      this.select();

      this.getAllDeptPost();
    },
    computed:{
      computer:function () {
        if(this.showOrHidden){
          return 'top';
        }else{
          return 'top2';
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  /deep/ .el-button--primary {
    background-color: #338ce8;
    border-color: #338ce8;
  }

  .top{
    height: 80px;
  }
  .top2{
    height: 30px;
  }
  /deep/ .el-collapse-item__header{
    background: #F5F7FA;
  }
  /deep/ .el-table thead{
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: #606266;
  }
  /deep/ #el-drawer__title{
    background: #F5F7FA;
  }
  #fiefooter /deep/ .el-select{
    width:100%
  }
  .yesgoods /deep/ .el-drawer__body{
    padding-top: 0;
  }
  .yesgoods .anniu{
    text-align: right;
    padding: 10px 20px 10px;
  }

  #card /deep/ .el-form-item__content{
    margin: 0;
  }
  #card2 /deep/ .el-form-item__content{
    margin: 0;
  }
  /deep/ .el-button+.el-button{
    margin-left: 0;
  }
  /deep/ .el-drawer__header{
    margin: 0;
    padding: 16px;
  }

  /deep/ .el-drawer__body{
    overflow: auto;
    padding-top: 30px;
  }
  /deep/ .el-form-item__content{
    margin: 0 51px 0 134px;
  }
  /deep/ .el-collapse-item__header{
    padding-left: 19px;
    font-size: 16px;
  }
  /deep/ .el-breadcrumb{
    font-size: 16px;
  }
  /* 第一行居中 */
  .el-table td:first-child,
  el-table th:first-child,
  .el-table td:last-child,
  el-table th:last-child {
    text-align: center !important;
  }

  .container {
    .form_card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    /deep/.el-card__body{
      width: 100%;
      padding: 0;
      border-radius: 0;
    }
    /deep/.el-pagination.is-background .btn-next,
    /deep/ .el-pagination.is-background .btn-prev,
    /deep/ .el-pagination.is-background .el-pager li {
      background: #ffffff;
      border: 1px solid #e1e4eb;
      border-radius: 3px;
      border-radius: 3px;
    }
    .editBtn,
    .deleteBtn{
      color: #1684f6;
      border-color: transparent;
      background: transparent;
    }
    //分页
    .card_pagination {
      text-align: right;
    }
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
      white-space: nowrap;
    }
  }
  .el-table{
    margin-bottom:0 !important;
  }
  .el-table td {
    padding:10px 0;
    text-align: left;
  }

  .form_item{
    margin-top: 20px;
  }
  .delete-button{
    border: none;
    background-color: transparent;
  }
  /deep/ .el-po{
    margin-right:10000px;
  }
</style>

