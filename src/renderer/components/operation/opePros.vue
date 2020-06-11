<template>
  <div class="boxa">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="未关联" name="weiguanlian">
        <div>
          <!-- 查询项目 -->
          <div class="selectBox">
            <el-form ref="queryInfo" size="mini" :model="queryInfo" inline>
              <el-form-item label="过程名称">
                <el-input @keyup.enter.native="find" v-model="queryInfo.oprocessName"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 查询按钮 -->
                <el-button type="primary" icon="el-icon-search" @click="find">查询</el-button>
                <!-- 新增按钮 -->
                <!-- <el-button icon="el-icon-plus" @click="addProcess">新增</el-button> -->
              </el-form-item>
            </el-form>
          </div>
          <!-- 关联过程信息渲染 -->
          <keep-alive>
          <el-table
          @selection-change="handleSelectionChange"
            highlight-current-row
            :data="ProcessTableData"
            style="width: 100%"
            :default-sort="{prop: 'date', order: 'descending'}"
          >
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column prop="oprocessName" label="过程名称" sortable width="180"></el-table-column>
            <el-table-column prop="istally" label="是否理货量" sortable width="180"></el-table-column>
            <el-table-column prop="opaType" label="过程种类" sortable></el-table-column>
          </el-table>
          </keep-alive>
          <!-- 分页区域 -->
          <div class="page">
            <el-pagination
              background
              @size-change="SizeChange"
              @current-change="CurrentChange"
              :current-page="queryall.startpage"
              :page-sizes="[5, 10, 15, 20,25,30]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已关联" name="yiguanlian">
        <!-- 查询项目 -->
        <div class="selectBox">
          <el-form ref="queryInfo" size="mini" :model="queryInfo" inline>
            <el-form-item label="过程名称">
              <el-input @keyup.enter.native="getProcessInfo" v-model="queryInfo.oprocessName"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- 查询按钮 -->
              <el-button type="primary" icon="el-icon-search" @click="getProcessInfo">查询</el-button>
              <!-- 新增按钮 -->
              <!-- <el-button icon="el-icon-plus" @click="addProcess">新增</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <!-- 关联过程信息渲染 -->
        <el-table
          highlight-current-row
          :data="ProcessTableData"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
          <el-table-column prop="oprocessName" label="过程名称" sortable width="180"></el-table-column>
          <el-table-column prop="istally" label="是否理货量" sortable width="180"></el-table-column>
          <el-table-column prop="opaType" label="过程种类" sortable></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">
                <i class="iconfont icon-liebiaotubiao_quxiaoguanlian" style="color:#E6A91F"></i>取消关联
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryall.startpage"
            :page-sizes="[5, 10, 15, 20,25,30]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div  class="guanlian">
      <el-button size="small" @click="addUpdate">保存</el-button>
    </div>
  </div>

  <!-- <el-dialog
      :title="flag?'新增关联作业过程':'编辑关联作业过程'"
      :visible.sync="addDialogVisible"
      width="50%"
      :append-to-body="true"
      @close="handleClose"
    >
      <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="80px">
        <el-form-item label="过程名称" prop="oprocessName">
          <el-input type="number" :min="0" v-model="addForm.oprocessName"></el-input>
        </el-form-item>
        <el-form-item label="是否理货量" prop="delFlag">
          <el-input type="number" :min="0" v-model="addForm.delFlag"></el-input>
        </el-form-item>
        <el-form-item label="过程种类" prop="opaType">
          <el-input v-model="addForm.opaType"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUpdate">保 存</el-button>
      </span>
  </el-dialog>-->
</template>

