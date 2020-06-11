<template>
  <div class="container">
    <!-- 查询表单 -->
    <div class="search_form">
      <div>
        <el-input v-model="searchForm.menuName" size="mini" placeholder="请输入菜单名称" clearable></el-input>
        <el-select
          v-model="searchForm.state"
          size="mini"
          placeholder="请选择菜单状态"
          class="second_label"
          clearable
        >
          <el-option label="显示" value="0"></el-option>
          <el-option label="隐藏" value="1"></el-option>
          <el-option label="全部" value="2"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchMenuForm">查询</el-button>
      </div>
      <div>
        <el-button-group class="form_cionBtn">
          <el-button icon="el-icon-plus" size="mini" @click="addMenu"></el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 菜单管理表格 -->
    <tree-table :data="tableData" :columns="columns" :selection-type="false" :expand-type="false">
      <template slot="templateO" slot-scope="scope">
        <p v-if="scope.row.openType == 0">内部打开</p>
        <p style="color:#ccc" v-if="scope.row.openType == 1">外部打开</p>
      </template>
      <template slot="visibleT" slot-scope="scope">
        <p v-if="scope.row.visible == 0">显示</p>
        <p style="color:#ccc" v-if="scope.row.visible == 1">隐藏</p>
      </template>
      <template slot="stateT" slot-scope="scope">
        <el-tag v-if="scope.row.menuType == '01'">目录</el-tag>
        <el-tag type="success" v-if="scope.row.menuType == '02'">菜单</el-tag>
        <el-tag type="warning" v-if="scope.row.menuType == '03'">按钮</el-tag>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button
          v-if="scope.row.menuType == '02'"
          class="editBtn"
          size="mini"
          @click="handeleBtnClick(scope.row)"
        >
          <i class="iconfont icon-liebiaotubiao_liebiaoxinzeng" style="color:#41B035"></i>
          新增
        </el-button>

        <el-button
          v-else-if="scope.row.menuType == '03'"
          class="editBtn"
          disabled
          size="mini"
          style="color:#ccc"
        >
          <i class="iconfont icon-liebiaotubiao_liebiaoxinzeng" style="color:#ccc"></i>
          新增
        </el-button>

        <!-- {{scope.row}} -->

        <el-button size="mini" @click="addMenu(scope.row)" class="editBtn" v-else>
          <i class="iconfont icon-liebiaotubiao_liebiaoxinzeng" style="color:#41B035"></i>
          新增
        </el-button>

        <!-- 按钮编辑 -->
        <el-button
          size="mini"
          @click="handleBtnEdit(scope.row)"
          v-if="scope.row.menuType == '03'"
          class="editBtn"
        >
          <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="#2166B2"></i>
          编辑
        </el-button>

        <!-- 菜单编辑 -->
        <el-button size="mini" @click="handleEdit(scope.row,scope.row.id)" v-else class="editBtn">
          <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="#2166B2"></i>
          编辑
        </el-button>
        <!-- 按钮删除 -->
        <el-popconfirm
          @onConfirm="deleteBtnById(scope.row,scope.row.id)"
          @onCancel="cancel"
          title="您确定删除吗？"
          v-if="scope.row.menuType == '03'"
        >
          <el-button size="mini" type slot="reference" class="deleteBtn">
            <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i>
            删除
          </el-button>
        </el-popconfirm>

        <!-- 菜单删除 -->
        <el-popconfirm
          @onConfirm="deleteById(scope.row,scope.row.id)"
          @onCancel="cancel"
          title="您确定删除吗？"
          v-else
        >
          <el-button size="mini" type slot="reference" class="deleteBtn">
            <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i>
            删除
          </el-button>
        </el-popconfirm>
      </template>
    </tree-table>

    <!-- 添加添加父菜单数据列表对话框 -->
    <el-drawer
      title="添加菜单"
      :visible.sync="addFormDrawer"
      :direction="direction"
      @close="addDrawerClose"
      :before-close="handleClose"
      size="30%"
    >
      <el-form
        :model="addFform"
        :rules="addFformRules"
        ref="ruleAddFform"
        label-width="100px"
        style="padding:20px"
      >
        <el-form-item label="所属系统：" prop="systemCode">
          <el-select
            v-model="addFform.systemCode"
            placeholder="请选择所属系统"
            style="width:100%"
            @change="changeAddSystemCode"
          >
            <el-option
              :label="item.systemName"
              :value="item.systemCode"
              v-for="item in listproject"
              :key="item.systemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="addFform.parentId" placeholder="请选择上级菜单" style="width:100%">
            <el-option
              v-for="item in parentMenu"
              :key="item.menuId"
              :label="item.menuName"
              :value="item.menuId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型：" prop="menuType">
          <el-select
            v-model="addFform.menuType"
            placeholder="请选择菜单类型"
            style="width:100%"
            @change="changeMenuType"
          >
            <el-option label="目录" value="01"></el-option>
            <el-option label="菜单" value="02"></el-option>
            <el-option label="按钮" value="03"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称：" prop="menuName">
          <el-input v-model="addFform.menuName"></el-input>
        </el-form-item>
        <el-form-item label="请求地址：" prop="url">
          <el-input v-model="addFform.url"></el-input>
        </el-form-item>

        <el-form-item label="打开方式" prop="openType">
          <el-select v-model="addFform.openType" placeholder="请选择打开方式" style="width:100%">
            <el-option label="内部打开" value="0"></el-option>
            <el-option label="外部打开" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-input v-model="addFform.menuCode"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="sortNum">
          <el-input v-model="addFform.sortNum" type="number" :min="0"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-select v-model="addFform.icon" placeholder="请选择图标" style="width:100%">
            <el-option :label="item.name" :value="item.icon" v-for="item in icon" :key="item.icon">
              {{item.name}}：
              <i :class="'iconfont '+item.icon"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单状态" prop="visible">
          <el-radio-group v-model="addFform.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 如何选择按钮保存事件 -->
        <div class="demo-drawer__footer" v-if="flagAddBtn">
          <el-button size="mini">保存并添加</el-button>
          <el-button type="primary" @click="addBtnSubmit()" size="mini">保存按钮</el-button>
        </div>
        <div class="demo-drawer__footer" v-else>
          <el-button size="mini" @click="saveSubmit">保存并添加</el-button>
          <el-button type="primary" @click="submitFform()" size="mini">保存</el-button>
        </div>
      </el-form>
    </el-drawer>

    <!-- 编辑用户对话框 -->
    <el-drawer
      title="编辑菜单"
      :visible.sync="drawer"
      :direction="direction"
      size="30%"
      :before-close="handleClose"
    >
      <!-- 编辑内容 -->
      <el-row>
        <el-col style="padding:0 20px">
          <el-form ref="form" :model="editForm" :rules="addFformRules" label-width="100px">
            <el-form-item label="所属系统" prop="systemCode">
              <!-- <el-input v-model="editForm.systemCode"></el-input> -->
              <el-select
                v-model="editForm.systemCode"
                placeholder="请选择所属系统"
                style="width:100%"
                @change="changeEditSystemCode()"
              >
                <el-option
                  :label="item.systemName"
                  :value="item.systemCode"
                  v-for="item in listproject"
                  :key="item.systemCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级菜单" prop="parentId">
              <el-select v-model="editForm.parentId" placeholder="请选择上级菜单" style="width:100%">
                <el-option
                  v-for="item in parentMenu"
                  :key="item.menuId"
                  :label="item.menuName"
                  :value="item.menuId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="菜单类型" prop="menuType">
              <el-select
                v-model="editForm.menuType"
                placeholder="请选择菜单类型"
                style="width:100%"
                @change="changeMenuType"
              >
                <template v-if="flagMenu">
                  <el-option label="目录" value="01"></el-option>
                  <el-option label="菜单" value="02"></el-option>
                </template>

                <template v-if="flagCatalogue">
                  <el-option label="菜单" value="02"></el-option>
                </template>

                <template v-else>
                  <el-option label="目录" value="01"></el-option>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="editForm.menuName"></el-input>
            </el-form-item>
            <el-form-item label="请求地址" prop="url">
              <el-input v-model="editForm.url"></el-input>
            </el-form-item>
            <el-form-item label="打开方式" prop="openType">
              <el-select v-model="editForm.openType" placeholder="请选择打开方式" style="width:100%">
                <el-option label="内部打开" value="0"></el-option>
                <el-option label="外部打开" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权限标识" prop="menuCode">
              <el-input v-model="editForm.menuCode"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" prop="sortNum">
              <el-input v-model="editForm.sortNum" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-select v-model="editForm.icon" placeholder="请选择图标" style="width:100%">
                <el-option
                  :label="item.name"
                  :value="item.icon"
                  v-for="item in icon"
                  :key="item.icon"
                >
                  {{item.name}}：
                  <i :class="'iconfont '+item.icon"></i>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单状态" prop="visible">
              <el-radio-group v-model="editForm.visible">
                <el-radio label="0">显示</el-radio>
                <el-radio label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- drawer 底部 -->

      <!-- 菜单目录保存事件 -->
      <div class="demo-drawer__footer">
        <el-button size="mini" @click="saveAdddMenu">保存并添加</el-button>
        <el-button type="primary" @click="editFormSubmit()" size="mini">保存</el-button>
      </div>
    </el-drawer>

    <!-- 添加按钮 -->
    <el-drawer title="添加按钮" :visible.sync="btnDrawer" :direction="direction" size="30%">
      <el-form
        ref="btnFormRef"
        :model="btnForm"
        label-width="80px"
        style="padding:0 20px"
        :rules="addBtnRules"
        :before-close="handleClose"
      >
        <el-form-item label="按钮名称" prop="resourceName">
          <el-input v-model="btnForm.resourceName"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="resourceCode">
          <el-input v-model="btnForm.resourceCode"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="sortNum">
          <el-input v-model="btnForm.sortNum" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="visible">
          <el-radio-group v-model="btnForm.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="mini">保存并添加</el-button>
        <el-button type="primary" @click="btnFormSubmit()" size="mini">保存</el-button>
      </div>
    </el-drawer>
    <!-- 编辑按钮 -->
    <el-drawer title="编辑按钮" :visible.sync="editBtnDrawer" :direction="direction" size="30%">
      <el-form
        ref="btnFormRef"
        :model="editBtnForm"
        label-width="80px"
        style="padding:0 20px"
        :rules="addBtnRules"
        :before-close="handleClose"
      >
        <el-form-item label="按钮名称" prop="resourceName">
          <el-input v-model="editBtnForm.resourceName"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="resourceCode">
          <el-input v-model="editBtnForm.resourceCode"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="sortNum">
          <el-input v-model="editBtnForm.sortNum" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="visible">
          <el-radio-group v-model="editBtnForm.visible">
            <el-radio label="0">显示</el-radio>
            <el-radio label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="mini" @click="btnEditFormSubmit()">保存并添加</el-button>
        <el-button type="primary" @click="btnEditFormSubmit()" size="mini">保存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listproject: [], //所属系统
      parentMenu: [], //上级菜单
      icon: [
        { name: '数据管理', icon: 'icon-yuanshujuguanli' },
        { name: '商务系统', icon: 'icon-shangwuxitong' },
        { name: '服务大厅', icon: 'icon-yizhanshifuwudating' },
        { name: '信息查询', icon: 'icon-xinxichaxun' },
        { name: '首页', icon: 'icon-shouye' },
        { name: '作业系统', icon: 'icon-zuoyexitong' },
        { name: '单点登录', icon: 'icon-dandiandenglu' }
      ],

      // 查询表单
      searchForm: {
        menuName: '', //菜单名称
        state: '2' //菜单状态
        // codeName: "", //值
      },
      // 为table指定列的定义
      columns: [
        { label: '菜单名称', prop: 'menuName', minWidth: '200px' },
        { label: '排序', prop: 'sortNum', width: '80px' },
        { label: '请求地址', prop: 'url', minWidth: '150px' },
        {
          label: '打开方式',
          type: 'template',
          template: 'templateO',
          width: '100px'
        },
        { label: '所属系统', prop: 'systemName', width: '150px' },
        {
          label: '可见',
          // 定义模板列
          type: 'template',
          // 设置模板名称
          template: 'visibleT',
          width: '100px'
        },
        { label: '权限标识', prop: 'menuCode', width: '200px' },
        {
          label: '菜单类型',
          // 定义模板列
          type: 'template',
          // 设置模板名称
          template: 'stateT',
          width: '100px'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
          minWidth: '300px',
          fixed: 'right'
        }
      ],
      // 添加菜单
      addFform: {
        parentId: '', //上级菜单
        menuName: '', //菜单名称
        sortNum: 0, //排序
        url: '', //请求地址
        systemCode: '', //所属系统
        menuType: '01', //类型
        visible: '0', //菜单状态
        menuCode: '', //权限标识
        icon: '', //图标
        openType: '' //打开方式
      },
      editForm: {
        parentId: '', //上级菜单
        menuName: '', //菜单名称
        sortNum: 0, //排序
        url: '', //请求地址
        systemCode: '', //所属系统
        menuType: '01', //类型
        visible: '0', //菜单状态
        menuCode: '', //权限标识
        icon: '', //图标
        openType: '' //打开方式
      },
      //添加按钮
      btnForm: {
        parentMenuId: '', //上级菜单id
        resourceName: '', //按钮名称
        resourceCode: '', //权限标识
        sortNum: 0, //排序
        visible: '0' //菜单状态
      },
      // 编辑按钮
      editBtnForm: {
        id: '',
        parentMenuId: '', //上级菜单id
        resourceName: '', //按钮名称
        resourceCode: '', //权限标识
        sortNum: 0, //排序
        visible: '0' //菜单状态
      },
      // 父级菜单验证
      addFformRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        url: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        menuType: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ],
        visible: [{ required: true, message: '请选择可见', trigger: 'change' }],
        menuCode: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ],
        systemCode: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
        openType: [
          { required: true, message: '请选择打开方式', trigger: 'change' }
        ]
      },
      // editFormRules:[{

      // }]
      //按钮验证
      addBtnRules: {
        parentMenuId: [
          { required: true, message: '请选择上级菜单', trigger: 'change' }
        ],
        resourceName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        visible: [
          { required: true, message: '请输入资源状态', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入显示顺序', trigger: 'blur' }
        ],
        resourceCode: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ]
      },

      //表格
      tableData: [],
      //编辑抽屉数据
      drawer: false,
      //抽屉父级添加菜单
      addFormDrawer: false,
      //按钮抽屉
      btnDrawer: false,
      //编辑按钮抽屉
      editBtnDrawer: false,
      // 抽屉方向
      direction: 'rtl',

      // 菜单权限树形数据
      rightsList: [],
      //树形控件的绑定对象
      treeProps: {
        children: 'children',
        label: 'label'
      },
      flagMenu: true, //判断编辑目录是否有children
      flagCatalogue: true,
      //默认选中的节点数据
      defkey: [],
      flagAddBtn: false, //是否选择了按钮
      addBtnId: '', //父id
      parentName: '' //没有父就用当前元素
    }
  },
  created() {
    this.getListproject()
    this.getMenuList()
  },
  methods: {
    //获取菜单数据列表
    async getMenuList() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/sysmenu/listmenu?state=2'
      )
      if (!res.data.code != '0000') {
        return this.$message.error('获取菜单数据列表失败！')
      }
      console.log(res)
      this.tableData = res.data.data
    },

    //获取所属系统
    async getListproject() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/public/listproject'
      )
      // console.log(res.data.data);
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      this.listproject = res.data.data
    },

    //根据系统与菜单类型 查询上级菜单
    // async getMune(menutype, systemcode) {
    //   const res = await this.$http.get(
    //     `/psys-master-service/api/external/sysmenu/listmenubytype?menutype=${menutype}&systemcode=${systemcode}`
    //   )
    //   // console.log(res)
    //   if (res.data.code != '0000') {
    //     return this.$message.error(res.data.msg)
    //   }

    //   // if (res.data.data.length == 0) {
    //   //   return (this.parentMenu = [{ menuId: '0', menuName: this.codeName }])
    //   // }
    //   // console.log(res.data.data)
    //   this.parentMenu = res.data.data
    // },
    //添加菜单联动获取上级菜单
    async getAddMenu(menutype, systemcode) {
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysmenu/listmenubytype?menutype=${menutype}&systemcode=${systemcode}`
      )
      if (res.data.code != '0000') {
        return this.$message.error('获取上级菜单失败' + res.data.msg)
      }
      console.log(res.data.data)

      let nullArr = res.data.data
      if (nullArr == '') {
        console.log('空数组')
        this.addFform.parentId = ''
        this.parentMenu = [
          { menuId: systemcode, menuName: this.parentName }
          // { menuId: this.systemcode, menuName: this.parentName }
        ]
        this.addFform.parentId = systemcode
      } else {
        this.parentMenu = res.data.data
        // console.log(this.parentMenu)
        this.addFform.parentId = res.data.data[0].menuId
      }

      // this.addFform.parentId = res.data.data[0].menuId
    },
    //编辑菜单联动获取上级菜单
    async getEditMenu(menutype, systemcode) {
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysmenu/listmenubytype?menutype=${menutype}&systemcode=${systemcode}`
      )
      if (res.data.code != '0000') {
        return this.$message.error('获取上级菜单失败' + res.data.msg)
      }
      // console.log(res)
      this.editForm.parentId = res.data.data[0].menuId
      this.parentMenu = res.data.data
    },

    // 查询菜单数据列表
    async searchMenuForm() {
      // console.log(this.searchForm)
      if (this.searchForm.state == '') {
        this.getMenuList()
      } else {
        const res = await this.$http.get(
          '/psys-master-service/api/external/sysmenu/listmenu',
          {
            params: this.searchForm
          }
        )
        console.log(res)
        this.tableData = res.data.data
      }
    },

    //获取上级菜单
    getParentMenu() {
      let menutype = '01'

      let systemcode = this.addFform.systemCode

      // 如果是空设置固定值001
      // if (systemcode == '') {
      //   return this.getMune(menutype, '001')
      // }
      // this.getMune(menutype, systemcode)
    },

    //添加菜单
    addMenu(data) {
      console.log(data)
      this.addBtnId = data.id //添加父id
      this.addFormDrawer = true
      this.getParentMenu()
      this.getListproject()
    },
    //菜单类型事件
    changeMenuType(value) {
      console.log(value)
      if (value == '03') {
        // console.log(true)
        this.flagAddBtn = true
      } else {
        this.flagAddBtn = false
      }
      console.log(this.flagAddBtn)
      this.getParentMenu()
    },

    //所属系统类型事件
    changeSystemCode() {
      let code = this.addFform.systemCode
      let data = this.listproject
      data.forEach(item => {
        if (item.systemCode == code) {
          this.codeName = item.systemName
        }
      })
      this.addFform.parentId = ''
      this.getParentMenu()
    },
    //选择所属系统
    changeAddSystemCode(val) {
      // console.log(val)
      this.listproject.forEach(item => {
        if (item.systemCode == val) {
          this.parentName = item.systemName
        }
      })
      // console.log(value)
      let menuType = this.addFform.menuType
      let sysCode = this.addFform.systemCode
      // console.log(this.addFform)
      // console.log(menuType)
      // console.log(sysCode)
      this.getAddMenu(menuType, sysCode)
    },
    //编辑上级菜单联动
    changeEditSystemCode() {
      let menuType = '01'
      let sysCode = this.editForm.systemCode
      this.getEditMenu(menuType, sysCode)
    },
    //添加按钮上级菜单联动
    changeBtnSystemCode() {
      let menuType = this.btnForm.menuType
      // console.log(menuType)

      let systemCode = this.btnForm.systemCode
      // console.log(systemCode)
      this.getEditMenu(menuType, systemCode)
    },
    // 编辑菜单
    async handleEdit(data, id) {
      //判断data是否有children
      if (data.children) {
        this.flagMenu = false
      } else {
        this.flagMenu = true
      }
      if (data.menuType == '02') {
        this.flagCatalogue = true
      } else {
        this.flagCatalogue = false
      }
      // 获取编辑列表信息
      const res = await this.$http.get(
        `/psys-master-service/api/external/sysmenu/getmenubyid?id=${id}`
      )
      if (res.data.code !== '0000') {
        return this.$message.error('获取菜单列表失败！')
      }
      this.editForm = res.data.data
      // 设置上级菜单列表
      // this.getMune('01', this.editForm.systemCode)
      // //上级菜单为0 显示所属系统名
      if (this.editForm.parentId == '0') {
        // console.log("默认值0")

        // console.log(this.editForm.systemCode)
        let newSystemName = ''
        // 循环获取系统名
        this.listproject.forEach(item => {
          if (item.systemCode == this.editForm.systemCode) {
            // console.log(item.systemName)
            newSystemName = item.systemName
          }
        })
        this.parentMenu = [{ menuId: '0', menuName: newSystemName }]
      }

      this.drawer = true
    },
    //按钮编辑
    handleBtnEdit(data) {
      // console.log(data)
      this.editBtnForm.id = data.id
      this.editBtnForm.parentMenuId = data.parentId
      this.editBtnForm.resourceName = data.menuName
      this.editBtnForm.resourceCode = data.menuCode
      this.editBtnForm.sortNum = data.sortNum
      this.editForm.visible = data.visible
      // console.log(this.editBtnForm)
      this.editBtnDrawer = true
    },
    // 按钮编辑保存
    btnEditFormSubmit() {
      this.$refs.btnFormRef.validate(async valid => {
        // console.log(valid)
        if (valid) {
          const res = await this.$http.put(
            '/psys-master-service/api/external/sysmenubtn/updatebtn',
            this.editBtnForm
          )
          console.log(res)
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          }
          this.$message.success('修改按钮成功')
          this.searchMenuForm()
          this.editBtnDrawer = false
        }
      })
    },
    //根据id删除按钮
    async deleteBtnById(data, id) {
      console.log(id)
      const res = await this.$http.delete(
        `/psys-master-service/api/external/sysmenubtn/deletebtn?btnid=${id}`
      )
      if (res.data.code != '0000') {
        this.$message.error(res.data.msg)
      } else {
        this.$message.success('删除按钮成功！')
        this.searchMenuForm()
      }
    },

    //编辑菜单提交保存
    editFormSubmit() {
      // console.log(this.editForm)
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.editForm.parentId == '') {
            this.editForm.parentId = '0'
            const res = await this.$http.put(
              '/psys-master-service/api/external/sysmenu/update',
              this.editForm
            )
            // console.log(res)
            if (res.data.code != '0000') {
              return this.$message.error(res.data.msg)
            }
            this.$message.success('更新成功！')
            this.getMenuList()
          } else {
            // this.editForm.id = this.menuId;
            const res = await this.$http.put(
              '/psys-master-service/api/external/sysmenu/update',
              this.editForm
            )
            // console.log(res);
            if (res.data.code != '0000') {
              return this.$message.error(res.data.msg)
            }
            this.$message.success('更新成功！')
            this.getMenuList()
            this.drawer = false
          }
        }
      })
    },
    //编辑保存并添加
    saveAdddMenu() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.editForm.parentId == '') {
            this.editForm.parentId = '0'
            const res = await this.$http.put(
              '/psys-master-service/api/external/sysmenu/update',
              this.editForm
            )
            // console.log(res)
            if (res.data.code != '0000') {
              return this.$message.error(res.data.msg)
            }
            this.$message.success('更新成功！')
            this.getMenuList()
          } else {
            // this.editForm.id = this.menuId;
            const res = await this.$http.put(
              '/psys-master-service/api/external/sysmenu/update',
              this.editForm
            )
            // console.log(res);
            if (res.data.code != '0000') {
              return this.$message.error(res.data.msg)
            }
            this.$message.success('更新成功！')
            this.getMenuList()
            this.$refs.form.resetFields()
            // this.drawer = false
          }
        }
      })
    },

    // 根据id删除菜单
    async deleteById(data, id) {
      console.log(id)
      // console.log(data)
      const res = await this.$http.delete(
        `/psys-master-service/api/external/sysmenu/deletebyid?id=${id}`
      )
      console.log(res)
      if (res.data.code != '0000') {
        this.$message.error(res.data.msg)
      } else {
        this.$message.success('删除成功！')
        this.searchMenuForm()
      }
    },

    cancel() {
      return this.$message.info('已取消删除')
    },

    // 添加父级菜单
    submitFform() {
      this.$refs['ruleAddFform'].validate(async valid => {
        if (valid) {
          console.log(this.addFform)
          const res = await this.$http.post(
            '/psys-master-service/api/external/sysmenu/add',
            this.addFform
          )
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          } else {
            this.$message.success('添加成功！')
            this.getMenuList()
            this.addFormDrawer = false
          }
          // console.log(res);
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //重置父级菜单
    resetFform() {
      this.$refs['ruleAddFform'].resetFields()
    },
    //添加菜单后重置表单
    addDrawerClose() {
      this.$refs.ruleAddFform.resetFields()
    },
    handeleBtnClick(data) {
      console.log(data)
      let parentMenuId = data.id //获取父id
      this.btnForm.parentMenuId = parentMenuId
      console.log('菜单按钮！')
      this.btnDrawer = true
    },
    //添加按钮保存form表单事件
    btnFormSubmit() {
      // console.log('保存成功')
      this.$refs.btnFormRef.validate(async valid => {
        if (valid) {
          console.log(valid)
          console.log(this.btnForm)
          const res = await this.$http.post(
            '/psys-master-service/api/external/sysmenubtn/addbtn',
            this.btnForm
          )
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          }
          this.$message.success('添加按钮成功')
          this.$refs.btnFormRef.resetFields()
          this.searchMenuForm()
        }
      })
    },
    //按钮添加
    addBtnSubmit() {
      this.btnForm.parentMenuId = this.addBtnId
      this.btnForm.resourceName = this.addFform.menuName
      this.btnForm.resourceCode = this.addFform.menuCode
      this.btnForm.sortNum = this.addFform.sortNum
      this.btnForm.visible = this.addFform.visible
      console.log(this.btnForm)
      this.$refs['ruleAddFform'].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            '/psys-master-service/api/external/sysmenubtn/addbtn',
            this.btnForm
          )
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          }
          this.$message.success('添加按钮成功')
          this.searchMenuForm()
        }
      })
      console.log(111111111111111111)
    },
    //添加擦弹保存并新增
    saveSubmit() {
      this.$refs['ruleAddFform'].validate(async valid => {
        if (valid) {
          console.log(this.addFform)
          const res = await this.$http.post(
            '/psys-master-service/api/external/sysmenu/add',
            this.addFform
          )
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          } else {
            this.$message.success('添加成功！')
            this.getMenuList()
            this.resetFform() //初始化
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //关闭提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  // 查询表单start
  .search_form {
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
    /deep/.el-input {
      width: 150px;
    }
    .second_label {
      margin-left: 16px;
    }
    /deep/.el-button {
      margin-left: 16px;
    }
  }
  // 查询表单end

  //table tree
  /deep/ .zk-table__body {
    color: #606266;
  }
  /deep/ .zk-table__cell-inner {
    padding: 0 6px;
  }
  /deep/ .zk-table__header-cell:last-child {
    text-align: center;
  }
  //分页start
  /deep/.el-pagination.is-background .btn-next,
  /deep/ .el-pagination.is-background .btn-prev,
  /deep/ .el-pagination.is-background .el-pager li {
    background: #ffffff;
    border: 1px solid #e1e4eb;
    border-radius: 3px;
    border-radius: 3px;
  }
  // 分页end

  // table-tree树
  /deep/ .zk-table {
    font-size: 14px;
  }
  /deep/.zk-table__header-cell {
    border-left: 1px solid #ebeef5;
    background-color: #fff;
    height: 40px;
    font-size: 14px;
    color: #606266;
  }
  //tableend-样式

  .editBtn,
  .deleteBtn {
    color: #1684f6;
    border-color: transparent;
    background: transparent;
  }

  // 抽屉头部样式
  /deep/ .el-drawer__header {
    background-color: #f5f7fa;
    margin-bottom: 12px;
    padding: 16px;
    border-bottom: 1px solid gainsboro;
  }
  /deep/ .el-drawer__body {
    overflow-y: auto;
    padding-bottom: 50px;
  }

  //抽屉底部样式
  .demo-drawer__footer {
    text-align: right;
    padding-right: 1rem;
    border-top: 1px solid #c8cfde;
    background-color: #f5f7fa;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 50px;
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
}
</style>
