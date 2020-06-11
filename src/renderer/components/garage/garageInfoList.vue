<template>
  <div class="box">
    <!-- 查询 -->
    <div class="selectBox">
      <el-form size="mini" :model="form" inline>
        <el-form-item label="泊位名称">
          <el-input
          @input="form.berthName=verifyfilter('char',form.berthName)"
            @keyup.enter.native="getBerthInfoList"
            placeholder="请输入泊位名称"
            v-model="form.berthName"
          ></el-input>
        </el-form-item>
        <el-form-item label="作业港区">
          <el-select
            filterable
            @keyup.enter.native="getBerthInfoList"
            clearable
            v-model="form.companyCode"
            placeholder="请选择作业港区"
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
          <!-- 查询按钮 -->
          <el-button type="primary" icon="el-icon-search" @click="getBerthInfoList">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button plain icon="el-icon-plus" @click="addInfo()"></el-button>
          <!-- <el-button plain icon="el-icon-delete" @click="handleDelete(ids)"></el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 缆桩弹出 -->
    <div class="lanzhuang">
      <el-drawer
        :before-close="handleCloseBefore"
        :with-header="true"
        :title="'缆桩列表'"
        :visible.sync="exl"
        width="50%"
      >
        <bittInfoList :senData="nowData"></bittInfoList>
      </el-drawer>
    </div>

    <!-- 泊位数据列表 -->
    <keep-alive>
      <el-table
      highlight-current-row
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <!-- <el-table-column align="center" type="selection" width="55" fixed></el-table-column> -->
        <el-table-column prop="berthCode" label="泊位编号" width></el-table-column>
        <el-table-column prop="berthName" label="泊位名称" width="120"></el-table-column>
        <el-table-column prop="shortCode" label="速记码" width="120"></el-table-column>
        <el-table-column prop="berthLength" label="泊位长度" width></el-table-column>
        <el-table-column prop="berthDeepth" label="泊位水深" width></el-table-column>
        <el-table-column label="泊位等级" width>
          <template slot-scope="scope">
            {{getBerthLeve(scope.row.berthLevelCode)}}
          </template>
        </el-table-column>
        <el-table-column prop="berthStruct" label="泊位结构" width></el-table-column>
        <el-table-column prop="companyName" label="所属单位" width="120"></el-table-column>
        <el-table-column label="泊位性质" width>
          <template slot-scope="scope">
            {{getBerthNature(scope.row.berthNature)}}
          </template>
        </el-table-column>
        <el-table-column prop="bittInterval" label="缆桩间隔" width></el-table-column>
        <el-table-column prop="designDeep" label="设计水深" width></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="excelFun(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiao" style="color:rgb(130, 49, 142)"></i>缆桩列表
            </el-button>
            <!-- 编辑按钮 -->
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button size="mini" @click="handleDelete(scope.row.id)">
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

      <!-- 新增泊位信息的弹出框 -->
      <el-drawer
        :title="flag?'新增泊位信息':'编辑泊位信息'"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="handleClose"
        :before-close="handleCloseBefore"
      >
        <!-- 新增人员的form表单 -->
        <el-form size ref="addForm" :model="addForm" :rules="addFormRule" label-width="80px">
          <div class="form-t">
            <el-form-item label="泊位编号" prop="berthCode">
              <el-input @input="addForm.berthCode=verifyfilter('chareBO',addForm.berthCode)" v-model="addForm.berthCode"></el-input>
            </el-form-item>
            <el-form-item label="泊位名称" prop="berthName">
              <el-input @input="addForm.berthName=verifyfilter('chareBO',addForm.berthName)" v-model="addForm.berthName"></el-input>
            </el-form-item>
            <el-form-item label="速记码" prop="shortCode">
              <el-input @input="addForm.shortCode=verifyfilter('latin',addForm.shortCode)" v-model="addForm.shortCode"></el-input>
            </el-form-item>
            <el-form-item label="泊位长度" prop="berthLength">
              <el-input @input="addForm.berthLength=verifyfilter('digit',addForm.berthLength)"  v-model="addForm.berthLength"></el-input>
            </el-form-item>
            <el-form-item label="泊位水深" prop="berthDeepth">
              <el-input @input="addForm.berthDeepth=verifyfilter('digit',addForm.berthDeepth)"  v-model="addForm.berthDeepth"></el-input>
            </el-form-item>
            <el-form-item label="泊位结构" prop="berthStruct">
              <el-input @input="addForm.berthStruct=verifyfilter('char',addForm.berthStruct)" v-model="addForm.berthStruct"></el-input>
            </el-form-item>
            <el-form-item label="泊位等级" prop="berthLevelCode">
              <el-select
                      clearable
                      v-model="addForm.berthLevelCode"
                      placeholder="泊位等级">
                <el-option
                        v-for="item in berthLevels"
                        :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属单位" prop="companyCode">
              <!-- <el-input v-model="addForm.companyCode"></el-input> -->
              <el-select
                @change="selectCompId"
                clearable
                v-model="addForm.companyCode"
                placeholder="所属单位"
              >
                <el-option
                  v-for="item in compData"
                  :key="item.companyCode"
                  :label="item.companyName"
                  :value="item.companyCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="泊位性质" prop="berthNature">
              <el-select
                      clearable
                      v-model="addForm.berthNature"
                      placeholder="泊位性质">
                <el-option
                        v-for="item in berthNatures"
                        :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缆桩间隔" prop="bittInterval">
              <el-input @input="addForm.bittInterval=verifyfilter('digit',addForm.bittInterval)"  v-model="addForm.bittInterval"></el-input>
            </el-form-item>
            <el-form-item label="设计水深" prop="designDeep">
              <el-input @input="addForm.designDeep=verifyfilter('digit',addForm.designDeep)"  v-model="addForm.designDeep"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="demo-drawer__footer">
          <!-- 取消 -->
          <el-button size @click="addDialogVisible = false">取 消</el-button>
          <!-- 确认 -->
          <el-button size type="primary" @click="addBerth">保 存</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import bittInfoList from "./bittInfoList.vue";
