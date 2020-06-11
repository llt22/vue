<template>
  <div class="box">
    <!-- 查询添加删除,操作 -->
    <div class="selectBox">
      <div class="btn">
        <!-- 新增按钮 -->
        <el-button icon="el-icon-plus" @click="addstopcause" size="mini"></el-button>
        <!-- 删除按钮 -->
        <!-- <el-button icon  ="el-icon-delete" @click="deletestopcause(ids)" size="mini"></el-button> -->
      </div>
      <div class>
        <el-form size="mini" inline>
          <el-form-item label="停时名称">
            <el-input
              @input="stopcauseName=verifyfilter('char',stopcauseName)"
              @keyup.enter.native="getListData"
              v-model="stopcauseName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <keep-alive>
      <!-- 信息表格 -->
      <el-table
        highlight-current-row
        :data="tableData"
        :default-sort="{prop: 'todayTime', order: 'descending'}"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column prop="stopcauseName" label="停时名称" sortable></el-table-column>
        <el-table-column prop="stopcauseTypeCode" label="类型" sortable></el-table-column>
        <el-table-column prop="sortNum" label="排序" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" @click="zEdit(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              @onConfirm="deletestopcause(scope.row.id)"
              @onCancel="cancel"
              title="您确定删除吗？"
            >
              <el-button size="mini" type slot="reference">
                <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
              </el-button>
            </el-popconfirm>
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
      <el-drawer
        :before-close="handleClose"
        title="添加作业停时"
        :visible.sync="drawer"
        :with-header="true"
      >
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="停时名称">
            <el-input
              @input="form.stopcauseName=verifyfilter('char',form.stopcauseName)"
              v-model="form.stopcauseName"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              clearable
              filterable
              v-model="form.stopcauseTypeCode"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in compData"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input
              @input="form.sortNum=verifyfilter('digit',form.sortNum)"
              v-model="form.sortNum"
            ></el-input>
          </el-form-item>
          <div class="demo-drawer__footer">
            <el-button size="small" @click="cancel()">取 消</el-button>
            <el-button size="small" type="primary" @click="addstopcauseFun()">保 存</el-button>
          </div>
        </el-form>
      </el-drawer>
      <el-drawer
        :before-close="handleClose"
        title="修改作业停时"
        :visible.sync="editdrawer"
        :with-header="true"
      >
        <el-form ref="form" :model="nowData" label-width="100px">
          <el-form-item label="停时名称">
            <el-input
              @input="nowData.stopcauseName=verifyfilter('char',nowData.stopcauseName)"
              v-model="nowData.stopcauseName"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              clearable
              filterable
              v-model="nowData.stopcauseTypeCode"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in compData"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-input
              @input="nowData.sortNum=verifyfilter('digit',nowData.sortNum)"
              v-model="nowData.sortNum"
            ></el-input>
          </el-form-item>
          <div class="demo-drawer__footer">
            <el-button size="small" @click="cancel()">取 消</el-button>
            <el-button size="small" type="primary" @click="zeditEdit()">保 存</el-button>
          </div>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import compcon from "../publicprama/compcon";
export default {
  name: "worktime",
  components: { compcon },
  data() {
    return {
      compData: [],
      tableData: [],
      stopcauseName: "", //查询
      form: {
        stopcauseName: "",
        stopcauseTypeCode: "",
        sortNum: "",
        shipistatusCode: ""
      },
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      // 新增抽屉显示
      drawer: false,
      // 修改弹出
      editdrawer: false,
      labelPosition: "left",
      nowData: {}, // 临时存放操作数据
      // 分页
      currentPage: 1,
      totalNum: 1,
      pagesize: 10,
      // 批量删除
      ids: []
    };
  },
  mounted() {
    this.getCompData();
    this.getListData();
  },
  watch: {},
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async getCompData() {
      const that = this;
      const token = window.sessionStorage.getItem("token");
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=STOPCAUSE_TYPE`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.compData = res.data.data;
        }
      }
    },
    // 选择
    handleSelectionChange(val) {
      this.ids = [];
      var that = this;
      val.map(n => {
        that.ids.push(n.id);
      });
      this.ids = this.uniq(that.ids);
    },
    uniq(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    // 添加stopcause的按钮
    addstopcause() {
      if (!this.drawer) {
        this.drawer = true;
      }
      this.form = {};
      this.getCompData();
    },
    // 新增作业停时/psys-master-service/api/external/stopcause/addOne
    async addstopcauseFun() {
      const data = {
        stopcauseName: this.form.stopcauseName,
        stopcauseTypeCode: this.form.stopcauseTypeCode,
        sortNum: this.form.sortNum,
        shipistatusCode: this.form.shipistatusCode
      };
      const res = await this.$http.post(
        `/psys-master-service/api/external/stopcause/insert`,
        data
      );
      if (res.status == 200) {
        if (res.data.success) {
          if (this.drawer) {
            this.drawer = false;
          }
          this.$message.success(res.data.msg);
          this.getListData();
        } else {
          this.$message.warning(res.data.msg);
        }
      } else {
        this.$message.error("新增失败");
      }
    },
    // 修改作业停时PUT /api/psys-master-service/api/external/stopcause/updateOne
    async zeditEdit() {
      var that = this;
      if (this.nowData.id) {
        const data = {
          id: that.nowData.id,
          stopcauseName: this.nowData.stopcauseName,
          stopcauseTypeCode: this.nowData.stopcauseTypeCode,
          sortNum: this.nowData.sortNum,
          shipistatusCode: this.nowData.shipistatusCode
        };
        // console.log(data)
        const res = await that.$http.put(
          `/psys-master-service/api/external/stopcause/updatebyid`,
          data
        );
        if (res.status == 200) {
          if (res.data.success) {
            if (that.editdrawer) {
              that.editdrawer = false;
            }
            that.$message.success(res.data.msg);
            that.getListData();
          } else {
            that.$message.warning(res.data.msg);
          }
        } else {
          that.$message.error("获取数据失败！");
        }
      }
    },
    // 查询数据table
    async getListData() {
      const that = this;
      if (this.stopcauseName) {
        this.queryall.startpage = 1;
      }
      const aurl = `/psys-master-service/api/external/stopcause/queryall?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}&stopcauseName=${this.stopcauseName}`;
      const res = await this.$http.get(aurl);
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
          // 分页
          this.queryall.startpage = res.data.data.pageNum;
          this.queryall.pagesize = res.data.data.pageSize;
          this.totalNum = parseInt(res.data.data.totalNum);
        } else {
          this.$message.warning(res.data.msg);
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    // 删除stopcause的函数
    async deletestopcause(id) {
      if (id.length !== 0) {
        const param = { ids: id };
        const res = await this.$http.delete(
          `/psys-master-service/api/external/stopcause/deletebyid?id=${id}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.queryall.startpage = 1;
            this.getListData();
          } else {
            this.$message.warning(res.data.msg);
          }
        } else {
          this.$message.error("删除失败！");
        }
      } else {
        this.$message.warning("请先选择删除数据");
      }
    },
    // 修改作业停时弹出
    zEdit(index, row) {
      this.getCompData();
      this.nowData = row;
      if (!this.editdrawer) {
        this.editdrawer = true;
      }
    },

    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val;
      this.getListData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val;
      this.getListData();
    },
    cancel() {
      if (this.drawer) {
        this.drawer = false;
      }
      if (this.editdrawer) {
        this.editdrawer = false;
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
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 13px;
  border-bottom: 1px solid gainsboro;
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
.btn {
  display: inline;
  /deep/ .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 6px;
  }
}
/deep/ .el-button + .el-button {
  margin-left: 3px;
}
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 20px 0;
}
.selectBox {
  justify-content: space-between;
  display: flex;
  flex-direction: row-reverse;
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-left: none;
  line-height: 28px;
  height: 39px;
  padding-top: 11px;
  padding-left: 14px;
  padding-right: 20px;
}
/deep/ .page {
  margin: 3px 1rem !important;
  line-height: 30px !important;
}

.el-form {
  // margin-left: 50px;
  margin-right: 25px;
}
.el-form-item__label {
  width: 200px !important;
}
</style>


