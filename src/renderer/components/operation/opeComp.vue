<template>
  <div class="box">
    <!-- 查询项目 -->
    <div class="selectBox">
      <el-form ref="queryInfo" size="mini" :model="queryInfo" inline>
        <el-form-item label="机构名称">
          <el-input v-model="queryInfo.oprocessName"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 查询按钮 -->
          <el-button type="primary" icon="el-icon-search" @click="findProcess">查询</el-button>
          <!-- 新增按钮 -->
          <el-button icon="el-icon-plus" @click="addProcess">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 关联机构信息渲染 -->
    <el-table
      :data="ProcessTableData"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="oprocessName" label="机构名称" sortable width="180"></el-table-column>
      <el-table-column prop="berthId" label="是否为理货量" sortable width="180"></el-table-column>
      <el-table-column prop="opaType" label="机构种类" sortable></el-table-column>
      <el-table-column label="操作" width="200">
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
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <!-- 新增关联机构的弹出框 -->
    <el-dialog
      :title="flag?'新增关联机构':'编辑关联机构'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <!-- 新增人员的form表单 -->
      <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="80px">
        <el-form-item label="机构名称" prop="oprocessName">
          <el-input type="number" :min="0" v-model="addForm.oprocessName"></el-input>
        </el-form-item>
        <el-form-item label="是否为理货量" prop="berthDiam">
          <el-input type="number" :min="0" v-model="addForm.berthDiam"></el-input>
        </el-form-item>
        <el-form-item label="机构种类" prop="opaType">
          <el-input v-model="addForm.opaType"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 取消 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- 确认 -->
        <el-button type="primary" @click="addUpdate">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 机构名称

        oprocessName: ""
      },
      ProcessTableData: [],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      // 当前页码
      addForm: {
        oprocessName: "",
        opaType: ""
      },
      addDialogVisible: false,
      flag: false,
      nowData: {}, // 临时存放操作数据
      // 分页
      currentPage: 1,
      totalNum: 1,
      pagesize: 10,
      // 批量删除
      ids: [],
      addFormRule: {
        oprocessName: [
          { required: true, message: "请输入作业机构名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在1 到 15 个字符", trigger: "blur" }
        ],
        berthIongtude: [
          { required: true, message: "请输入是否为理货量", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        opaType: [
          { required: true, message: "请输入机构种类", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getProcessInfo();
  },
  methods: {
    // 查询关联机构
    findProcess() {},
    // 新增关联机构
    addProcess() {
      this.addDialogVisible = true;
      this.flag = true;
    },
    // 编辑关联机构信息
    handleEdit(index, info) {
      this.addDialogVisible = true;
      this.addForm.oprocessName = info.oprocessName;
      this.addForm.id = info.id;
      this.addForm.opaType = info.opaType;
      this.flag = false;
      console.log(index, info);
      console.log(info);
    },
    // 删除关联机构信息
    handleDelete(index, info) {
      let that = this;
      console.log("删除", info);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
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
      console.log(index, info);
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
      const res = await this.$http.get(
        `/psys-master-service/api/external/mprocessoperation/queryall?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}`
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
    },
    async addUpdate() {
      // 传递的参数等待确认
      // flag为真进行添加操作
      let that = this;
      if (this.flag) {
        const res = await this.$http.post(
          "/psys-master-service/api/external/mprocessoperation/add",
          this.addForm
        );
        if (res.data.success) {
          if (that.addDialogVisible) {
            that.addDialogVisible = false;
          }
          that.$message.success(res.data.msg);
          that.getProcessInfo();
        } else {
          that.$message.warning(res.data.msg);
        }
      } else {
        // 这里可能接口有问题
        // 进行修改操作
        const res = await this.$http.put(
          "/psys-master-service/api/external/mprocessoperation/updatebyid",
          this.addForm
        );
        if (res.data.success) {
          if (that.addDialogVisible) {
            that.addDialogVisible = false;
          }
          that.$message.success(res.data.msg);
          that.getProcessInfo();
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


