<!-- 泊位信息上报 -->
<template>
  <div class="box">
    <!-- 查询  -->
    <div class="selectBox">
      <el-form size="mini" inline>
        <el-form-item label>
          <el-select
            v-model="queryForm.companyCode"
            placeholder="请选择作业公司"
            style="width:150px"
            clearable
          >
            <el-option
              :label="item.companyName"
              :value="item.companyCode"
              v-for="item in companyList"
              :key="item.companyCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="queryForm.date"
            type="date"
            placeholder="选择日期"
            style="width:150px"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- 查询按钮 -->
          <el-button type="primary" icon="el-icon-search" @click="searchForm">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button plain icon="el-icon-plus" style="width:40px;height:28px" @click="createFrom"></el-button>
          <el-button
            plain
            icon="el-icon-edit"
            style="width:40px;height:28px"
            :disabled="chooseFalg"
            @click="handleEditForm"
          ></el-button>
          <el-button
            plain
            icon="el-icon-delete"
            style="width:40px;height:28px"
            @click="handleDelete"
            :disabled="chooseFalg"
          ></el-button>
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
        style="width: 100%"
        @row-click="handeleRowClick"
        highlight-current-row
      >
        <el-table-column prop="berthName" label="泊位" width></el-table-column>
        <el-table-column prop="shipName" label="船舶" width></el-table-column>
        <el-table-column prop="servieType" label="作业类型" width></el-table-column>
        <el-table-column prop="workInfo" label="作业内容" width></el-table-column>
        <el-table-column prop="workDate" label="作业时间" width></el-table-column>
        <el-table-column prop="duration" label="时长" width></el-table-column>
      </el-table>
    </keep-alive>
    <!-- 分页区域 -->
    <div class="page">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
        :page-sizes="[10, 15, 20, 25]"
        :current-page="queryall.startpage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 新增抽屉 -->
    <div class="pop">
      <el-drawer
        title="新增外服信息"
        :before-close="handleClose"
        :visible.sync="dialog"
        direction="rtl"
        size="30%"
        custom-class="demo-drawer"
        ref="drawer"
      >
        <div class="demo-drawer__content">
          <el-form
            :model="addForm"
            ref="addFormRef"
            :rules="rules"
            label-width="180px"
            style="padding:0 20px"
          >
            <el-form-item label="泊位：" prop="berthId">
              <el-select v-model="addForm.berthId" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in berthList"
                  :key="item.id"
                  :label="item.berthName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="船舶：" prop="shipId">
              <el-select
                v-model="addForm.shipId"
                @change="changeSelect"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  :value="item.id"
                  :label="item.nameCn"
                  v-for="item in shipList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="作业类型：" prop="servieType">
              <el-select
                v-model="addForm.servieType"
                @change="changeType"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                  v-for="item in workType"
                  :key="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业内容：" prop="workInfo">
              <el-input v-model="addForm.workInfo" autocomplete="off" placeholder="请输入标签"></el-input>
            </el-form-item>
            <el-form-item label="作业开始时间：" prop="bdate">
              <el-date-picker
                v-model="addForm.bdate"
                type="datetime"
                placeholder="选择日期"
                style="width:100%"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="作业结束时间：" prop="edate">
              <el-date-picker
                v-model="addForm.edate"
                type="datetime"
                placeholder="选择日期"
                style="width:100%"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="padding-bottom:7px">
            <el-button @click="addCancelFormtwo">保存并添加</el-button>
            <el-button type="primary" @click="addSubmitForm">保 存</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <!-- 编辑抽屉 -->
    <div class="pop">
      <el-drawer
        title="编辑外服信息"
        :before-close="handleClose"
        :visible.sync="editDialog"
        direction="rtl"
        size="30%"
        custom-class="demo-drawer"
        ref="drawer"
      >
        <div class="demo-drawer__content">
          <el-form
            :model="editForm"
            ref="editFormRef"
            :rules="rules"
            label-width="180px"
            style="padding:0 20px"
          >
            <el-form-item label="泊位：" prop="berthId">
              <el-select v-model="editForm.berthId" placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in berthList"
                  :key="item.id"
                  :label="item.berthName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="船舶：" prop="shipId">
              <el-select v-model="editForm.shipId" placeholder="请选择" style="width:100%">
                <el-option
                  :value="item.id"
                  :label="item.nameCn"
                  v-for="item in shipList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="作业类型：" prop="servieType">
              <el-select v-model="editForm.servieType" placeholder="请选择" style="width:100%">
                <el-option
                  :label="item.dictLabel"
                  :value="item.dictLabel"
                  v-for="item in workType"
                  :key="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业内容：" prop="workInfo">
              <el-input v-model="editForm.workInfo" autocomplete="off" placeholder="请输入标签"></el-input>
            </el-form-item>
            <el-form-item label="作业开始时间：" prop="bdate">
              <el-date-picker
                v-model="editForm.bdate"
                type="datetime"
                placeholder="选择日期"
                style="width:100%"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="作业结束时间：" prop="edate">
              <el-date-picker
                v-model="editForm.edate"
                type="datetime"
                placeholder="选择日期"
                style="width:100%"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer" style="padding-bottom:7px">
            <el-button @click="editCancelFormtwo('formtwo')">保存并添加</el-button>
            <el-button type="primary" @click="editSubmitForm">保 存</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'berth',
  data() {
    return {
      //查询信息
      queryForm: {
        companyCode: '',
        date: ''
      },
      dialog: false, //新增抽屉
      editDialog: false, //编辑抽屉
      // formLabelWidth: '150px',
      sat: true,
      //新增抽屉Form
      addForm: {},
      //编辑抽屉form
      editForm: {
        bdate: null,
        edate: null
      },
      form: {},
      curHeight: '0',
      value: [],
      rules: {
        workInfo: [
          { required: true, message: '请输入作业内容', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        berthId: [{ required: true, message: '请选择泊位', trigger: 'change' }],
        shipId: [{ required: true, message: '请选择船舶', trigger: 'change' }],
        servieType: [
          { required: true, message: '请选择维保类型', trigger: 'change' }
        ],
        bdate: [
          {
            // type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        edate: [
          {
            // type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      // 查询
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      totle: 0,
      // 分页
      totalNum: 1,
      // 当前页码
      currentPage: 2,
      // 对话框隐藏
      // 通过flag控制进行添加操作还是修改操作,为true的时候进行的是添加操作
      flag: true,
      // nowData: {},
      // compData: [],
      version: 'v1', //版本
      companyList: [], //作业公司
      berthList: [], //泊位
      shipList: [], //船舶

      workType: [], //作业类型
      id: '', //全局id
      chooseFalg: true //选中标识
    }
  },
  // beforeMount() {
  //   var h = document.documentElement.clientHeight || document.body.clientHeight
  //   this.curHeight = h - 230
  // },
  created() {
    this.getoutMessageList()
    this.getCompany()
    this.getBerth()
    this.getShip()
    this.getWorkType()
  },
  computed: {},
  methods: {
    //获取信息列表
    async getoutMessageList() {
      const res = await this.$http.get(
        `/psys-ireport-service/api/external/dreportservice/${this.version}/queryall`,
        {
          params: this.queryall
        }
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      console.log(res)
      this.totle = res.data.data.totalNum
      this.queryall.startpage = res.data.data.pageNum
      // console.log(res.data.totalNum)
      this.tableData = res.data.data.pages
    },
    //获取作业公司
    async getCompany() {
      const res = await this.$http.get(
        'psys-master-service/api/external/public/listworkcompany'
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      // console.log(res.data.data)
      this.companyList = res.data.data
    },
    //获取泊位信息
    async getBerth() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/protected/queryberthbycode'
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      // console.log(res)
      this.berthList = res.data.data
    },
    //获取船舶信息
    async getShip() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/public/queryshipdrop'
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      // console.log(res)
      this.shipList = res.data.data
      // console.log(this.shipList)
    },

    //查询信息
    async searchForm() {
      // 判断如果date 为空  就不带date字段
      console.log(this.queryForm)
      if (this.queryForm.date == '') {
        const res = await this.$http.get(
          `/psys-ireport-service/api/external/dreportservice/${this.version}/queryall?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&orgCode=${this.queryForm.companyCode}`
        )
        if (res.data.code != '0000') {
          return this.$message.error(res.data.msg)
        }
        // console.log(res)
        this.tableData = res.data.data.pages
      } else {
        const res = await this.$http.get(
          `/psys-ireport-service/api/external/dreportservice/${this.version}/queryall?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&orgCode=${this.queryForm.companyCode}&workDate=${this.queryForm.date}`
        )
        if (res.data.code != '0000') {
          return this.$message.error(res.data.msg)
        }
        // console.log(res)
        this.tableData = res.data.data.pages
      }
    },
    //获取作业类型
    async getWorkType() {
      const res = await this.$http.get(
        '/psys-master-service/api/external/public/listdict?dicttype=JOB'
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      // console.log(res)
      this.workType = res.data.data
    },
    //点击当前行把id传到全局变量id中
    handeleRowClick(row, column, event) {
      console.log(row)
      this.id = row.id
      console.log(this.id)
      this.chooseFalg = !this.chooseFalg
    },
    // 根据id删除当前数据
    async deleteById() {
      console.log(this.id)
      const res = await this.$http.delete(
        `/psys-ireport-service/api/external/dreportservice/${this.version}/delete/${this.id}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      console.log(res)
      this.$message.success('删除成功！')
      this.getoutMessageList()
    },
    //根据选择框整体删除
    async handleDelete() {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该角色数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => console.log(err))
      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      console.log('删除整体')
      this.deleteById()
    },
    //新增外服信息
    createFrom() {
      this.dialog = true
      this.formtwo = {}
    },
    //编辑外服提交
    async handleEditForm() {
      this.editDialog = true
      const res = await this.$http.get(
        `/psys-ireport-service/api/external/dreportservice/${this.version}/querybyid?id=${this.id}`
      )
      if (res.data.code != '0000') {
        return this.$message.error(res.data.msg)
      }
      console.log(res)
      this.editForm = res.data.data
      // this.editForm.editForm.getTime()
      // console.log(new Date(this.editForm.bdate).getTime())

      this.editForm.edate = new Date(this.editForm.edate).getTime()
      this.editForm.bdate = new Date(this.editForm.bdate).getTime()
    },
    //编辑提交
    editSubmitForm() {},
    // 抽屉关闭提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    //新增保存封装
    addFunc() {
      this.addForm.status = '0'
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            `/psys-ireport-service/api/external/dreportservice/${this.version}/insert`,
            this.addForm
          )
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          }
          console.log(res)
          this.getoutMessageList()
        } else {
          return false
        }
      })
    },
    //新增保存
    addSubmitForm() {
      this.addFunc()
      // this.dialog = false
    },
    // 新增保存并添加
    addCancelFormtwo() {
      this.addFunc()
      this.$refs.addFormRef.resetFields()
    },
    //编辑保存封装
    editFun() {
      console.log(this.editForm)
      let data = {}
      data.id = this.editForm.id
      data.berthId = this.editForm.berthId
      data.shipId = this.editForm.shipId
      data.shipName = this.editForm.shipName
      data.servieType = this.editForm.servieType
      data.workInfo = this.editForm.workInfo
      data.bdate = this.editForm.bdate
      data.edate = this.editForm.edate
      console.log(data)

      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // console.log(valid)
          const res = await this.$http.put(
            `/psys-ireport-service/api/external/dreportservice/${this.version}/update`,
            data
          )
          if (res.data.code != '0000') {
            return this.$message.error(res.data.msg)
          }
          console.log(res)
          this.$message.success('编辑保存成功')
          this.getoutMessageList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑保存
    editSubmitForm() {
      this.editFun()
      this.editDialog = false
    },
    //编辑保存并添加
    editCancelFormtwo() {
      this.editFun()
      this.$refs.editFormRef.resetFields()
    },

    // 多选
    handleSelectionChange(val) {},

    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val
      this.getoutMessageList()
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val
      this.getoutMessageList()
    },
    dateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1)
      var now = new Date(date2)
      console.log(sdate)
      console.log(now)
      var days = now.getTime() - sdate.getTime()
      // var day = parseInt(days / (1000 * 60 * 60 * 24))
      var hours = parseInt((days % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var minutes = parseInt((days % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = (days % (1000 * 60)) / 1000
      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 && seconds >= 1 ? '0' + seconds : seconds
      console.log(hours + '小时' + minutes + '分钟')
      // return day
    },
    changeSelect(val) {
      console.log(val)
      this.shipList.forEach(item => {
        if (item.id == val) {
          console.log(item.nameCn)
          this.addForm.shipName = item.nameCn
        }
      })
    },
    changeType(val) {
      // this.workType.forEach(item => {
      //   if ((item.dictValue = val)) {
      //   }
      // })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-drawer__header {
  height: 41px;
  font-size: 16px;
  font-weight: 600;
}
/deep/ .el-form-item__content {
  margin-left: 20px !important;
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
  height: 41px !important;
}
/deep/ .el-table tr {
  height: 41px !important;
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
  margin-bottom: 20px;
}
.pop /deep/ .el-form-item__content {
  width: 100%;
}
.pop /deep/ .el-select {
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
  margin-top: 20px;
}
.box .selectBox {
  background: #f5f7fa;
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