export default {
  name: "garageInfoList",
  components: { bittInfoList },
  data() {
    return {
      form: {
        // 泊位编号
        id: "",
        berthName: "",
        companyCode: ""
      },
      berthLevels:[],//泊位等级集合取字典值
      berthNatures:[],//泊位性质集合取字典值
      tableData: [],
      // 查询
      queryall: {
        startpage: 1,
        pagesize: 10
      },

      exl: false, // 缆桩表格弹出
      // 分页
      totalNum: 1,
      // 当前页码
      currentPage: 2,
      // 对话框隐藏
      addDialogVisible: false,
      ids: [], // 批量删除
      // 通过flag控制进行添加操作还是修改操作,为true的时候进行的是添加操作
      flag: true,
      nowData: {},
      compData: [],
      // 新增泊位
      addForm: {
        companyId: "1",
        // 泊位编号
        berthCode: "",
        // 泊位名称
        berthName: "",
        compId: "",
        // 速记码
        shortCode: "11111",
        // 长度
        berthLength: 666,
        // 水深
        berthDeepth: 777,
        // berthLevelCode
        berthLevelCode: "aaaa",
        berthStruct: "",
        companyId: 111,
        companyCode: "镇江港务",
        berthNature: "aaa",
        bittInterval: "",
        designDeep: ""
      },
      // form表单校验
      addFormRule: {
        companyCode: [
          { required: true, message: "请输入所属公司", trigger: "blur" }
        ],
        berthCode: [
          { required: true, message: "请输入泊位编号", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        berthName: [
          { required: true, message: "请输入泊位名称", trigger: "blur" }
        ],
        shortCode: [
          { required: true, message: "请输入速记码", trigger: "blur" }
        ],
        berthLength: [
          { required: true, message: "请输入泊位长度", trigger: "blur" }
        ],
        berthDeepth: [
          { required: true, message: "请输入泊位水深", trigger: "blur" }
        ],
        berthLevelCode: [
          { required: true, message: "请输入泊位等级", trigger: "blur" }
        ],
        berthLevelCode: [
          { required: true, message: "请输入单位机构代码", trigger: "blur" }
        ],
        berthNature: [
          { required: true, message: "请输入泊位性质", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCompData();
    this.getBerthBaseData();
  },
  methods: {
    getBerthLeve(oppType){
      var opps = this.berthLevels.filter(i=> i.dictValue == oppType);
      if(opps!=undefined && opps.length>0){
        return  opps[0].dictLabel;
      }else
        return '';
    },
    getBerthNature(oppType){
      var opps = this.berthNatures.filter(i=> i.dictValue == oppType);
      if(opps!=undefined && opps.length>0){
        return  opps[0].dictLabel;
      }else
        return '';
    },
    selectCompId() {
      this.compData.forEach(n => {
        if (this.addForm.companyCode === n.companyCode) {
          this.compId = n.id;
        }
      });
    },
    handleCloseBefore(done) {
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
      if (array) {
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }
      }
      return temp;
    },
    // 点击按钮,增加list
    addInfo() {
      this.addDialogVisible = true;
      this.flag = true;
      // 测试数据
      this.addForm = {};
    },
    // 打开列表
    excelFun(index, info) {
      this.exl = true;
      this.nowData = info;
    },
    // 点击按钮，修改信息
    handleEdit(index, info) {
      // DialogVisible显示
      this.addDialogVisible = true;
      this.flag = false;
      this.addForm = info;
      this.compId = info.companyId;
    },
    // 点击按钮,删除列表项
    // 删除作业过程
    handleDelete(id) {
      let that = this;
      if (id.length !== 0) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            // 根据id进行删除
            const res = await this.$http.delete(
              `/psys-master-service/api/external/mberth/deletebyid?id=${id}`
            );
            // 如果删除成功
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.queryall.startpage = 1;
              // 重新获取tabelDate
              this.getBerthInfoList();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的数据"
        });
      }
    },
    // 每页显示的条数
    handleSizeChange(val) {
      this.queryall.pagesize = val;
      this.getBerthInfoList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryall.startpage = val;
      this.getBerthInfoList();
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
    // 添加泊位的函数
    addBerth() {
      delete this.addForm.createBy;
      delete this.addForm.createName;
      delete this.addForm.createTime;
      delete this.addForm.updateBy;
      delete this.addForm.updateName;
      delete this.addForm.updateTime;
      delete this.addForm.delFlag;
      delete this.addForm.companyName;
      const that = this;
      this.addForm.companyId = this.compId;
      this.$refs["addForm"].validate(async valid => {
        if (valid) {
          if (this.flag) {
            // 新增
            // 应该是必填字段的问题(请注意)
            const res = await this.$http.post(
              "/psys-master-service/api/external/mberth/add",
              that.addForm
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              that.getBerthInfoList();
            } else {
              that.$message.warning(res.data.msg);
            }
          } else {
            // 编辑
            const res = await this.$http.put(
              "/psys-master-service/api/external/mberth/updatebyid",
              that.addForm
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              that.getBerthInfoList();
            } else {
              that.$message.warning(res.data.msg);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 获取信息
    async getBerthInfoList() {
      const that = this;
      if (this.form.companyCode || this.form.berthName) {
        this.queryall.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/mberth/queryall?startpage=${that.queryall.startpage}&pagesize=${that.queryall.pagesize}&companyCode=${that.form.companyCode}&berthName=${that.form.berthName}`
      );
      // this.tableData = res.data.data;
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
          // 分页
          this.queryall.startpage = res.data.data.pageNum;
          this.totalNum = res.data.data.totalNum;
        } else {
          this.$message.warning(res.data.msg);
        }
      }
    }
    ,
    //获取泊位性质、泊位等级基础信息 从字典值取
    getBerthBaseData(){
      //泊位性质
      this.$http
        .get(`/psys-master-service/api/external/public/listdict?dicttype=BERTH_NATURE`)
        .then(res => {
          if (res.data.success) {
            this.berthNatures = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      //泊位等级
      this.$http
          .get(`/psys-master-service/api/external/public/listdict?dicttype=BERTH_LEVEL`)
          .then(res => {
            if (res.data.success) {
              this.berthLevels = res.data.data;
              this.getBerthInfoList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
    }
  }
};
</script>

<style lang="less" scoped>
.lanzhuang /deep/ .el-drawer__open .el-drawer.rtl {
  width: 50% !important;
}
.form-t {
  margin-bottom: 50px;
  padding: 0 1rem;
}
.form-t /deep/ .el-form-item__content {
  margin-left: 1rem !important;
  width: 60%;
}
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
/deep/ .el-form-item {
  display: flex;
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
  border-bottom: 1px solid #e1e4eb;
  border-top: none !important;
  border-radius: 4px 4px 0 0;
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
/deep/ .el-drawer__header {
  margin-bottom: 0;
  padding: 8px 16px;
  border-bottom: 1px solid gainsboro;
}
/deep/ .el-drawer__body {
  overflow-y: auto;
}
/deep/ .el-table .el-button:focus,
.el-button:hover {
  background-color: #fff;
  color: #338ce8;
  border: 1px solid #e1e4eb;
}
/deep/ .v-modal {
  z-index: 200 !important;
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

/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 20px 0;
}
.selectBox {
  /deep/ .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 6px;
  }
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-left: none;
  line-height: 28px;
  height: 39px;
  padding-top: 11px;
  padding-left: 14px;
  padding-right: 12px;
}
/deep/ .el-button + .el-button {
  margin-left: 3px;
}
</style>
