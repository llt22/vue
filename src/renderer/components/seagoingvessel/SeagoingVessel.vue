<template>
  <div class="box">
    <div class="selectBox">
      <el-form ref="form" size="mini" :model="form" inline>
        <el-form-item label="拖轮名称">
          <el-input @input="queryInfo.nameCn=verifyfilter('char',queryInfo.nameCn)" @keyup.enter.native="getListData" v-model="queryInfo.nameCn"></el-input>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select
            filterable
            @keyup.enter.native="getListData"
            clearable
            v-model="queryInfo.compName"
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
        <el-form-item style="float:right;">
          <div class="btn">
            <el-button size="mini" plain icon="el-icon-plus" @click="add()"></el-button>
            <!-- <el-button size="mini" plain icon="el-icon-delete" @click="subDelete(ids)"></el-button> -->
          </div>
        </el-form-item>
      </el-form>
    </div>
    <keep-alive>
    <el-table
    highlight-current-row
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'sortNum', order: 'descending'}"
      stripe
      :data="tableData"
      style="width: 100%"
    >
      <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
      <el-table-column prop="nameCn" label="拖轮名称" width></el-table-column>
      <el-table-column prop="speed" label="马力" width sortable></el-table-column>
      <el-table-column prop="linkmanName" label="联系人"></el-table-column>
      <el-table-column prop="compName" label="所属公司"></el-table-column>
      <el-table-column prop="sortNum" label="拖轮排序" sortable></el-table-column>
      <el-table-column label="操作" align="center" width="250">
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
        :title="flag?'新增拖轮信息':'编辑拖轮信息'"
        :visible.sync="drawer"
        direction="rtl"
      >
        <el-form status-icon :rules="basisRules" ref="basisRulesRef" size="small" :model="form">
          <div class="form-t">
            <el-form-item label="拖轮名称" prop="nameCn" :label-width="formLabelWidth">
              <el-input @input="form.nameCn=verifyfilter('char',form.nameCn)" v-model="form.nameCn" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="马力" prop="speed" :label-width="formLabelWidth">
              <el-input
                @input="form.speed=verifyfilter('digit',form.speed)"
                v-model="form.speed"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属公司" prop="compCode" :label-width="formLabelWidth">
              <el-select filterable clearable v-model="form.compCode" style="width:100%" placeholder="所属公司">
                <el-option
                  v-for="item in compData"
                  :key="item.companyCode"
                  :label="item.companyName"
                  :value="item.companyCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人" prop="linkmanName" :label-width="formLabelWidth">
              <el-input @input="form.linkmanName=verifyfilter('char',form.linkmanName)" type v-model="form.linkmanName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拖轮排序" prop="sortNum" :label-width="formLabelWidth">
              <el-input @input="form.sortNum=verifyfilter('digit',form.sortNum)" v-model.number="form.sortNum" autocomplete="off"></el-input>
            </el-form-item>
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
import { rules } from "../../plugins/formRules";
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

        speed: [
          {
            trigger: "blur",
            message: "马力不能为空",
            required: true
          },
        ],
        compCode: [
          { required: true, message: "公司不能为空", trigger: "blur" }
        ],
        linkmanName: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        sortNum: [
          {
            trigger: "blur",
            message: "排序不能为空",
            required: true
          },
        ]
      },
      compData: [],
      queryInfo: {
        nameCn: "",
        compName: ""
      }, //查询参数
      flag: false,
      form: {
        nameCn: "",
        delFlag: "",
        speed: null,
        linkmanName: "",
        compCode: ""
      },
      formLabelWidth: "120px", // form的item宽度
      drawer: false, // 新增修改
      relation: false, // 关联
      loading: false,
      tableData: [],
      nowData: {},
      ids: [], // 批量删除

      // 分页
      startpage: 1,
      totalNum: 1,
      pagesize: 10,
      currentPage: 1 // 当前页
    };
  },
  mounted() {
    this.getListData();
    this.getCompData();
  },
  watch: {
    form: function(val) {
      // let ret = new RegExp(/^[1-9]\d*$/);
      // let flas = ret.test(val.speed);
      // if (!flas) {
      //   this.$message.warning("请输入正确的马力");
      // } else {
      //   this.form.speed = val.speed;
      // }
    }
  },
  methods: {
    filterStr(str) {
      var pattern = /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
      return str.replace(pattern, "");
    },
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
      const res = await this.$http.get(`/psys-master-service/api/external/public/listcompany`);
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
    // 拖轮类型事件
    cusChange(value) {
      console.log(value);
    },
    // 查询数据table
    async getListData() {
      const that = this;
      if (this.queryInfo.nameCn || this.queryInfo.compName) {
        this.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/tugboat/queryall?pagesize=${this.pagesize}&startpage=${this.startpage}&nameCn=${this.queryInfo.nameCn}&compCode=${this.queryInfo.compName}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
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
      delete this.form.buildDate;
      // flag为真进行添加操作
      that.$refs["basisRulesRef"].validate(async valid => {
        if (valid) {
          if (that.flag) {
            delete this.form.id;
            const res = await that.$http.post(
              "/psys-master-service/api/external/tugboat/add",
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
            delete this.form.buildDate;
            const res = await that.$http.put(
              "/psys-master-service/api/external/tugboat/updatebyid",
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
      this.form.buildDate = new Date(this.form.buildDate); // 时间date格式
    },

    // 删除确认
    async subDelete(id) {
      const data = {
        id: id
      };
      if (id.length !== 0) {
        const res = await this.$http.delete(
          `/psys-master-service/api/external/tugboat/deletebyid?id=${id}`
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
      this.form = {};
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
  display: flex;
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
.btn /deep/ .el-button--mini,
.el-button--mini.is-round {
  padding: 7px;
}
/deep/.el-pagination.is-background .btn-next,
/deep/ .el-pagination.is-background .btn-prev,
/deep/ .el-pagination.is-background .el-pager li {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-radius: 3px;
  border-radius: 3px;
}

/deep/ .el-drawer__open .el-drawer.rtl {
  background: #f5f7fa;
}
/deep/ .el-button + .el-button {
  margin-left: 3px;
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