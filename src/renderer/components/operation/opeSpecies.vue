<template>
  <div class="boxa">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="未关联" name="weiguanlian">
        <div>
          <!-- 查询项目 -->
          <div class="selectBox">
            <el-form ref="queryInfo" size="mini" :model="queryInfo" inline>
              <el-form-item label="货物名称">
                <el-input @keyup.enter.native="find" v-model="queryInfo.cargoName"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 查询按钮 -->
                <el-button type="primary" icon="el-icon-search" @click="find">查询</el-button>
                <!-- 新增按钮 -->
                <!-- <el-button icon="el-icon-plus" @click="addProcess">新增</el-button> -->
              </el-form-item>
            </el-form>
          </div>
          <!-- 关联货种信息渲染 -->
          <keep-alive>
            <el-table
              highlight-current-row
              :data="ProcessTableData"
              @selection-change="handleSelectionChange"
              style="width: 100%"
              :default-sort="{prop: 'date', order: 'descending'}"
            >
              <el-table-column align="center" type="selection" width="55"></el-table-column>
              <el-table-column prop="cargoName" label="货物名称" sortable width="180"></el-table-column>
              <el-table-column prop="shortCode" label="速记码" sortable width="180"></el-table-column>
              <el-table-column prop="cargoclassName" label="货类" sortable></el-table-column>
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
            <el-form-item label="货种名称">
              <el-input v-model="queryInfo.cargoName"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- 查询按钮 -->
              <el-button type="primary" icon="el-icon-search" @click="getProcessInfo">查询</el-button>
              <!-- 新增按钮 -->
              <!-- <el-button icon="el-icon-plus" @click="addProcess">新增</el-button> -->
            </el-form-item>
          </el-form>
        </div>
        <!-- 关联货种信息渲染 -->
        <el-table
          highlight-current-row
          :data="ProcessTableData"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column prop="cargoName" label="货物名称" sortable width="180"></el-table-column>
          <el-table-column prop="shortCode" label="速记码" sortable width="180"></el-table-column>
          <el-table-column prop="cargoclassName" label="货类" sortable></el-table-column>
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
    <div class="guanlian">
      <el-button size="small" @click="addUpdate">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "opeSpecies",
  data() {
    return {
      queryInfo: {
        // 货种名称
        cargoName: ""
      },
      ProcessTableData: [],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      addForm: [
        {
          cargoCode: "",
          operationProcessId: ""
        }
      ],
      addDialogVisible: false,
      flag: true,
      activeName: "weiguanlian", // 切换未关联
      nowData: {}, // 临时存放操作数据
      // 分页
      currentPage: 1,
      totalNum: 1,
      pagesize: 10,
      // 批量删除
      ids: []
    };
  },
  props: ["senSpecies"],
  watch: {
    // 监听变化 senSpecies
    senSpecies: function() {
      // this.getProcessInfo();
      this.findNoProcess();
    }
  },
  created() {
    this.findNoProcess();
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "yiguanlian") {
        this.flag = false;
        this.getProcessInfo();
      } else if (tab.name === "weiguanlian") {
        this.flag = true;
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
    // 选中未关联的去关联
    handleSelectionChange(n) {
      // if (n.length > 1) {
      //   this.$message.warning("一次只能关联一个数据");
      //   n = [];
      //   return;
      // } else if (n.length === 1) {
        const arr = n.map(item => {
          return {
            cargoCode: item.cargoCode,
            operationProcessId: this.senSpecies.id
          };
        });
        this.addForm = arr;
      // }
    },
    // 添加关联
    async addUpdate() {
      // 传递的参数等待确认
      let that = this;
      // console.log(this.addForm);
      if (this.flag) {
        if (
          this.addForm.operationProcessId !== "" &&
          this.addForm.cargoCode !== ""
        ) {
          const res = await this.$http.post(
            "/psys-master-service/api/external/mprocesscargo/add",
            this.addForm
          );
          if (res.data.success) {
            that.$message.success(res.data.msg);
            that.findNoProcess();
          } else {
            that.$message.warning(res.data.msg);
          }
        }
      }
    },
    // 查询未关联货种
    async findNoProcess() {
      var that = this;
      if (this.senSpecies && this.senSpecies.id) {
        if (this.queryInfo.cargoName) {
          this.queryall.startpage = 1;
        }
        const res = await this.$http.get(
          `/psys-master-service/api/external/mprocesscargo/selectcargo?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&operationProcessId=${this.senSpecies.id}&cargoName=${this.queryInfo.cargoName}`
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

    // 删除关联货种信息
    handleDelete(index, info) {
      let that = this;
      this.$confirm("确定取消关联该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$http.delete(
            `/psys-master-service/api/external/mprocesscargo/deletebyid?id=${info.id}`
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
    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val;
      this.getProcessInfo();
    },
    SizeChange(val) {
      this.queryall.pagesize = val;
      this.findNoProcess();
    },
    CurrentChange(val) {
      this.queryall.startpage = val;
      this.findNoProcess();
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val;
      this.getProcessInfo();
    },
    // 对话框关闭
    handleClose() {
      // Dialog隐藏
      this.addDialogVisible = false;
    },
    // 获取已关联list
    async getProcessInfo() {
      // 获取ProcessInfo信息
      var that = this;
      if (this.queryInfo.cargoName) {
        this.queryall.startpage = 1;
      }
      if (this.senSpecies && this.senSpecies.id) {
        const res = await this.$http.get(
          `/psys-master-service/api/external/mprocesscargo/v1/querycontainscargo?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&operationProcessId=${this.senSpecies.id}&cargoName=${this.queryInfo.cargoName}`
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
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
.boxa {
  background: #f5f7fa;
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
/deep/ .el-table th {
  border-left: 1px solid #ebeef5;
  padding: 2px;
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
</style>