<script>
export default {
  name: "opeSpecies",
  data() {
    return {
      queryInfo: {
        // 作业过程名称
        oprocessName: ""
      },
      activeName: "weiguanlian", // 切换未关联
      ProcessTableData: [],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      // 当前页码
      addForm: {
        oprocessName: "",
        istally: "",
        sortNum: 0
      },
      addDialogVisible: false,
      flag: true,
      nowData: {}, // 临时存放作业数据
      // 分页
      currentPage: 1,
      totalNum: 1,
      pagesize: 10,
      // 批量删除
      ids: [],
      addFormRule: {
        oprocessName: [
          { required: true, message: "请输入作业过程名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在1 到 15 个字符", trigger: "blur" }
        ],
        sortName: [
          { required: true, message: "请输入是否理货量", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        opaType: [
          { required: true, message: "请输入作业过程种类", trigger: "blur" }
        ]
      }
    };
  },
  props: ["senPros"],
  watch: {
    // 监听变化 senPros
    senPros: function() {
      this.findNoProcess();
    }
  },
  created() {
    this.findNoProcess();
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "yiguanlian") {
        this.getProcessInfo();
        this.flag = false
      } else if (tab.name === "weiguanlian") {
         this.flag = true
        this.findNoProcess();
        
      }
    },
    find() {
      if (this.activeName === "yiguanlian") {
        this.getProcessInfo();
      } else if (this.activeName === "weiguanlian") {
        this.findNoProcess();
      }
    },
    // 查询未关联货种
    async findNoProcess() {
      var that = this;
      if (this.senPros && this.senPros.id) {
        if (this.queryInfo.oprocessName) {
          this.queryall.startpage = 1;
        }
        const res = await this.$http.get(
          `/psys-master-service/api/external/mprocessoperation/selectoprocess?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&operationProcessId=${this.senPros.id}&oprocessName=${this.queryInfo.oprocessName}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.ProcessTableData = res.data.data.pages;
            // 分页
            this.queryall.startpage = res.data.data.pageNum;
            this.totalNum = res.data.data.totalNum;
          } else {
            this.$message.warning(res.data.msg);
          }
        }
      } else {
        this.$message.warning("没有关联操作工艺");
      }
    },
    // 选中未关联的去关联
    handleSelectionChange(n) {
      // if (n.length > 1) {
      //   this.$message.warning("一次只能关联一个数据");
      //   n = []
      //   return
      // } else if (n.length === 1) {
      const arr = n.map(item => {
        return {
          operationCode: item.operationCode,
          operationProcessId: this.senPros.id
        };
      });
      this.addForm = arr
      // } 
    },
    // 查询关联作业过程
    findProcess() {},
    // 新增关联作业过程
    addProcess() {
      this.addDialogVisible = true;
      this.flag = true;
    },
    // 编辑关联作业过程信息
    handleEdit(index, info) {
      this.addDialogVisible = true;
      this.addForm.oprocessName = info.oprocessName;
      this.addForm.id = info.id;
      this.addForm.istally = info.istally;
      this.addForm.opaType = info.opaType;
      this.flag = false;
    },
    // 删除关联作业过程信息
    handleDelete(index, info) {
      let that = this;
      this.$confirm("此作业将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$http.delete(
            `/psys-master-service/api/external/mprocessoperation/deletebyid?id=${info.id}`
          );
          if (res.data.success) {
            if (that.addDialogVisible) {
              that.addDialogVisible = false;
            }
            that.$message.success(res.data.msg);
            this.queryall.startpage = 1;
            that.getProcessInfo();
          } else {
            that.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    SizeChange(val) {
      this.queryall.pagesize = val;
      this.findNoProcess();
    },
    CurrentChange(val) {
      this.queryall.startpage = val;
      this.findNoProcess();
    },
    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val;
      this.getProcessInfo();
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val;
      this.getProcessInfo();
    },
    // 对话框关闭
    handleClose() {
      // Dialog关闭时候,清空addForm里面的值
      this.addForm = {};
      // 表单验证重置
      this.$refs.addForm.resetFields();
      // Dialog隐藏
      this.addDialogVisible = false;
    },
    async getProcessInfo() {
      // 获取ProcessInfo信息
      var that = this;
      if (this.senPros && this.senPros.id) {
        if (this.queryInfo.oprocessName) {
          this.queryall.startpage = 1;
        }
        // external/mprocessoperation/v1/querycontainsoprocess?startpage=1&pagesize=10&operationProcessId=1252042217665728512&oprocessName
        const res = await this.$http.get(
          `/psys-master-service/api/external/mprocessoperation/v1/querycontainsoprocess?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&operationProcessId=${this.senPros.id}&oprocessName=${this.queryInfo.oprocessName}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.ProcessTableData = res.data.data.pages;
            // 分页
            this.queryall.startpage = res.data.data.pageNum;
            this.totalNum = res.data.data.totalNum;
          } else {
            this.$message.warning(res.data.msg);
          }
        }
      } else {
        this.$message.warning("没有关联作业工艺");
      }
    },
    async addUpdate() {
      // 传递的参数等待确认
      // flag为真进行添加作业
      let that = this;
      if(this.flag){
        const res = await this.$http.post(
                "/psys-master-service/api/external/mprocessoperation/add",
                this.addForm
              );
              if (res.data.success) {
                if (that.addDialogVisible) {
                  that.addDialogVisible = false;
                }
                that.$message.success(res.data.msg);
                that.findNoProcess();
              } else {
                that.$message.warning(res.data.msg);
              }
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
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  margin: 3px 1rem !important;
  line-height: 30px !important;
}
.box {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-radius: 4px 4px 0 0;
  border-top: none;
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
.guanlian {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f5f7fa;
  padding: 0 1rem;
  text-align: right;
  line-height: 50px;
  border-top: 1px solid #e1e4eb;
}
.el-button {
  margin-left: 0px !important;
}
</style>


