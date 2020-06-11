<template>
  <div class="box">
    <!-- 添加删除,操作 -->
    <div class="selectBox">
      <div class="btn">
        <!-- 新增按钮 -->
        <el-button icon="el-icon-plus" @click="addTechnology" size="mini"></el-button>
        <!-- 删除按钮 -->
        <!-- <el-button icon="el-icon-delete" @click="deleteTechnology(ids)" size="mini"></el-button> -->
      </div>
      <el-form ref="form" size="mini" :model="form" inline>
        <el-form-item label="名称">
          <el-input
            @input="operationProcessName=verifyfilter('char',operationProcessName)"
            @keyup.enter.native="getListData"
            v-model="operationProcessName"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 信息表格 -->
    <keep-alive>
      <el-table
        fit
        highlight-current-row
        :data="tableData"
        :default-sort="{prop: 'sortNum', order: 'descending'}"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
        <el-table-column prop="operationProcessName" label="操作工艺名称" width="130" sortable></el-table-column>
        <el-table-column prop="shortCode" label="速记码" sortable></el-table-column>
        <el-table-column prop="sortNum" label="排序" sortable></el-table-column>
        <!-- <el-table-column prop="createName" label="创建人" sortable></el-table-column> -->
        <!-- <el-table-column prop="createTime" label="创建时间" sortable></el-table-column> -->
        <el-table-column label="操作" align="center" width="450">
          <template slot-scope="scope">
            <!-- 关联机构 -->
            <el-button size="mini" @click="compMod(scope.row)">
              <i class="iconfont icon-liebiaotubiao_guanlianjigou" style="color:#E6A91F"></i>关联机构
            </el-button>
            <!-- 关联货种 -->
            <el-button size="mini" @click="SpeciesMod(scope.row)">
              <i class="iconfont icon-liebiaotubiao_guanlianhuozhong" style="color:#E6A91F"></i>关联货种
            </el-button>
            <!-- 关联过程 -->
            <el-button size="mini" @click="processMod(scope.row)">
              <i class="iconfont icon-liebiaotubiao_guanlianguocheng" style="color:#E6A91F"></i>关联过程
            </el-button>
            <!-- 编辑按钮 -->
            <el-button size="mini" @click="zEdit(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-popconfirm
              @onConfirm="deleteTechnology(scope.row.id)"
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
      <!-- 关联机构 -->
      <div class="kehuguanxi">
        <el-drawer :before-close="handleClose" :visible.sync="dr" direction="rtl">
          <div class="headerspan">
            <p v-cloak>{{companyName}}</p>
          </div>
          <div class="headerspan-item">关联机构</div>
          <div class="form-t">
            <el-form>
              <el-form-item :label-width="'120px'">
                <el-checkbox-group v-model="checkedComp" @change="compChange">
                  <el-checkbox
                    v-for="(city,index) in comp"
                    :label="city.companyName"
                    :key="index"
                  >{{city.companyName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="demo-drawer__footer">
            <el-button size @click="cancel()">取 消</el-button>
            <el-button
              size
              type="primary"
              @click="mprocesscomp()"
              :loading="loading"
            >{{ loading ? '提交中 ...' : '保 存' }}</el-button>
          </div>
        </el-drawer>
      </div>
      <div class="modelse">
        <!-- 关联货种 -->
        <el-drawer :before-close="handleClose" title="关联货种" :visible.sync="dra" :with-header="true">
          <opeSpecies :senSpecies="nowData"></opeSpecies>
        </el-drawer>
        <!-- 关联过程 -->
        <el-drawer
          :before-close="handleClose"
          title="关联过程"
          :visible.sync="draw"
          :with-header="true"
        >
          <opePros :senPros="nowData"></opePros>
        </el-drawer>
      </div>

      <!-- 添加 -->
      <el-drawer
        :before-close="handleClose"
        title="添加操作工艺"
        :visible.sync="drawer"
        :with-header="true"
      >
        <el-form ref="addForm" :rules="addFormRule" :model="form" label-width="100px">
          <el-form-item label="工艺名称" prop="operationProcessName">
            <el-input v-model="form.operationProcessName"></el-input>
          </el-form-item>
          <el-form-item label="速记码" prop="shortCode">
            <el-input v-model="form.shortCode"></el-input>
          </el-form-item>
          <!-- <el-form-item label="创建人">
            <el-input v-model="form.createName"></el-input>
          </el-form-item>-->
          <el-form-item label="排序">
            <el-input type="number" :min="0" v-model="form.sortNum"></el-input>
          </el-form-item>
          <div class="demo-drawer__footer">
            <el-button size @click="cancel()">取 消</el-button>
            <el-button size type="primary" @click="addTechnologyFun()">保 存</el-button>
          </div>
        </el-form>
      </el-drawer>
      <el-drawer
        :before-close="handleClose"
        title="修改操作工艺"
        :visible.sync="editdrawer"
        :with-header="true"
      >
        <el-form ref="form" :model="nowData" label-width="100px">
          <el-form-item label="工艺名称">
            <el-input v-model="nowData.operationProcessName"></el-input>
          </el-form-item>
          <el-form-item label="速记码">
            <el-input v-model="nowData.shortCode"></el-input>
          </el-form-item>
          <!-- <el-form-item label="创建人">
            <el-input v-model="nowData.createName"></el-input>
          </el-form-item>-->
          <el-form-item label="排序">
            <el-input type="number" :min="0" v-model="nowData.sortNum"></el-input>
          </el-form-item>
          <div class="demo-drawer__footer">
            <el-button size @click="cancel()">取 消</el-button>
            <el-button size type="primary" @click="zeditEdit()">保 存</el-button>
          </div>
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import opeSpecies from "./opeSpecies.vue";
import opeComp from "./opeComp.vue";
import opePros from "./opePros.vue";
export default {
  name: "TechnologyInfo",
  components: { opeSpecies, opeComp, opePros },
  data() {
    return {
      tableData: [],
      operationProcessName: "", // 查询名字
      form: {
        operationProcessName: "",
        shortCode: "",
        createName: "",
        sortNum: ""
      },
      checkedComp: ["欣海物流"],
      comp: [
        "欣海物流",
        "轮驳",
        "集装箱",
        "码头作业公司",
        "东港",
        "大港",
        "金港"
      ],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      // 新增抽屉显示
      drawer: false,
      // 修改弹出
      editdrawer: false,
      dr: false, // 关联机构
      dra: false, // 关联货种
      draw: false, // 关联过程
      labelPosition: "left",
      nowData: {}, // 临时存放操作数据
      loading: false,
      // 分页
      currentPage: 1,
      totalNum: 1,
      pagesize: 10,
      // 批量删除
      ids: [],
      arr: [],
      selectId: [],
      companyName: "",
      addFormRule: {
        operationProcessName: [
          { required: true, message: "请输入操作工艺名称", trigger: "blur" }
        ],
        shortCode: [
          { required: true, message: "请输入速记码", trigger: "blur" }
        ]
      }
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
    newArr(arr) {
      return Array.from(new Set(arr));
    },

    // 关联机构
    async compMod(info) {
      if (!this.dr) {
        this.dr = true;
      }
      this.nowData = info;
      const that = this;
      let data = [];
      let ids = new Array();
      const res = await this.$http.get(
        `/psys-master-service/api/external/moperationprocess/listcustomerbind?id=${info.id}`
      );
      if (res.data.success) {
        this.comp = res.data.data.bindList;
        this.companyName = res.data.data.companyName;
        if (that.comp.length !== 0) {
          for (const n of that.comp) {
            // 如果绑定
            if (n.bind) {
              data.push(n.companyName);
              ids.push(n.id);
            }
          }
          this.checkedComp = this.newArr(data);
          this.selectId = this.newArr(ids);
        }
      } else {
        that.$message.warning(res.data.msg);
      }
    },
    // 下属机构改变
    compChange(v) {
      if (v.length !== 0) {
        this.checkedComp = v;
        this.arr = this.comp.filter(n =>
          this.checkedComp.includes(n.companyName)
        );
        this.arr.forEach(i => {
          i.bind = true;
        });
      }
    },
    // 绑定操作工艺
    async mprocesscomp() {
      const that = this;
      let trueId = new Set();
      this.comp = this.arr;
      if (that.checkedComp.length !== 0) {
        trueId = that.comp.filter(n => n.bind).map(n => n.id);
        if (trueId.length !== 0) {
          that.selectId = trueId;
        }
        if (that.selectId.length !== 0) {
          const data = {
            compId: that.selectId,
            operationProcessId: that.nowData.id
          };
          const res = await that.$http.post(
            "/psys-master-service/api/external/mprocesscomp/add",
            data
          );
          if (res.data.success) {
            if (that.dr) {
              that.dr = false;
            }
            that.$message.success(res.data.msg);
            that.getListData();
          } else {
            that.$message.warning(res.data.msg);
          }
        }
      } else {
        that.selectId = [];
        const data = {
          compId: that.selectId,
          operationProcessId: that.nowData.id
        };
        const res = await that.$http.post(
          "/psys-master-service/api/external/mprocesscomp/add",
          data
        );
        if (res.data.success) {
          if (that.dr) {
            that.dr = false;
          }
          that.$message.success(res.data.msg);
          that.getListData();
        } else {
          that.$message.warning(res.data.msg);
        }
      }
    },
    // 关联货种
    SpeciesMod(info) {
      if (!this.dra) {
        this.dra = true;
      }
      this.nowData = info;
    },
    // 关联过程
    processMod(info) {
      if (!this.draw) {
        this.draw = true;
      }
      this.nowData = info;
    },

    // 选择
    handleSelectionChange(val) {
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
    // 添加Technology的按钮
    addTechnology() {
      if (!this.drawer) {
        this.drawer = true;
      }
      this.form = {
        operationProcessName: "",
        shortCode: "",
        createName: "",
        sortNum: ""
      };
      // this.form = []
    },
    // 新增操作工艺/psys-master-service/api/external/Technology/addOne
    async addTechnologyFun() {
      const data = {
        operationProcessName: this.form.operationProcessName,
        shortCode: this.form.shortCode,
        createName: this.form.createName,
        sortNum: this.form.sortNum
      };
      const that = this;
      that.$refs["addForm"].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            `/psys-master-service/api/external/moperationprocess/add`,
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
    // 查询数据table moperationprocess/queryall?startpage=1&pagesize=10
    async getListData() {
      const that = this;
      if (that.operationProcessName) {
        this.queryall.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/moperationprocess/queryall?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}&operationProcessName=${that.operationProcessName}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
          that.tableData.map(n => {
            n.createTime = new Date(n.createTime)
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
    // 删除Technology的函数
    async deleteTechnology(id) {
      if (id) {
        const param = { ids: id };
        const res = await this.$http.delete(
          `/psys-master-service/api/external/moperationprocess/deletebyid?id=${id}`
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
        this.$message.error("请先选择删除数据");
      }
    },
    // 修改操作工艺弹出
    zEdit(index, row) {
      this.nowData = row;
      // console.log(this.nowData);
      if (!this.editdrawer) {
        this.editdrawer = true;
      }
    },
    // 修改操作工艺PUT /api/psys-master-service/api/external/Technology/updateOne
    async zeditEdit() {
      var that = this;
      const data = {
        id: that.nowData.id,
        operationProcessName: that.nowData.operationProcessName,
        shortCode: that.nowData.shortCode,
        sortNum: that.nowData.sortNum
      };
      // console.log(data)
      const res = await that.$http.put(
        `/psys-master-service/api/external/moperationprocess/updatebyid`,
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
      if (this.dr) {
        this.dr = false;
      }
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
:focus {
  outline: 0;
}
/deep/ .el-drawer__header {
  padding: 7px 16px;
  border-bottom: 1px solid gainsboro;
  margin-bottom: 6px;
  display: block;
}
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  padding: 5px 1rem;
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
  padding: 3px 0;
}
/deep/ .el-table th:nth-child(1) {
  border-left: none;
}
.kehuguanxi /deep/ .el-drawer__open .el-drawer.rtl {
  width: 30% !important;
  background: #f5f7fa;
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
/deep/ .el-table {
  max-height: 700px;
}
.selectBox {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-left: none;
  line-height: 28px;
  height: 34px;
  padding-top: 5px;
  padding-left: 14px;
  padding-right: 20px;
}
.el-button {
  padding: 7px !important;
  margin-left: 0px !important;
}
.el-form {
  // margin-left: 50px;
  margin-right: 25px;
}
.el-form-item__label {
  width: 200px !important;
}
.modelse /deep/ .el-drawer__open .el-drawer.rtl {
  width: 50% !important;
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
[v-cloak] {
  display: none;
}
</style>


