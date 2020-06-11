<template>
  <div class="box">
    <!-- 查询项目 -->
    <div class="selectBox">
      <div style="display:flex;justify-content: space-between;">
        <el-form ref="queryInfo" size="mini" :model="queryInfo" inline>
          <el-form-item label="缆桩名称">
            <el-input
              @input="queryInfo.bittName=verifyfilter('char',queryInfo.bittName)"
              @keyup.enter.native="getBittInfo"
              placeholder="请输入缆桩名称"
              v-model="queryInfo.bittName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 查询按钮 -->
            <el-button type="primary" icon="el-icon-search" @click="getBittInfo">查询</el-button>
          </el-form-item>
        </el-form>
        <div style="padding:0 1rem">
          <!-- 新增按钮 -->
          <el-button size="mini" icon="el-icon-plus" @click="addBitt"></el-button>
        </div>
      </div>
    </div>
    <!-- 缆桩信息渲染 -->
    <keep-alive>
    <el-table
      :data="bittTableData"
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
      <el-table-column prop="bittCode" label="缆桩编号" sortable width="120"></el-table-column>
      <el-table-column prop="bittName" label="缆桩名称" sortable width="120"></el-table-column>
      <el-table-column prop="shortName" label="速记码" sortable width></el-table-column>
      <el-table-column prop="berthName" label="所属泊位" width="120" sortable></el-table-column>
      <el-table-column prop="berthLongitude" label="经度" width="120" sortable></el-table-column>
      <el-table-column prop="berthDimension" label="纬度" width="120" sortable></el-table-column>
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
    </keep-alive>
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
    <!-- 新增缆桩信息的弹出框 -->
    <el-drawer
      :title="flag?'新增缆桩信息':'编辑缆桩信息'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
      :before-close="handleCloseBefore"
      :append-to-body="true"
    >
      <div style="padding:1rem">
        <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="80px">
          <el-form-item label="缆桩名称" prop="bittName">
            <el-input v-model="addForm.bittName" @input="change('char')"></el-input>
          </el-form-item>
          <el-form-item label="缆桩编号" prop="bittCode">
            <el-input v-model="addForm.bittCode" @input="change('char')"></el-input>
          </el-form-item>
          <el-form-item label="速记码" prop="shortName">
            <el-input v-model="addForm.shortName" @input="change('zimu')"></el-input>
          </el-form-item>
          <el-form-item label="所属泊位" prop="berthName">
            <el-input disabled v-model="addForm.berthName"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop>
            <el-input v-model="addForm.berthLongitude" @input="change('num')"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop>
            <el-input v-model="addForm.berthDimension" @input="change('num')"></el-input>
          </el-form-item>
        </el-form>
        <span class="demo-drawer__footer">
          <!-- 取消 -->
          <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
          <!-- 确认 -->
          <el-button size="small" type="primary" @click="addUpdate">保 存</el-button>
        </span>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "bittInfoList",
  data() {
    return {
      queryInfo: {
        // 缆桩名称
        bittName: ""
      },
      bittTableData: [],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      berthNameoptions: [],
      // 当前页码
      addForm: {
        bittName: "",
        bittCode: "",
        shortName: "",
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
        bittName: [
          { required: true, message: "请输入缆桩名称", trigger: "blur" }
        ],
        bittCode: [
          { required: true, message: "缆桩编号不能为空", trigger: "blur" }
        ],
        shortName: [
          { required: true, message: "请输入速记码", trigger: "blur" }
        ],
        // berthName: [
        //   { required: true, message: "请输入所属泊位", trigger: "blur" }
        // ],
        berthLongitude: [
          { required: true, message: "请输入经度", trigger: "blur" },
          { max: 8, message: "长度最大 8 个字符", trigger: "blur" }
        ],
        berthDimension: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          { max: 8, message: "长度最大 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  props: ["senData"],
  watch: {
    // 监听变化 senData
    senData: function() {
      const taht = this;
      this.getBittInfo();
    }
  },
  mounted() {
    this.getBittInfo();
  },
  methods: {
    handleCloseBefore(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    change(z) {
      this.$forceUpdate();
      if (z === "num") {
        if (this.addForm.berthLongitude) {
          this.addForm.berthLongitude = this.verifyfilter(
            "number",
            this.addForm.berthLongitude
          );
        }
        if (this.addForm.berthDimension) {
          this.addForm.berthDimension = this.verifyfilter(
            "number",
            this.addForm.berthDimension
          );
        }
      } else if (z === "char") {
        if (this.addForm.bittCode) {
          this.addForm.bittCode = this.verifyfilter(
            "char",
            this.addForm.bittCode
          );
        }
        if (this.addForm.bittName) {
          this.addForm.bittName = this.verifyfilter(
            "char",
            this.addForm.bittName
          );
        }
      } else if (z === "zimu") {
        this.addForm.shortName = this.verifyfilter(
          "latin",
          this.addForm.shortName
        );
      }
    },
    // 新增缆桩
    addBitt() {
      this.addDialogVisible = true;
      this.flag = true;
      this.addForm = {};
      this.addForm.berthId = this.senData.id;
      this.addForm.berthName = this.senData.berthName;
    },
    // 编辑缆桩信息
    handleEdit(index, info) {
      this.addDialogVisible = true;
      this.addForm.id = info.id;
      this.addForm.shortName = info.shortName;
      this.addForm.bittName = info.bittName;
      this.addForm.berthDimension = info.berthDimension;
      this.addForm.berthLongitude = info.berthLongitude;
      this.addForm.bittCode = info.bittCode;
      this.addForm.berthId = info.berthId;
      this.addForm.berthName = this.senData.berthName;
      this.flag = false;
    },
    // 删除缆桩信息
    handleDelete(index, info) {
      let that = this;
      if (info.id.length !== 0) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await this.$http.delete(
              `/psys-master-service/api/external/mbitt/deletebyid?id=${info.id}`
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
      if (this.senData.id) {
        if (this.queryInfo.bittName) {
          this.queryall.startpage = 1;
        }
        const res = await this.$http.get(
          `/psys-master-service/api/external/mbitt/queryall?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}&bittName=${this.queryInfo.bittName}&berthId=${this.senData.id}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.bittTableData = res.data.data.pages;
            // 分页
            this.queryall.startpage = res.data.data.pageNum;
            this.totalNum = res.data.data.totalNum;
          } else {
            this.$message.warning(res.data.msg);
          }
        }
      } else {
        this.$message.warning("缺少泊位ID");
      }
    },
    async addUpdate() {
      // 传递的参数等待确认
      // flag为真进行添加操作
      let that = this;
      // this.addForm.berthName = this.senData.berthName;
      delete this.addForm.berthName;
      this.addForm.berthId = this.senData.id; // 关联泊位
      that.$refs["addForm"].validate(async valid => {
        if (valid) {
          if (this.flag) {
            const data = {};
            const res = await this.$http.post(
              "/psys-master-service/api/external/mbitt/add",
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
              "/psys-master-service/api/external/mbitt/updatebyid",
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
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 20px 0;
}
.page {
  background: #ffffff;
  margin-top: 4px;
  border-radius: 4px 4px 0 0;
  line-height: 35px;
  padding-right: 1rem;
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
/deep/ .el-table {
  max-height: 631px;
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


