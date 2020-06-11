<template>
  <div class="box">
    <!-- 查询添加删除,操作 -->
    <div class="selectBox">
      <div class="btn">
        <!-- 新增按钮 -->
        <el-button icon="el-icon-plus" @click="addTide" size="mini"></el-button>
        <!-- 删除按钮 -->
        <!-- <el-button icon="el-icon-delete" @click="deleteTide(ids)" size="mini"></el-button> -->
      </div>
      <div class>
        <el-form ref="form" size="mini" :model="form" inline>
          <el-form-item label="日期">
            <el-date-picker
              value-format="yyyy/MM/dd"
              @keyup.enter.native="getListData"
              v-model="queryInfo.todayTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="公司">
            <!-- <compcon></compcon> -->
            <el-select
              filterable
              @keyup.enter.native="getListData"
              clearable
              v-model="queryInfo.compCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in compData"
                :key="item.companyCode"
                :label="item.companyName"
                :value="item.companyCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 信息表格 -->
    <keep-alive>
      <el-table
        highlight-current-row
        :data="tableData"
        :default-sort="{prop: 'todayTime', order: 'descending'}"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        max-height="620"
      >
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column prop="chnCalendar" width="160" label="阴历" sortable></el-table-column>
        <el-table-column prop="today" label="时间" sortable width="160"></el-table-column>
        <el-table-column prop="companyName" label="所属公司" width="160" sortable></el-table-column>
        <el-table-column prop="updateName" label="录入人" sortable></el-table-column>
        <el-table-column prop="updateTime" label="录入时间" sortable width="200"></el-table-column>
        <!-- <el-table-column prop="createName" label="创建人" sortable></el-table-column> -->
        <!-- <el-table-column prop="createTime" label="创建时间" sortable width="200"></el-table-column> -->
        <el-table-column fixed="right" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" @click="zEdit(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-popconfirm @onConfirm="deleteTide(scope.row.id)" @onCancel="cancel" title="您确定删除吗？">
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
        title="添加潮汐"
        :visible.sync="drawer"
        :with-header="true"
      >
        <el-form ref="formRef" :model="form" label-width="100px">
          <el-form-item required label="阴历">
            <el-input disabled v-model="form.chnCalendar"></el-input>
          </el-form-item>
          <el-form-item
            prop="todayTime"
            :rules="[
                { required: true, message: '时间不能为空'},
              ]"
            label="时间选择"
          >
            <el-date-picker
              @change="changeDate"
              type="date"
              clearable
              placeholder="请选择"
              v-model="form.todayTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>

          <el-form-item required label="所属公司">
            <el-input disabled v-model="form.companyName"></el-input>
            <!-- <el-select clearable v-model="form.compCode" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in compData"
                :key="item.companyCode"
                :label="item.companyName"
                :value="item.companyCode"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <div class="demo-drawer__footer">
            <el-button size="small" @click="cancel()">取 消</el-button>
            <el-button size="small" type="primary" @click="addTideFun()">保 存</el-button>
          </div>
        </el-form>
      </el-drawer>
      <el-drawer
        :before-close="handleClose"
        title="修改潮汐"
        :visible.sync="editdrawer"
        :with-header="true"
      >
        <el-form ref="formRef" :model="nowData" label-width="100px">
          <el-form-item required label="阴历">
            <el-input disabled v-model="nowData.chnCalendar"></el-input>
          </el-form-item>
          <el-form-item
            prop="todayTime"
            :rules="[
                { required: true, message: '时间不能为空'},
              ]"
            label="时间选择"
          >
            <el-date-picker
              @change="changeDate"
              type="date"
              clearable
              placeholder="请选择"
              v-model="nowData.todayTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            prop="compCode"
            :rules="[
                { required: true, message: '所属公司不能为空'},
              ]"
            label="所属公司"
          >
            <el-input disabled v-model="nowData.companyName"></el-input>
            <!-- <el-select clearable v-model="nowData.compCode" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in compData"
                :key="item.companyCode"
                :label="item.companyName"
                :value="item.companyCode"
              ></el-option>
            </el-select>-->
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
import calder from "../../plugins/calder.js";
import lunar from "chinese-lunar";
import calendar from "lunar-calendar";
import compcon from "../publicprama/compcon";
export default {
  name: "tideInfo",
  components: { compcon },
  data() {
    return {
      queryInfo: {
        todayTime: "",
        compCode: ""
      },
      compData: [],
      tableData: [],
      form: {
        chnCalendar: "",
        company: "",
        compCode: "",
        todayTime: new Date()
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
      nowData: {
        chnCalendar: "",
        company: "",
        compCode: "",
        todayTime: new Date()
      }, // 临时存放操作数据
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
    const date = new Date(this.form.todayTime);
    const lun = calendar.solarToLunar(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    this.form.chnCalendar =
      lun.lunarMonthName + lun.lunarDayName + "(" + lun.zodiac + "年)";
  },
  watch: {
    // 如果 `form` 发生改变，这个函数就会运行
    form: function(newForm, oldForm) {
      if (newForm.todayTime) {
        this.form.todayTime = newForm.todayTime;
        const date = new Date(this.form.todayTime);
        const lun = calendar.solarToLunar(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        );
        this.form.chnCalendar =
          lun.lunarMonthName + lun.lunarDayName + "(" + lun.zodiac + "年)";
      }
    }
  },
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
        `/psys-master-service/api/external/public/getsecondcomplist`
      ); //psys-master-service/api/external/public/getsecondcomplist
      if (res.status == 200) {
        if (res.data.success) {
          this.compData = res.data.data;
        }
      }
    },
    changeDate() {
      //  const todayTime = this.form.todayTime;
      // this.form.chnCalendar = lunar.format(
      //   lunar.solarToLunar(new Date(todayTime.setDate(todayTime.getDate()))),
      //   "MD"
      // );
      // console.log(this.form.todayTime)
      if (this.form.todayTime) {
        var now = this.form.todayTime;
        const date1 = new Date(now);
        const lun1 = calendar.solarToLunar(
          date1.getFullYear(),
          date1.getMonth() + 1,
          date1.getDate()
        );
        this.form.chnCalendar =
          lun1.lunarMonthName + lun1.lunarDayName + "(" + lun1.zodiac + "年)";
      }
      if (this.nowData.todayTime) {
        var now = this.nowData.todayTime;
        const date = new Date(now);
        const lun = calendar.solarToLunar(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        );
        this.nowData.chnCalendar =
          lun.lunarMonthName + lun.lunarDayName + "(" + lun.zodiac + "年)";
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
    // 添加Tide的按钮
    addTide() {
      if (!this.drawer) {
        this.drawer = true;
      }
      this.form = {};
      this.form.companyName = window.sessionStorage.getItem("companyName");
      this.form.compCode = window.sessionStorage.getItem("compCode");
    },
    // 新增潮汐/psys-master-service/api/external/tide/addOne
    async addTideFun() {
      const data = {
        chnCalendar: this.form.chnCalendar,
        companyName: this.form.companyName,
        compCode: this.form.compCode,
        todayTime: this.form.todayTime
      };
      this.$refs["formRef"].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            `/psys-master-service/api/external/tide/addone`,
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
        } else {
          return false;
        }
      });
    },
    // 修改潮汐PUT /api/psys-master-service/api/external/tide/updateOne
    async zeditEdit() {
      var that = this;
      if (typeof this.nowData.todayTime === "string") {
        this.nowData.todayTime = new Date(this.nowData.todayTime);
      }
      if (this.nowData.todayTime) {
        const todayTime = this.nowData.todayTime;
        const data = {
          id: that.nowData.id,
          chnCalendar: that.nowData.chnCalendar,
          companyName: that.nowData.companyName,
          compCode: that.nowData.compCode,
          todayTime: that.nowData.todayTime
        };
        // console.log(data)
        this.$refs["formRef"].validate(async valid => {
          if (valid) {
            const res = await that.$http.put(
              `/psys-master-service/api/external/tide/updateone`,
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
          } else {
            return false;
          }
        });
      }
    },
    // 查询数据table
    async getListData() {
      const that = this;
      if (this.queryInfo.compCode || this.queryInfo.todayTime) {
        that.queryall.startpage = 1;
      }
      let aurl = `/psys-master-service/api/external/tide/select?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}`;
      if (this.queryInfo.compCode && this.queryInfo.todayTime) {
        aurl = `/psys-master-service/api/external/tide/select?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}&compCode=${this.queryInfo.compCode}&todayTime=${this.queryInfo.todayTime}`;
      } else if (this.queryInfo.todayTime) {
        aurl = `/psys-master-service/api/external/tide/select?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}&todayTime=${this.queryInfo.todayTime}`;
      } else if (this.queryInfo.compCode) {
        aurl = `/psys-master-service/api/external/tide/select?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}&compCode=${this.queryInfo.compCode}`;
      }
      const res = await this.$http.get(aurl);
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
          that.tableData.map(n => {
            n.todayTime = new Date(n.todayTime)
              .toLocaleDateString()
              .replace(/\//g, "-");
          });
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
    // 删除Tide的函数
    async deleteTide(id) {
      if (id.length !== 0) {
        const param = { ids: id };
        const res = await this.$http.delete(
          `/psys-master-service/api/external/tide/delete/${id}`
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
    // 修改潮汐弹出
    zEdit(index, row) {
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


