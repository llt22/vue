<template>
  <div class="box">
    <div class="selectBox">
      <el-form ref="form" size="mini" :model="form" inline>
        <el-form-item label="中文船名">
          <el-input @input="queryInfo.nameCn=verifyfilter('char',queryInfo.nameCn)" @keyup.enter.native="getListData" v-model="queryInfo.nameCn"></el-input>
        </el-form-item>
        <el-form-item label="速记码">
          <el-input @input="queryInfo.shortCode=verifyfilter('latin',queryInfo.shortCode)" @keyup.enter.native="getListData" v-model="queryInfo.shortCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <div class="btn">
            <el-button plain icon="el-icon-plus" @click="add()"></el-button>
            <!-- <el-button plain icon="el-icon-delete" @click="subDelete(ids)"></el-button> -->
          </div>
        </el-form-item>
      </el-form>
    </div>
    <keep-alive>
    <el-table
    highlight-current-row
      @selection-change="handleSelectionChange"
      stripe
      :data="tableData"
      style="width: 100%"
       max-height="620"
    >
      <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
      <el-table-column prop="nameCn" label="中文船名" width="120"></el-table-column>
      <el-table-column prop="shortCode" label="速记码" width></el-table-column>
      <el-table-column prop="callNo" label="呼号" width="120"></el-table-column>
      <el-table-column prop="captainPhone" label="船长电话" width="120"></el-table-column>
      <el-table-column prop="shipCompany" label="船公司" width="120"></el-table-column>
      <el-table-column prop="shipOwner" label="船主" width></el-table-column>
      <el-table-column prop="netTon" label="净吨" width></el-table-column>
      <el-table-column prop="weightTon" label="载重吨" width></el-table-column>
      <el-table-column prop="deadWeight" label="船舶自重" width="120"></el-table-column>
      <el-table-column prop="totalTon" label="总吨" width></el-table-column>
      <el-table-column prop="buildDate" label="建造日期" width="120"></el-table-column>
      <el-table-column prop="shipNationCode" label="船籍代码" width></el-table-column>
      <el-table-column prop="hatchNo" label="舱口数" width></el-table-column>
      <el-table-column prop="cabinNum" label="舱数" width></el-table-column>
      <el-table-column prop="shipLength" label="船长" width></el-table-column>
      <el-table-column prop="shipHeight" label="船高" width></el-table-column>
      <el-table-column prop="shipWidth" label="船宽" width></el-table-column>
      <el-table-column prop="topSpeed" label="最大船速" width></el-table-column>
      <el-table-column prop="shipSpeed" label="航速" width></el-table-column>
      <el-table-column prop="mouldedDepth" label="型深" width></el-table-column>
      <el-table-column prop="mouldedHeight" label="型高" width></el-table-column>
      <el-table-column prop="fullloadWater" label="满载吃水" width></el-table-column>
      <el-table-column prop="unloadedDraft" label="空载吃水" width></el-table-column>
      <el-table-column prop="remark" label="备注" width></el-table-column>
      <el-table-column label="操作" fixed="right" align="center"  width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
          </el-button>
          <el-popconfirm @onConfirm="subDelete(scope.row.id)" @onCancel="cancel" title="您确定删除吗？">
            <el-button size="mini" type slot="reference">
              <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    </keep-alive>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="startpage"
        :page-sizes="[5, 10, 15, 20,25,30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <div class="leftbox">
      <el-drawer
        :before-close="handleClose"
        :title="flag?'新增驳船信息':'编辑驳船信息'"
        :visible.sync="drawer"
        direction="rtl"
      >
        <div class="formt-itm" @click="colpoFun()">
          <p>基本信息</p>
          <div>
            <i v-if="!colpo" class="el-icon-arrow-down"></i>
            <i v-if="colpo" class="el-icon-arrow-up"></i>
          </div>
        </div>
        <el-form :rules="basisRules" ref="basisRulesRef" size="small" :model="form">
          <div v-if="colpo" class="form-t">
            <el-form-item label="中文船名" prop="nameCn" :label-width="formLabelWidth">
              <el-input @input="form.nameCn=verifyfilter('char',form.nameCn)" v-model="form.nameCn" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="速记码" prop="shortCode" :label-width="formLabelWidth">
              <el-input @input="form.shortCode=verifyfilter('latin',form.shortCode)" v-model="form.shortCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船长" prop="shipLength" :label-width="formLabelWidth">
              <el-input @input="form.shipLength=verifyfilter('digit',form.shipLength)"  v-model="form.shipLength" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船高" prop="shipHeight" :label-width="formLabelWidth">
              <el-input @input="form.shipHeight=verifyfilter('digit',form.shipHeight)" v-model="form.shipHeight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船宽" prop="shipWidth" :label-width="formLabelWidth">
              <el-input @input="form.shipWidth=verifyfilter('digit',form.shipWidth)" v-model="form.shipWidth" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="呼号" :label-width="formLabelWidth">
              <el-input @input="form.callNo=verifyfilter('digit',form.callNo)" v-model="form.callNo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船长电话" prop="captainPhone" :label-width="formLabelWidth">
              <el-input @input="form.captainPhone=verifyfilter('digit',form.captainPhone)" v-model="form.captainPhone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船公司" :label-width="formLabelWidth">
              <el-input @input="form.shipCompany=verifyfilter('char',form.shipCompany)" type v-model="form.shipCompany" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船主" :label-width="formLabelWidth">
              <el-input @input="form.shipOwner=verifyfilter('char',form.shipOwner)" type v-model="form.shipOwner" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="净吨" prop :label-width="formLabelWidth">
              <el-input @input="form.netTon=verifyfilter('digit',form.netTon)" v-model="form.netTon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="载重吨" :label-width="formLabelWidth">
              <el-input @input="form.weightTon=verifyfilter('digit',form.weightTon)" v-model="form.weightTon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船舶自重" :label-width="formLabelWidth">
              <el-input @input="form.deadWeight=verifyfilter('digit',form.deadWeight)" v-model="form.deadWeight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="船籍" :label-width="formLabelWidth">
              <el-input @input="form.shipNationCode=verifyfilter('char',form.shipNationCode)" type v-model="form.shipNationCode" autocomplete="off"></el-input>
            </el-form-item>
          </div>
          <div class="formt-itm" @click="colpopoFun()">
            <p>其他信息</p>
            <div>
              <i v-if="!colpopo" class="el-icon-arrow-down"></i>
              <i v-if="colpopo" class="el-icon-arrow-up"></i>
            </div>
          </div>
          <div v-if="colpopo" class="form-t">
            <el-form-item label="型高" :label-width="formLabelWidth">
              <el-input @input="form.mouldedHeight=verifyfilter('digit',form.mouldedHeight)" v-model="form.mouldedHeight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="型深" :label-width="formLabelWidth">
              <el-input @input="form.mouldedDepth=verifyfilter('digit',form.mouldedDepth)" v-model="form.mouldedDepth" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="建造日期" :label-width="formLabelWidth">
              <el-date-picker v-model="form.buildDate" type="date" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="总吨" :label-width="formLabelWidth">
              <el-input @input="form.totalTon=verifyfilter('digit',form.totalTon)" v-model="form.totalTon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="舱口数" :label-width="formLabelWidth">
              <el-input @input="form.hatchNo=verifyfilter('digit',form.hatchNo)" v-model="form.hatchNo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="舱数" :label-width="formLabelWidth">
              <el-input @input="form.cabinNum=verifyfilter('digit',form.cabinNum)" v-model="form.cabinNum" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="最大船速" :label-width="formLabelWidth">
              <el-input @input="form.topSpeed=verifyfilter('digit',form.topSpeed)" v-model="form.topSpeed" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="航速" :label-width="formLabelWidth">
              <el-input @input="form.shipSpeed=verifyfilter('digit',form.shipSpeed)" v-model="form.shipSpeed" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="空载吃水" :label-width="formLabelWidth">
              <el-input @input="form.unloadedDraft=verifyfilter('digit',form.unloadedDraft)" v-model="form.unloadedDraft" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="满载吃水" :label-width="formLabelWidth">
              <el-input @input="form.fullloadWater=verifyfilter('digit',form.fullloadWater)" v-model="form.fullloadWater" autocomplete="off"></el-input>
            </el-form-item>
            <div style="margin-left:1rem">
              <el-form-item label="备注" prop="desc">
                <el-input type="textarea" @input="form.remark=verifyfilter('char',form.remark)" v-model="form.remark" autocomplete="off"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <div class="demo-drawer__footer">
          <el-button size="small" @click="cancel()">取 消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="addUpdate()"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: "seagoingvessel",
  data() {
    return {
      // 基础信息验证
      basisRules: {
        nameCn: [
          { required: true, message: "中文船名不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        shortCode: [
          { required: true, message: "请输入速记码", trigger: "blur" },
          { min: 1, message: "长度在 1个字符以上", trigger: "blur" }
        ],
        shipLength: [
          { required: true, message: "船长不能为空", trigger: "blur" }
        ],
        shipHeight: [
          { required: true, message: "船高不能为空", trigger: "blur" }
        ],
        shipWidth: [
          { required: true, message: "船宽不能为空", trigger: "blur" }
        ],
        captainPhone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { min: 8, max: 11, message: "请输入正确的电话号码", trigger: "blur" }
        ]
      },
      ids: [], // 批量删除
      queryInfo: {
        nameCn: "",
        shortCode: "",
        imoNo: ""
      }, //查询参数
      flag: false,
      form: {
        nameCn: "",
        shortCode: "",
        callNo: "",
        captainPhone: "",
        shipCompany: "",
        shipCompanyCode: "",
        shipOwner: "",
        shipOwnerCode: "",
        netTon: 0,
        weightTon: 0,
        deadWeight: null,
        totalTon: null,
        buildDate: new Date(),
        shipNationCode: null,
        hatchNo: null,
        cabinNum: null,
        shipLength: "1.00",
        shipHeight: "1.00",
        shipWidth: "1.00",
        topSpeed: null,
        shipSpeed: null,
        mouldedDepth: null,
        mouldedHeight: null,
        fullloadWater: null,
        unloadedDraft: null,
        delFlag: "0",
        remark: null
      },
      formLabelWidth: "120px", // form的item宽度
      drawer: false, // 新增修改
      relation: false, // 关联
      loading: false,
      tableData: [],
      colpo: false, // 基本信息
      colpopo: false, // 其他信息
      nowData: {},
      // 分页
      startpage: 1,
      totalNum: 1,
      pagesize: 10,
      currentPage: 1 // 当前页
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
    // 基本信息
    colpoFun() {
      this.colpo = !this.colpo;
      if (this.colpopo) {
        this.colpopo = false;
      }
    },
    // 其他信息
    colpopoFun() {
      this.colpopo = !this.colpopo;
      if (this.colpo) {
        this.colpo = false;
      }
    },
    // 驳船类型事件
    cusChange(value) {
      console.log(value);
    },
    // 查询数据table
    async getListData() {
      const that = this;
      if (this.queryInfo.shortCode || this.queryInfo.nameCn) {
        this.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/bargeInfo/queryall?pagesize=${this.pagesize}&startpage=${this.startpage}&shortCode=${this.queryInfo.shortCode}&nameCn=${this.queryInfo.nameCn}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          // buildDate
          this.tableData = res.data.data.pages;
          that.tableData.map(n => {
            n.buildDate =
              new Date(n.buildDate).toLocaleDateString().replace(/\//g, "-") +
              " " +
              new Date(n.buildDate).toTimeString().substr(0, 8);
          });
          // 分页
          this.startpage = res.data.data.pageNum;
          this.pagesize = res.data.data.pageSize;
          this.totalNum = parseInt(res.data.data.totalNum);
        } else {
          this.$message.warning(res.data.msg);
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    addUpdate() {
      // 传递的参数等待确认
      delete this.form.createBy;
      delete this.form.createName;
      delete this.form.createTime;
      delete this.form.updateBy;
      delete this.form.updateName;
      delete this.form.updateTime;
      delete this.form.delFlag;
      let that = this;
      that.form.buildDate = new Date(that.form.buildDate);
      // flag为真进行添加操作
      that.$refs["basisRulesRef"].validate(async valid => {
        if (valid) {
          if (that.flag) {
            delete this.form.id;
            const res = await that.$http.post(
              "/psys-master-service/api/external/bargeInfo/add",
              that.form
            );
            if (res.data.success) {
              if (that.drawer) {
                that.drawer = false;
              }
              that.$message.success(res.data.msg);
              that.getListData();
            } else {
              that.$message.warning(res.data.msg);
            }
          } else {
            // 进行修改操作elseRules
            that.form.buildDate = new Date(that.form.buildDate);
            const res = await that.$http.put(
              "/psys-master-service/api/external/bargeInfo/updatebyid",
              that.form
            );
            if (res.data.success) {
              if (that.drawer) {
                that.drawer = false;
              }
              that.$message.success(res.data.msg);
              that.getListData();
            } else {
              that.$message.warning(res.data.msg);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 修改
    handleEdit(index, row) {
      // this.form.id = row.id
      this.form = row;
      this.drawer = true;
      this.flag = false;
    },

    // 删除确认
    async subDelete(id) {
      const data = {
        id: id
      };
      if (id.length !== 0) {
        const res = await this.$http.delete(
          `/psys-master-service/api/external/bargeInfo/deletebyid?id=${id}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.startpage = 1;
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
    // 取消所有
    cancel() {
      if (this.editmod) {
        this.editmod = false;
      }
      if (this.drawer) {
        this.drawer = false;
      }
      if (this.relation) {
        this.relation = false;
      }
      this.$message("已取消！");
    },
    add() {
      this.flag = true;
      this.drawer = true;
      this.form = {
        nameCn: "",
        shortCode: "",
        callNo: "",
        captainPhone: "",
        shipCompany: "",
        shipCompanyCode: "",
        shipOwner: "",
        shipOwnerCode: "",
        netTon: "",
        weightTon: "",
        deadWeight: "",
        totalTon: "",
        buildDate: "",
        shipNationCode: "",
        hatchNo: null,
        cabinNum: null,
        shipLength: "0",
        shipHeight: "0",
        shipWidth: "",
        topSpeed: "",
        shipSpeed: "",
        mouldedDepth: "",
        mouldedHeight: "",
        fullloadWater: "",
        unloadedDraft: "",
        delFlag: null,
        remark: ""
      };
    },
    // 每页显示的条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getListData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.startpage = val;
      this.getListData();
    }
  }
};
</script>


<style lang="less" scoped>
/deep/ .el-select > .el-input {
  width: 100% !important;
}
/deep/ .el-textarea__inner {
  width: 90%;
}
.btn /deep/ .el-button--mini,
.el-button--mini.is-round {
  padding: 7px;
}
.leftbox /deep/ .el-input {
  width: 60% !important;
}
// .leftbox /deep/ .el-select {
//   width: 100% !important;
// }
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
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
.form-t /deep/ .el-form-item__content {
  margin-left: 1rem !important;
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
/deep/ .el-drawer__header {
  margin-bottom: 0;
  padding: 16px;
  border-bottom: 1px solid gainsboro;
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
/deep/ .el-form-item--mini .el-form-item__label {
  line-height: 0;
}
/deep/ .el-pagination {
  text-align: right;
  padding: 10px 5px;
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
/deep/ .el-button + .el-button {
  margin-left: 3px;
}
/deep/ .el-drawer__open .el-drawer.rtl {
  background: #f5f7fa;
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
.kehuguanxi /deep/ .el-drawer__open .el-drawer.rtl {
  width: 30% !important;
}

/deep/ .el-drawer__body {
  overflow-y: auto;
  padding-bottom: 50px;
}

.formt-itm {
  border-bottom: 1px solid gainsboro;
  margin-bottom: 4px;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
  letter-spacing: 0;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #303133;
  line-height: 40px;
  i {
    color: #909399;
  }
}
</style>