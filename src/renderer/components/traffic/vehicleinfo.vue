<template>
  <div class="box">
    <div class="title">
      <p>汽车资料</p>
    </div>
    <!-- 查询项目 -->
    <div class="selectBox">
      <el-form ref="queryInfo" size="mini" :model="queryInfo" inline>
        <el-form-item label="汽车名称">
          <el-input v-model="queryInfo.bitName"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <el-button type="primary" icon="el-icon-search" @click="findBitt">查询</el-button>
          <!-- 新增按钮 -->
          <el-button icon="el-icon-plus" @click="addBitt">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 汽车信息渲染 -->
    <el-table
      :data="carTableData"
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column prop="vehicleNum" label="汽车编号" sortable width="180"></el-table-column>
      <el-table-column prop="sortName" label="速记码" sortable width="180"></el-table-column>
      <el-table-column prop="compName" label="公司名字" sortable></el-table-column>
      <el-table-column prop="berthLongitude" label="经度" sortable></el-table-column>
      <el-table-column prop="berthDimension" label="纬度" sortable></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
          </el-button>
          <!-- 删除按钮 -->
          <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">
            <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i>删除
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
        :page-size="queryall.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 新增汽车信息的弹出框 -->
    <el-drawer
      :title="flag?'新增汽车信息':'编辑汽车信息'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <div style="padding:1rem">
        <!-- 新增人员的form表单 -->
        <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="80px">
          <el-form-item label="汽车名称" prop="vehicleNum">
            <el-input v-model="addForm.vehicleNum"></el-input>
          </el-form-item>
          <el-form-item label="速记码" prop="sortName">
            <el-input v-model="addForm.sortName"></el-input>
          </el-form-item>

          <el-form-item label="经度" prop="berthLongitude">
            <el-input type="number" :min="0" v-model="addForm.berthLongitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="berthDimension">
            <el-input type="number" :min="0" v-model="addForm.berthDimension"></el-input>
          </el-form-item>
        </el-form>
        <span class="demo-drawer__footer">
          <!-- 取消 -->
          <el-button size="mini" @click="addDialogVisible = false">取 消</el-button>
          <!-- 确认 -->
          <el-button size="mini" type="primary" @click="addUpdate">保 存</el-button>
        </span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "vehicleinfo",
  data() {
    return {
      queryInfo: {
        // 汽车名称
        bitName: ""
      },
      carTableData: [],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      // 当前页码
      addForm: {
        vehicleNum: "",
        bittCode: "",
        sortName: "",
        berthId: "",
        berthName: "",
        berthLongitude: "",
        berthDimension: ""
      },
      addDialogVisible: false,
      flag: false,
      nowData: {}, // 临时存放操作数据
      // 分页
      currentPage: 1,
      totalNum: 1,
      // 批量删除
      ids: [],
      addFormRule: {
        vehicleNum: [
          { required: true, message: "请输入汽车名称", trigger: "blur" }
        ],
        sortName: [
          { required: true, message: "请输入速记码", trigger: "blur" }
        ],
        berthName: [
          { required: true, message: "请输入所属泊位", trigger: "blur" }
        ],
        berthLongitude: [
          { required: true, message: "请输入经度", trigger: "blur" }
        ],
        berthDimension: [
          { required: true, message: "请输入纬度", trigger: "blur" }
        ]
      }
    };
  },

  mounted() {
    this.getBittInfo();
  },
  methods: {
    // 查询汽车
    findBitt() {},
    // 新增汽车
    addBitt() {
      this.addDialogVisible = true;
      this.flag = true;
      // alert("此刻进行汽车信息添加操作");
    },
    // 编辑汽车信息
    handleEdit(index, info) {
      this.addDialogVisible = true;
      this.addForm.id = info.id;
      this.addForm.sortName = info.sortName;
      this.addForm.vehicleNum = info.vehicleNum;
      this.addForm.berthDimension = info.berthDimension;
      this.addForm.berthLongitude = info.berthLongitude;
      this.addForm.bittCode = info.bittCode;
      this.addForm.berthName = info.berthName;
      this.flag = false;
      console.log(index, info);
      console.log(info);
    },
    // 删除汽车信息
    handleDelete(index, info) {
      let that = this;
      console.log("删除", info);
      if (info.id.length !== 0) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await this.$http.delete(
              `/psys-master-service/api/external/vehicleinfo/deletebyid?id=${info.id}`
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              this.queryall.startpage = 1;
              that.getBittInfo();
            } else {
              that.$message.warning(res.data.msg);
            }
          })
          .catch(() => {});
      } else {
        this.$message.warning("请先选择删除数据");
      }
      console.log(index, info);
    },
    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val;
      this.getBittInfo();
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val;
      this.getBittInfo();
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
    async getBittInfo() {
      // 获取BittInfo信息
      var that = this;
      const res = await this.$http.get(
        `/psys-master-service/api/external/vehicleinfo/queryall?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.carTableData = res.data.data.pages;
          // 分页
          this.queryall.startpage = res.data.data.pageNum;
          this.totalNum = res.data.data.totalNum;
        } else {
          this.$message.warning(res.data.msg);
        }
      }
    },
    async addUpdate() {
      // 传递的参数等待确认
      // flag为真进行添加操作
      let that = this;
      that.$refs["addForm"].validate(async valid => {
        if (valid) {
          if (this.flag) {
            const data = {};
            const res = await this.$http.post(
              "/psys-master-service/api/external/vehicleinfo/add",
              this.addForm
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              that.getBittInfo();
            } else {
              that.$message.warning(res.data.msg);
            }
          } else {
            // 进行修改操作
            const res = await this.$http.put(
              "/psys-master-service/api/external/vehicleinfo/updatebyid",
              this.addForm
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              that.getBittInfo();
            } else {
              that.$message.warning(res.data.msg);
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
.box /deep/ .v-modal {
  z-index: 11 !important;
  display: none !important;
}
.page {
  background: #ffffff;
  margin-top: 40px;
  border-radius: 4px 4px 0 0;
  line-height: 50px;
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
/deep/ .el-select,
/deep/ .el-select > .el-input {
  width: 100%;
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


