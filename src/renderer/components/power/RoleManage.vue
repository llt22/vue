<template>
  <div class="container">
    <!-- 查询表单 -->
    <div class="search_form">
      <div>
        <el-input v-model="searchForm.roleName" size="mini" clearable placeholder="请输入角色名称"></el-input>
        <el-input
          v-model="searchForm.roleCode"
          size="mini"
          clearable
          placeholder="请输入权限字符"
          class="roleCode"
        ></el-input>
        <el-button
          class="btn_search"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="searchRoleForm"
        >查询</el-button>
      </div>

      <!-- 导出添加删除按钮 -->
      <div>
        <!-- <el-button icon="el-icon-download" size="mini">导出</el-button> -->
        <el-button icon="el-icon-plus" size="mini" @click="addDrawer = true">增加</el-button>
        <!-- <el-button
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          v-bind:disabled="!flagselectList"
          >删除</el-button
        >-->
      </div>
    </div>

    <!-- 角色管理表格 -->
    <template>
      <el-table :data="tableData" highlight-current-row stripe>
        <!-- <el-table-column type="selection" width="55" header-align="center">
        </el-table-column>-->
        <el-table-column prop="roleName" label="角色名称" sortable min-width="150px"></el-table-column>
        <el-table-column prop="roleCode" label="权限字符" sortable min-width="150px"></el-table-column>
        <el-table-column prop="groupName" label="角色组" sortable min-width="150px"></el-table-column>
        <el-table-column prop="sortNum" label="显示顺序" sortable min-width="150px"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == 0">有效</el-tag>
            <el-tag v-if="scope.row.state == 1">无效</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" min-width="150px" sortable="custom">
          <template slot-scope="scope">{{ scope.row.createTime | formatDate }}</template>
        </el-table-column> -->
        <el-table-column label="操作" min-width="350px" header-align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleRole(scope.row.id)" class="roleBtn">
              <i class="iconfont icon-liebiaotubiao_jiaoseguanli" style="color:#E6A91F"></i>
              角色成员
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.row.id)" class="editBtn">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>
              编辑
            </el-button>
            <el-popconfirm @onConfirm="sub(scope.row.id)" @onCancel="cancel" title="您确定删除吗？">
              <el-button size="mini" type slot="reference" class="deleteBtn">
                <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i>
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <div class="card_pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPageNum"
        :current-page="startpage"
        :page-size="pageSize"
        :page-sizes="[10, 15, 30, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 角色成员 -->
    <el-drawer
      title="角色成员"
      :visible.sync="roleDrawer"
      :direction="direction"
      size="50%"
      :before-close="handleClose"
    >
      <div class="search_input">
        <el-input
          placeholder="查找用户"
          v-model="searchInput"
          style="width:150px; margin-right:16px"
          size="mini"
        ></el-input>
        <el-button
          class="btn_search"
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="searchRoleName"
        >查询</el-button>
      </div>

      <el-table :data="roleData" stripe border>
        <el-table-column prop="userName" label="用户名称"></el-table-column>
        <el-table-column prop="companyName" label="所属公司"></el-table-column>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column prop="postName" label="岗位"></el-table-column>
      </el-table>

      <div class="record">
        <!-- 角色成员分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="roleTotalPageNum"
          :current-page="rolePageNum"
          :page-size="rolepageSize"
          :page-sizes="[10, 15, 30, 50]"
          @size-change="handleRoleSizeChange"
          @current-change="handleRoleCurrentChange"
        ></el-pagination>
      </div>
    </el-drawer>
    <!-- 添加角色表单 -->
    <el-drawer
      title="添加角色"
      :visible.sync="addDrawer"
      :direction="direction"
      @close="addDrawerClose"
      size="30%"
      :before-close="handleClose"
    >
      <div class="form_box">
        <el-form
          :model="addForm"
          :rules="rulesAddForm"
          ref="roleFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="权限字符" prop="roleCode">
            <el-input v-model="addForm.roleCode"></el-input>
          </el-form-item>

          <el-form-item label="角色组" prop="rgroupId">
            <el-select v-model="addForm.rgroupId" placeholder="请选择角色组" style="width:100%">
              <el-option
                :label="item.groupName"
                :value="item.id"
                v-for="item in roleGroup"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示顺序" prop="sortNum">
            <el-input v-model="addForm.sortNum" type="number" :min="0"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="addForm.state" active-value="0" inactive-value="1"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="handleClose()" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="onSubmit()">保 存</el-button>
      </div>
    </el-drawer>

    <!-- 编辑用户对话框 -->
    <el-drawer
      title="修改角色"
      :visible.sync="editDrawer"
      :direction="direction"
      size="50%"
      @close="closeEditDrawer"
      :before-close="handleClose"
    >
      <div class="content_drawer">
        <el-row>
          <el-col :span="12" style="padding:20px;">
            <el-form ref="form" :model="editForm" label-width="100px" :rules="rulesAddForm">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="权限字符" prop="roleCode">
                <el-input v-model="editForm.roleCode"></el-input>
              </el-form-item>
              <el-form-item label="角色组" prop="rgroupId">
                <el-select v-model="editForm.rgroupId" placeholder="请选择角色组" style="width:100%">
                  <el-option
                    :label="item.groupName"
                    :value="item.id"
                    v-for="item in roleGroup"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="显示顺序" prop="sortNum">
                <el-input v-model="editForm.sortNum" type="number" :min="0"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-switch v-model="editForm.state" active-value="0" inactive-value="1"></el-switch>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="editForm.remark"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" style="padding:20px;">
            <div class="right_title">菜单列表</div>
            <div class="seachRoleList">
              <el-input
                size="mini"
                placeholder="查找用户"
                v-model="goUser.menuname"
                clearable
                style="width:150px; margin-right:16px"
              ></el-input>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handelGoUser">查询</el-button>
            </div>
            <el-tree
              :data="rightsList"
              :props="treeProps"
              show-checkbox
              default-expand-all
              node-key="id"
              :default-checked-keys="defkey"
              :check-strictly="checkStrictly"
              style="padding:0 20px"
              ref="treeRef"
              @check="handerCheck"
              @mouseenter.native="handleMouseenter"
            ></el-tree>
          </el-col>
        </el-row>
      </div>
      <div class="demo-drawer__footer">
        <el-button type="primary" @click="editRole()" size="mini">保 存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { formatDate } from '../tool/date'
