<template>
  <div class="box">
    <!-- 查询表单 -->
    <div class="search_form">
      <div>
        <el-select
          filterable
          v-model="searchForm.macTypeCode"
          placeholder="请选择机械种类"
          size="mini"
          clearable
        >
          <el-option
            :label="item.dictLabel"
            :value="item.dictValue"
            v-for="item in mactypeList"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-select
          filterable
          v-model="searchForm.compCode"
          class="workCom"
          placeholder="请选择作业公司"
          size="mini"
          clearable
        >
          <el-option
            :label="item.companyName"
            :value="item.companyCode"
            v-for="item in companyList"
            :key="item.companyCode"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="searchClick()"
          size="mini"
          class="btn_search"
        >查询</el-button>
      </div>
      <div>
        <!-- 添加删除按钮 -->
        <el-button-group>
          <el-button icon="el-icon-plus" size="mini" @click="addmMchine"></el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 表格 -->
    <keep-alive>
      <el-table highlight-current-row stripe :data="tableData" max-height="620">
        <el-table-column prop="macCode" label="机械编号" width="120"></el-table-column>
        <el-table-column prop="macName" label="机械名称" width="120"></el-table-column>
        <el-table-column prop="shortCode" label="速记码" width="120"></el-table-column>
        <el-table-column prop="solidFlow" label="固定机" width="120"></el-table-column>
        <el-table-column prop="macTypeCode" label="机械种类" width="120"></el-table-column>
        <el-table-column prop="location" label="机械位置" width="120"></el-table-column>
        <el-table-column prop="produceTime" label="建造年月" width="120"></el-table-column>
        <el-table-column prop="buyTime" label="采购年月" width="120"></el-table-column>
        <el-table-column prop="macWeight" label="机械自重" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.macWeight | filtersWeight }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="isWz" label="是否外租" width="120">
          <template slot-scope="scope">
            <p v-if="scope.row.isWz == 1">自有</p>
            <p type="success" v-if="scope.row.isWz == 0">外租</p>
          </template>
        </el-table-column>
        <el-table-column prop="macStatus" label="维修状态" width="120">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.macStatus == 1">正常</el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.macStatus == 0">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="repairstartTime" label="开始时间" width="120">
          <template slot-scope="scope">{{ scope.row.repairstartTime | formatDate }}</template>
        </el-table-column>
        <el-table-column prop="repairfinishTime" label="结束时间" width="120">
          <template slot-scope="scope">{{ scope.row.repairstartTime | formatDate }}</template>
        </el-table-column>
        <!-- <el-table-column prop="createName" label="创建人" width="120"></el-table-column> -->
        <el-table-column fixed="right" label="操作" align="center" width="360">
          <template slot-scope="scope">
            <el-button size="mini" @click="compMod(scope.row)">
              <i class="iconfont icon-liebiaotubiao_guanlianjigou" style="color:#37bb2c"></i> 关联机构
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i> 编辑
            </el-button>
            <el-popconfirm @onConfirm="sub(scope.row.id)" @onCancel="cancel" title="您确定删除吗？">
              <el-button size="mini" type slot="reference">
                <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </keep-alive>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="[10, 15, 30, 50]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 添加机械用户 -->
    <el-drawer
      title="新增机械管理"
      :visible.sync="addDrawer"
      direction="rtl"
      size="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="ruleAddForm"
        label-width="100px"
        style="padding:20px"
      >
        <el-form-item label="作业公司" prop="compCode">
          <el-select filterable v-model="addForm.compCode" placeholder="请选择作业公司" style="width:100%">
            <el-option
              :label="item.companyName"
              :value="item.companyCode"
              v-for="item in companyList"
              :key="item.companyCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机械编号" prop="macCode">
          <el-input
            @input="addForm.macCode=verifyfilter('charemach',addForm.macCode)"
            v-model="addForm.macCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="机械名称" prop="macName">
          <el-input
            @input="addForm.macName=verifyfilter('char',addForm.macName)"
            v-model="addForm.macName"
          ></el-input>
        </el-form-item>
        <el-form-item label="速记码" prop="shortCode">
          <el-input
            @input="addForm.shortCode=verifyfilter('char',addForm.shortCode)"
            v-model="addForm.shortCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="固定机" prop="solidFlow">
          <el-select filterable v-model="addForm.solidFlow" placeholder="请选择固定机" style="width:100%">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="item in solList"
              :key="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机械种类" prop="macclassCode">
          <el-select
            filterable
            @change="changeCode(addForm.macclassCode)"
            v-model="addForm.macclassCode"
            placeholder="请选择机器种类"
            style="width:100%"
          >
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="item in mactypeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机械分类" prop="macTypeCode">
          <el-select
            filterable
            v-model="addForm.macTypeCode"
            placeholder="请选择机器种类"
            style="width:100%"
          >
            <el-option
              :label="item.macTypeName"
              :value="item.macTypeCode"
              v-for="item in macClassList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机械位置">
          <el-select filterable v-model="addForm.location" placeholder="请选择机器位置" style="width:100%">
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="item in locateList"
              :key="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建造年月">
          <el-date-picker
            value-format="timestamp"
            v-model="addForm.produceTime"
            type="date"
            placeholder="选择建造年月"
            format="yyyy-MM-dd"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="采购年月">
          <el-date-picker
            v-model="addForm.buyTime"
            type="date"
            placeholder="选择采购年月"
            format="yyyy-MM-dd"
            value-format="timestamp"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="机械自重" prop="macWeight">
          <el-input
            @input="addForm.macWeight=verifyfilter('digit',addForm.macWeight)"
            v-model="addForm.macWeight"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否外租" prop="isWz">
          <el-radio-group v-model="addForm.isWz">
            <el-radio label="1">自有</el-radio>
            <el-radio label="0">外租</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维修状态" prop="macStatus">
          <el-radio-group v-model="addForm.macStatus">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="addForm.repairstartTime"
            type="date"
            placeholder="选择开始时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="addForm.repairfinishTime"
            type="date"
            placeholder="选择结束时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <div class="demo-drawer__footer">
          <el-button size="small" @click="resetAddForm()">取 消</el-button>
          <el-button size="small" type="primary" @click="submitAddForm()">保 存</el-button>
        </div>
      </el-form>
    </el-drawer>

    <!-- 关联机构 -->
    <div class="relatedInstitutions">
      <el-drawer :title="companyName" :visible.sync="relationDrawer" direction="rtl">
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

    <!-- 编辑机械管理 -->
    <el-drawer title="编辑机械管理" :visible.sync="dialogFormVisible">
      <el-form :model="editForm" label-width="100px" style="padding:20px">
        <el-form-item required label="机械编号">
          <el-input
            @input="editForm.macCode=verifyfilter('charemach',editForm.macCode)"
            v-model="editForm.macCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item required label="机械名称：">
          <el-input
            @input="editForm.macName=verifyfilter('char',editForm.macName)"
            v-model="editForm.macName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item required label="速记码：">
          <el-input
            @input="editForm.shortCode=verifyfilter('latin',editForm.shortCode)"
            v-model="editForm.shortCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item required label="固流机：">
          <el-select
            filterable
            v-model="editForm.solidFlow"
            placeholder="请选择固流机"
            style="width:100%"
          >
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="item in solList"
              :key="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机械种类" prop="macclassCode">
          <el-select
            filterable
            @change="changeCode(editForm.macclassCode)"
            v-model="editForm.macclassCode"
            placeholder="请选择机器种类"
            style="width:100%"
          >
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="item in mactypeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机械分类" prop="macTypeCode">
          <el-select
            filterable
            v-model="editForm.macTypeCode"
            placeholder="请选择机器种类"
            style="width:100%"
          >
            <el-option
              :label="item.macTypeName"
              :value="item.macTypeCode"
              v-for="item in macClassList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="机械位置：">
          <el-select
            filterable
            v-model="editForm.location"
            placeholder="请选择所属公司"
            style="width:100%"
          >
            <el-option
              :label="item.dictLabel"
              :value="item.dictValue"
              v-for="item in locateList"
              :key="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="建造年月">
          <el-date-picker
            v-model="editForm.produceTime"
            style="width:100%"
            placeholder="选择建造年月"
            format="yyyy-MM"
            type="date"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="采购年月">
          <el-date-picker
            v-model="editForm.buyTime"
            type="date"
            placeholder="选择采购年月"
            format="yyyy-MM"
            value-format="timestamp"
            style="width:100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="机械状态">
          <template>
            <el-radio v-model="editForm.macStatus" label="1">正常</el-radio>
            <el-radio v-model="editForm.macStatus" label="0">停用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否外租">
          <template>
            <el-radio v-model="editForm.isWz" label="1">自有</el-radio>
            <el-radio v-model="editForm.isWz" label="0">外租</el-radio>
          </template>
        </el-form-item>
      </el-form>

      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="edit()">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { formatDate } from '../tool/date'