import axios from 'axios'
export default {
  data() {
    return {
      // 查询表单
      searchForm: {
        roleName: '', //角色名称
        roleCode: '' //权限字符
      },
      searchInput: '', //查询角色
      //添加表单数据
      addForm: {
        roleName: '', //角色名称
        roleCode: '', //权限字符
        rgroupId: '', //角色组
        sortNum: '', //显示顺序
        state: true //状态
      },
      //添加表单验证规则
      rulesAddForm: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请输入权限字符', trigger: 'blur' }
        ],
        groupId: [
          { required: true, message: '请选择角色组', trigger: 'change' }
        ],
        sortNum: [
          { required: true, message: '请输入显示顺序', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '请输入显示状态', trigger: 'change' }
        ]
      },
      //编辑表单
      editForm: {
        roleName: '', //角色名称
        roleCode: '', //权限字符
        rgroupId: '', //角色组
        sortNum: 0, //显示顺序
        state: '', //状态
        remark: '' //备注
      },

      //角色表格
      tableData: [],
      // 角色成员表格
      roleData: [],

      //抽屉数据
      //角色成员
      roleDrawer: false,
      // 添加
      addDrawer: false,
      //编辑
      editDrawer: false,
      // 方向
      direction: 'rtl',

      // 菜单权限树形数据
      rightsList: [],
      //树形控件的绑定对象
      treeProps: {
        children: 'children',
        label: 'nodeName'
      },
      //默认选中的节点数据
      defkey: [],
      expankey: [],

      startpage: 1, //开始页数
      totalPageNum: 0, //总条数
      pageSize: 10, //显示多少条

      query: {
        startpage: 1,
        pagesize: 10
      },

      //角色成员分页
      roleTotalPageNum: 0, //总页数
      rolepageSize: 10, //显示多少页
      rolePageNum: 0, //当前页

      roleGroup: [], //角色组数据
      roleId: '', //角色成员id

      //菜单列表 查找用户
      goUser: {
        id: '',
        menuname: ''
      },
      checkStrictly: true,
      newArr: [],
      btnId: [] //按钮id

      // selectList: [], //tanble单全选
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy.MM.dd hh:mm:ss')
    }
  },
  computed: {
    chooseTreeId() {
      this.rightsList.map(item => item.isBind)
    }
  },
  created() {
    this.getTabeDate()
    // 获取角色组
    this.getRoleGroup()
  },
  // mounted(){
  //   console.log(this.checkStrictly)
  // },
  methods: {
    //获取角色表格信息
    async getTabeDate() {
      // const res = await this.$http.get( `external/sysrole/queryall?startpage=${this.startPage}&pagesize=${this.pageSize}`);
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/queryall`,
        {
          params: this.query
        }
      )
      // console.log(res);
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }

      this.tableData = res.data.data['pages']
      this.totalPageNum = res.data.data['totalNum'] //总条数
      this.startPage = res.data.data['pageNum'] //当前页
    },

    //查询表单
    async searchRoleForm() {
      // console.log(this.searchForm)
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/queryall?startpage=${this.startPage}&pagesize=${this.pageSize}&rolename=${this.searchForm['roleName']}&rolecode=${this.searchForm['roleCode']}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.tableData = res.data.data['pages']
      this.totalPageNum = res.data.data['totalNum'] //总条数
      this.startPage = res.data.data['pageNum'] //当前页
    },

    //添加角色显示抽屉
    handleAdd() {
      this.addDrawer = true
    },
    //添加角色提交
    onSubmit() {
      this.$refs['roleFormRef'].validate(async valid => {
        if (valid) {
          // console.log(this.addForm)
          const res = await this.$http.post(
            '/psys-master-service/api/external/sysrole/add',
            this.addForm
          )
          // console.log(res)
          if (res.data.code != '0000') {
            return this.$message.error('添加失败')
          }
          this.$message.success('添加成功')
          this.getTabeDate()
        }
      })
    },
    // 重置
    // resetForm() {
    //   this.$refs["roleFormRef"].resetFields();
    // },

    //角色成员
    async handleRole(id) {
      this.roleId = id
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/listuserbyrole?startpage=${this.rolePageNum}&pagesize=${this.rolepageSize}&id=${id}`
      )

      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      // console.log(res);
      this.roleData = res.data.data['pages'] //渲染数据
      this.roleTotalPageNum = res.data.data.totalNum //总页数
      this.rolePageNum = res.data.data.pageNum //当前页

      this.roleDrawer = true
      //不关联
      // this.checkStrictly = true;
    },
    // 根据id编辑角色数据
    async handleEdit(id) {
      // console.log(id)
      this.goUser.id = id //把id 传给菜单列表树 查询id里
      //
      //设置为不关联
      this.checkStrictly = true
      // console.log(this.checkStrictly)
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/getroleinfobyid?id=${id}`
      )
      // console.log(res)

      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }

      this.editForm = res.data.data.roleInfo
      this.rightsList = res.data.data.treeMenu

      // 获取tree选中的id
      let chooseId = this.treeDataGetnode(this.rightsList)
      // this.checkStrictly = false;
      // console.log(chooseId)
      this.defkey = chooseId
      this.editDrawer = true
    },
    // 根据id删除用户角色
    async sub(id) {
      const res = await this.$http.delete(
        `/psys-master-service/api/external/sysrole/deletebyid?id=${id}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.$message.success('删除成功')
      this.getTabeDate()
    },
    cancel() {
      this.$message.info('取消了删除')
    },
    // 监听pageSize改变事件
    async handleSizeChange(newSize) {
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/queryall?startpage=${this.startPage}&pagesize=${newSize}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.tableData = res.data.data['pages']
    },
    //分页 监听页码值改变
    async handleCurrentChange(newPage) {
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/queryall?startpage=${newPage}&pagesize=${this.pageSize}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.tableData = res.data.data['pages']
    },
    //角色成员分页
    handleRoleSizeChange(newSize) {},
    handleRoleCurrentChange(newPage) {},
    // 抽屉关闭提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    //获取角色组
    async getRoleGroup() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/public/listrolegroup'
      )
      // console.log(res);
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.roleGroup = res.data.data
    },

    //根据角色查询用户列表
    async searchRoleName() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/listuserbyrole?startpage=${this.rolePageNum}&pagesize=${this.roleTotalPageNum}&id=${this.roleId}&username=${this.searchInput}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.roleData = res.data.data['pages']
    },

    //修改角色
    async editRole() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let key = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          this.editForm.menuId = key.join(',')
          let params = {}
          params.id = this.editForm.id
          params.roleName = this.editForm.roleName
          params.roleCode = this.editForm.roleCode
          params.rgroupId = this.editForm.rgroupId
          params.sortNum = this.editForm.sortNum
          params.state = this.editForm.state
          params.remark = this.editForm.remark
          params.menuId = this.editForm.menuId
          params.btnId = this.editForm.btnId
          // console.log(params)
          // console.log(key.join(","));

          // console.log(this.editForm);
          const res = await this.$http.put(
            '/psys-master-service/api/external/sysrole/update',
            params
          )
          // console.log(res)
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          }
          this.$message.success('修改成功！')
          this.getTabeDate()
          //设置不关联
          this.checkStrictly = true
          this.editDrawer = false
          // let key = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
          // console.log(key)
        }
      })

      // console.log(key)
      // let dataArr = key.map((item) =>
      //   this.getParamstree(this.rightsList, item)
      // );
      // 多个数组对象合并一个数组对象
      // let data = [];
      // dataArr.map(function(value, index, array) {
      //   data = data.concat(value);
      // });
      // console.log(data);
    },

    //获取el-treebind为true的id
    treeDataGetnode(data) {
      var res = []
      // var dataRes = [];
      var child = function(v) {
        if (typeof v.children != 'undefined' && v.children.length > 0) {
          for (var i = 0; i < v.children.length; i++) {
            if (v.children[i].bind) {
              res.push(v.children[i].id)
              child(v.children[i])
            }
          }
        }
      }
      for (var k = 0; k < data.length; k++) {
        if (data[k].bind) {
          res.push(data[k].id)
          //  dataRes.push({resourceId:v.children[i].id,nodeType:v.children[i].nodeType})
        }
        if (
          typeof data[k].children != 'undefined' &&
          data[k].children.length > 0
        ) {
          child(data[k])
        }
      }
      let set = Array.from(new Set(res))
      // let set = Array.from(new Set(dataRes));
      console.log(set)
      return set
    },
    //获取tree选中id 对应的id 和nodeType
    // getParamstree(data, id) {
    //   var res = [];
    //   var child = function(v) {
    //     if (typeof v.children != "undefined" && v.children.length > 0) {
    //       for (var i = 0; i < v.children.length; i++) {
    //         if (id == v.children[i].id) {
    //           res.push({
    //             resourceId: v.children[i].id,
    //             nodeType: v.children[i].nodeType,
    //           });
    //           child(v.children[i]);
    //         }
    //       }
    //     }
    //   };
    //   for (var k = 0; k < data.length; k++) {
    //     if (id == data[k].id) {
    //       res.push({
    //         resourceId: data[k].id,
    //         nodeType: data[k].nodeType,
    //       });
    //     }
    //     if (
    //       typeof data[k].children != "undefined" &&
    //       data[k].children.length > 0
    //     ) {
    //       child(data[k]);
    //     }
    //   }
    //   let set = Array.from(new Set(res));
    //   return set;
    // },

    //递归循环按钮的id
    // getRoleBtn(data) {
    //   var res = []
    //   var child = function(v) {
    //     if (typeof v.children != 'undefined' && v.children.length > 0) {
    //       for (var i = 0; i < v.children.length; i++) {
    //         if (v.children[i].nodeType == '03') {
    //           console.log(v.children[i].id)
    //           res.push(v.children[i].id)
    //           child(v.children[i])
    //         }
    //       }
    //     }
    //   }
    //   for (var k = 0; k < data.length; k++) {
    //     if (data[k].nodeType == '03') {
    //       console.log(data[k].id)
    //       res.push(data[k].id)
    //     }
    //     if (
    //       typeof data[k].children != 'undefined' &&
    //       data[k].children.length > 0
    //     ) {
    //       child(data[k])
    //     }
    //   }
    //   let set = Array.from(new Set(res))
    //   // console.log(set);
    //   return set
    // },
    getRoleBtn(data) {
      data.forEach(item => {
        if (item.nodeType == '03') {
          this.newArr.push(item.id)
        }
        if (item.children) {
          this.getRoleBtn(item.children)
        }
      })
      console.log(this.newArr)
      let set = Array.from(new Set(this.newArr))
      // console.log(set);
      return set
    },
    // 监听编辑角色关闭事件
    closeEditDrawer() {
      this.defkey = []
      this.editDrawer = false //关闭窗口
      console.log(this.checkStrictly)
    },
    //监听添加角色关闭事件
    addDrawerClose() {
      this.$refs.roleFormRef.resetFields()
    },
    handerCheck(checkedNodes) {
      this.newArr = [] //点击先清空
      let arrCheckedNodes = []
      arrCheckedNodes.push(checkedNodes)

      let roleBtnId = this.getRoleBtn(arrCheckedNodes)
      this.editForm.btnId = roleBtnId.join(',')
      this.checkStrictly = false
    },

    //复选框事件
    // selectChangeOne(value) {
    //   let arrVal = [];
    //   value.map((item) => {
    //     return arrVal.push(item.id);
    //   });
    //   this.selectList = [...new Set(arrVal)];
    // },
    //根据选择框整体删除
    // async handleDelete() {
    //   const confirmRes = await this.$confirm('此操作将永久删除该角色数据, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).catch(err=>console.log(err))
    //   if(confirmRes !== 'confirm'){
    //     return this.$message.info('已经取消删除')
    //   }
    //   console.log("删除整体");
    // },
    // 查找用户
    async handelGoUser() {
      console.log(this.goUser)
      this.checkStrictly = true
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysrole/listmenu`,
        {
          params: this.goUser
        }
      )
      console.log(res)
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.rightsList = res.data.data
    },
    handleMouseenter() {
      this.checkStrictly = false
      // console.log('移入事件')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  //表单盒子
  .form_box {
    padding: 20px;
    box-sizing: border-box;
  }

  // 查询表单
  .search_form {
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    .el-input {
      width: 150px;
    }
    .roleCode {
      margin-left: 16px;
    }
    .btn_search {
      margin-left: 16px;
    }
  }

  /deep/.el-table thead {
    font-size: 14px;
    color: #606266;
  }
  //操作按钮
  .roleBtn,
  .editBtn,
  .deleteBtn {
    font-size: 13px;
    color: #606266;
    border-color: transparent;
    background: transparent;
  }

  // 抽屉头部样式

  /deep/ .el-drawer__header {
    font-size: 16px;
    color: #303133;
    background-color: #f5f7fa;
    margin-bottom: 0 !important;
    height: 50px;
    line-height: 50px;
    padding: 0 16px !important;
  }
  /deep/.el-drawer__close-btn {
    display: none;
  }
  .right_title {
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 14px;
    color: #606266;
    height: 41px;
    line-height: 41px;
    background-color: #f5f7fa;
    border: 1px solid #e1e4eb;
  }
  //修改角色提交按钮
  /deep/ .demo-drawer__footer {
    text-align: right;
    padding-right: 1rem;
    border-top: 1px solid #c8cfde;
    background-color: #f5f7fa;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 50px;
    z-index: 100;
  }
  //角色成员分页盒子
  .record {
    padding: 10px 20px;
    font-size: 13px;
    color: #909399;
    text-align: right;
    padding-right: 1rem;
    border-top: 1px solid #c8cfde;
    background-color: #f5f7fa;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  /deep/ .el-drawer__body {
    overflow-y: auto;
    padding-bottom: 100px;
  }

  .footer_btn {
    text-align: right;
    height: 50px;
    line-height: 50px;
  }
  //给table 设置表头线
  /deep/ .el-table th {
    border-left: 1px solid #ebeef5;
  }
  /deep/ .el-table th:nth-child(1) {
    border-left: none;
  }

  //分页
  .card_pagination {
    text-align: right;
    padding: 10px 20px;
    background: #ffffff;
  }
  /deep/.el-pagination.is-background .btn-next,
  /deep/ .el-pagination.is-background .btn-prev,
  /deep/ .el-pagination.is-background .el-pager li {
    background: #ffffff;
    border: 1px solid #e1e4eb;
    border-radius: 3px;
    border-radius: 3px;
  }
  .search_input {
    height: 50px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    .el-input {
      width: 150px;
    }
  }
  /deep/.el-input el-input-group el-input-group--append {
    width: 191px !important;
  }
  // 查询列表
  .seachRoleList {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    border-left: 1px solid #e1e4eb;
    border-bottom: 1px solid #e1e4eb;
    .el-input {
      width: 131px;
    }
  }
}
</style>