export default {
  name: 'Customer',
  data() {
    return {
      //搜索表单
      searchForm: {
        macTypeCode: '', //机械种类
        compCode: '' //作业公司
      },
      checkedComp: [],
      selectId: [],
      // 添加机械用户
      addForm: {
        compCode: '', //所属公司
        macCode: '', //机械编号
        macName: '', //机械名称
        shortCode: '', //速记码
        solidFlow: '', //固定机
        macTypeCode: '', //机械种类
        macclassCode: '', //机械fen类
        location: '', //机械位置
        produceTime: null, //建造年月
        buyTime: null, //采购年月
        macWeight: '', //机械自重
        isWz: '', //是否外租
        macStatus: '', //维修状态
        repairstartTime: null, //开始时间
        repairfinishTime: null //结束时间
      },
      addFormRules: {
        compCode: [
          { required: true, message: '请选择作业公司', trigger: 'change' }
        ],
        macCode: [
          { required: true, message: '请出入机械编号', trigger: 'blur' }
        ],
        macName: [
          { required: true, message: '请出入机械名称', trigger: 'blur' }
        ],
        shortCode: [
          { required: true, message: '请出入速记码', trigger: 'change' }
        ],
        solidFlow: [
          { required: true, message: '请选择固定机', trigger: 'change' }
        ],
        macStatus: [
          { required: true, message: '请选择维修状态', trigger: 'change' }
        ],
        isWz: [
          { required: true, message: '请选择是否对外出租', trigger: 'change' }
        ],
        macclassCode: [
          { required: true, message: '请选择机械种类', trigger: 'blur' }
        ],
        macTypeCode: [
          { required: true, message: '请选择机械分类', trigger: 'blur' }
        ],
        macWeight: [
          { required: true, message: '请输入机械自重', trigger: 'blur' }
        ]
      },
      //添加机械作业公司数据
      companyList: [],
      //机械种类数据
      mactypeList: [],
      //编辑机械管理
      editForm: {
        produceTime: null, //建造年月
        buyTime: null //采购年月
      },

      // 角色分页列表数据
      total: 0, //总页数
      pageSize: 10, //当前每页显示多少数据
      pageNum: 0, //当前页码
      queryInfo: {},

      dialogFormVisible: false, // 修改弹出框
      // 抽屉
      drawer: false, // 新增
      addDrawer: false,
      relation: false, // 关联
      relationDrawer: false, //关联机构
      loading: false,
      tableData: [],
      comp: [],
      nowData: {}, // 临时存放操作数据
      companyName: '',
      // 分类
      macClassList: [],
      locateList: [],
      solList: []
    }
  },
  mounted() {
    // 机械列表
    this.getMachineList()
    //作业公司
    this.getCompList()
    // 机械种类
    this.getmactypeList()
    // 固流机
    this.getsolList()

    this.getlocateList()
  },
  filters: {
    // 时间
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy.MM.dd')
    },
    //机械自重
    filtersWeight(value) {
      return value + 'T'
    }
  },
  methods: {
    changeCode(macTypeCode) {
      this.getmacClassList(macTypeCode)
    },
    // 关联机构
    async compMod(info) {
      if (!this.relationDrawer) {
        this.relationDrawer = true
      }
      this.nowData = info
      const that = this
      let data = []
      let ids = new Array()
      const res = await this.$http.get(
        `/psys-master-service/api/external/mmachineInfo/listmachinebind?id=${info.id}`
      )

      if (res.data.success) {
        this.comp = res.data.data.bindList
        this.companyName = res.data.data.companyName
        if (that.comp.length !== 0) {
          for (const n of that.comp) {
            // 如果绑定
            if (n.bind) {
              data.push(n.companyName)
              ids.push(n.companyCode)
            }
          }
          this.checkedComp = this.newArr(data)
          this.selectId = this.newArr(ids)
        }
      } else {
        that.$message.warning(res.data.msg)
      }
    },
    newArr(arr) {
      return Array.from(new Set(arr))
    },
    // 关联机构信息
    async mprocesscomp() {
      const that = this
      let trueId = new Set()
      if (that.checkedComp.length !== 0) {
        trueId = that.comp.filter(n => n.bind).map(n => n.companyCode)
        if (trueId.length !== 0) {
          that.selectId = trueId
        }
      } else {
        that.selectId = new Array()
      }
      const data = {
        compCode: that.selectId,
        deptCode: that.selectId,
        macId: that.nowData.id
      }
      const res = await that.$http.post(
        '/psys-master-service/api/external/mmachineInfo/addsyscomprelation',
        data
      )
      if (res.data.success) {
        if (that.relationDrawer) {
          this.searchClick()

          that.relationDrawer = false
        }
        that.$message.success(res.data.msg)
      } else {
        that.$message.warning(res.data.msg)
      }
    },
    compChange(v) {
      if (v.length !== 0) {
        this.checkedComp = v
        this.comp.forEach(i => {
          i.bind = false
        })

        this.comp
          .filter(n => this.checkedComp.includes(n.companyName))
          .forEach(i => {
            i.bind = true
          })
      }
    },
    //获取机械信息列表
    async getMachineList() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/mmachineInfo/query?startpage=1&pagesize=10&macclassType=MAC_TYPE`
      )
      if (res.status != 200) {
        return this.$message.error('获取数据失败')
      }
      this.tableData = res.data.data.pages
      this.total = parseInt(res.data.data.totalNum)
      this.pageNum = parseInt(res.data.data.pageNum)
    },
    // 查询
    async searchClick() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/mmachineInfo/query?startpage=1&pagesize=${this.pageSize}&compCode=${this.searchForm['compCode']}&macclassCode=${this.searchForm['macTypeCode']}`
      )
      if (res.data.code != '0000') {
        this.$message.error('查询失败！')
        return
      }
      // this.$message.success('查询成功！')

      this.tableData = res.data.data.pages
      this.total = parseInt(res.data.data.totalNum)
      this.pageNum = parseInt(res.data.data.pageNum)
    },
    //获取作业公司
    async getCompList() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/public/listworkcompany'
      )
      if (res.data.code != '0000') {
        this.$message.error('获取作业公司失败')
      }
      this.companyList = res.data.data
    },
    //获取固流机是SOLID_FLOW
    async getsolList() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=SOLID_FLOW`
      )
      if (res.data.code != '0000') {
        this.$message.error('获取机械种类失败')
      }
      this.solList = res.data.data
    },
    //获取机械位置dict_type是machine_location
    async getlocateList() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=machine_location`
      )
      if (res.data.code != '0000') {
        this.$message.error('获取机械种类失败')
      }
      this.locateList = res.data.data
    },
    //获取机械种类
    async getmactypeList() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=MAC_TYPE`
      )
      if (res.data.code != '0000') {
        this.$message.error('获取机械种类失败')
      }
      this.mactypeList = res.data.data
    },
    //获取机械分类
    async getmacClassList(data) {
      const res = await this.$http.get(
        `/psys-master-service/api/external/mmachineInfo/getmactypelist?macclasscode=${data}`
      )
      if (res.data.code != '0000') {
        this.$message.error('获取机械分类失败')
      }
      this.macClassList = res.data.data
    },
    //添加机械
    async addmMchine() {
      this.addDrawer = true
      this.addForm = {}
      this.getmacClassList('')
    },
    // 添加机械验真提交form表单
    submitAddForm() {
      delete this.addForm.macclassName
      this.addForm.buyTime =
        new Date(this.addForm.buyTime).getFullYear() +
        '-' +
        (new Date(this.addForm.buyTime).getMonth() + 1)
      this.addForm.produceTime =
        new Date(this.addForm.produceTime).getFullYear() +
        '-' +
        (new Date(this.addForm.produceTime).getMonth() + 1)

      this.$refs['ruleAddForm'].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            '/psys-master-service/api/external/mmachineInfo/add',
            this.addForm
          )

          if (res.data.code != '0000') {
            this.$message.error('添加失败！')
            return
          }
          this.$message.success('添加成功！')
          this.addDrawer = false
          this.getMachineList()
        } else {
          this.$message.error('校验失败！')
          return false
        }
      })
    },
    //添加机械验真提交form重置表单
    resetAddForm() {
      this.$refs['ruleAddForm'].resetFields()
    },
    // 根据id修改机械数据
    async handleEdit(index, info) {
      this.editForm = info
      console.log(this.editForm)
      this.editForm.produceTime = new Date(this.editForm.produceTime).getTime()
      this.editForm.buyTime = new Date(this.editForm.buyTime).getTime()
      this.dialogFormVisible = true
      this.getmacClassList(info.macclassCode)
      delete this.editForm.macclassName
    },

    //关联结构
    RelationFun(id) {
      this.relationDrawer = true
    },
    // 删除确认
    async sub(codes) {
      const res = await this.$http.delete(
        `/psys-master-service/api/external/mmachineInfo/delete/${codes}`
      )
      if (res.data.code == '0000') {
        this.$message.success('删除成功！')
        //重新获取数据
        this.getMachineList()
      }
    },
    // 取消
    cancel() {
      if (this.dialogFormVisible) {
        this.dialogFormVisible = false
      }
      if (this.drawer) {
        this.drawer = false
      }
      this.$message('已取消！')
    },
    // 编辑机械管理修改按钮
    async edit() {
      delete this.editForm.repairstartTime
      delete this.editForm.repairfinishTime
      delete this.editForm.createTime
      delete this.editForm.updateTime
      delete this.editForm.macclassName
      delete this.editForm.updateName
      delete this.editForm.updateBy
      delete this.editForm.createBy
      delete this.editForm.createName
      this.editForm.buyTime =
        new Date(this.editForm.buyTime).getFullYear() +
        '-' +
        (new Date(this.editForm.buyTime).getMonth() + 1)
      this.editForm.produceTime =
        new Date(this.editForm.produceTime).getFullYear() +
        '-' +
        (new Date(this.editForm.produceTime).getMonth() + 1)
      const res = await this.$http.put(
        '/psys-master-service/api/external/mmachineInfo/updateone',
        this.editForm
      )
      if (res.data.code != '0000') {
        this.$message.error('编辑保存失败')
        return
      }
      this.dialogFormVisible = false
      this.$message.success('修改成功！')
      this.getMachineList()
    },
    // 监听pageSize改变事件
    async handleSizeChange(newSize) {
      this.pageSize = newSize
      const res = await this.$http.get(
        `/psys-master-service/api/external/mmachineInfo/query?pagesize=${this.pageSize}&startpage=${this.pageNum}`
      )
      // console.log(res);
      this.tableData = res.data.data.pages
      this.total = parseInt(res.data.data.totalNum)
      this.pageNum = parseInt(res.data.data.pageNum)
    },
    //分页 监听页码值改变
    async handleCurrentChange(newPage) {
      const res = await this.$http.get(
        `/psys-master-service/api/external/mmachineInfo/query?pagesize=10&startpage=${newPage}`
      )
      this.tableData = res.data.data.pages
      this.total = parseInt(res.data.data.totalNum)
      this.pageNum = parseInt(res.data.data.pageNum)
    },
    //dilog 关闭询问
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
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}

// 查询表单start
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

  .btn_search,
  .workCom {
    margin-left: 16px;
  }
  /deep/.el-input {
    width: 150px;
  }
}
// 查询表单end
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
}
.box {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-radius: 4px 4px 0 0;
  border-top: none;
}
/deep/ .el-drawer__header {
  // margin-bottom: 12px;
  height: 40px;
  line-height: 41px;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid gainsboro;
  margin-bottom: 0;
}
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
}
/deep/ .el-table .cell {
  white-space: nowrap;
}

/deep/ .el-pagination {
  text-align: right;
  padding: 10px 20px;
}
/deep/ .el-table th > .cell {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #606266;
}
/deep/ .el-table .el-button:focus,
.el-table .el-button:hover {
  background-color: #fff;
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
/deep/ .el-table {
  max-height: 631px;
}
/deep/ .el-drawer__open .el-drawer.rtl {
  background: #f5f7fa;
}

/deep/ .el-drawer__body {
  overflow-y: auto;
  padding-bottom: 50px;
}
.header {
  width: 100%;
  height: 41px;
  line-height: 41px;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
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
