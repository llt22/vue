<template>
  <div class="box">
    <div class="selectBox">
      <div class="asa">
        <span style="width:1rem"></span>
        <el-button size="mini" plain icon="el-icon-plus" @click="leixingAddModel()"></el-button>
        <!-- <el-button size="mini" plain icon="el-icon-delete" @click="subDelete(ids)"></el-button> -->
      </div>
      <div>
        <el-form ref="paramform" size="mini" :model="form" inline>
          <el-form-item label="字典名称">
            <el-input @input="paramform.dictName=verifyfilter('char',paramform.dictName)" @keyup.enter.native="getData" v-model="paramform.dictName"></el-input>
          </el-form-item>
          <el-form-item label="字典类型">
            <el-input @input="paramform.dictType=verifyfilter('char',paramform.dictType)" @keyup.enter.native="getData" v-model="paramform.dictType"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData()" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 字典类型列表 -->
    <el-table
    highlight-current-row
      @selection-change="handleSelectionChange"
      stripe
      :data="tableData"
      style="width: 100%"
    >
      <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
      <el-table-column prop="dictName" label="字典名称" width></el-table-column>
      <el-table-column prop="dictType" label="字典类型" width></el-table-column>
      <el-table-column prop="delFlag" label="状态" width>
        <template slot-scope="scope">
          <el-tag size="mini" type="success" v-if="scope.row.delFlag == '0'">使用中</el-tag>
          <el-tag size="mini" type="warning" v-if="scope.row.delFlag == '1'">停用</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createTime" label="创建时间" width></el-table-column> -->
      <el-table-column label="操作" align="center" width="270">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
          </el-button>
          <el-button size="mini" @click="excelFun(scope.$index, scope.row)">
            <i class="iconfont icon-liebiaotubiao_liebiao" style="color:rgb(130, 49, 142)"></i>列表
          </el-button>
          <el-popconfirm @onConfirm="subDelete(scope.row.id)" @onCancel="cancel" title="您确定删除吗？">
            <el-button size="mini" type slot="reference">
              <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 新增字典类型 -->
    <el-drawer
      :before-close="handleClose"
      title="新增字典类型"
      :visible.sync="addleixingMod"
      direction="rtl"
    >
      <el-form ref="addTypeData" size="small" :model="form">
        <el-form-item
          prop="dictName"
          :rules="[
            { required: true, message: '字典名称不能为空'},
          ]"
          label="字典名称"
          :label-width="formLabelWidth"
        >
          <el-input @input="form.dictName=verifyfilter('char',form.dictName)" v-model="form.dictName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="dictType"
          :rules="[
            { required: true, message: '字典类型不能为空'},
          ]"
          label="字典类型"
          :label-width="formLabelWidth"
        >
          <el-input @input="form.dictType=verifyfilter('char',form.dictType)" v-model="form.dictType" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="addList()">保 存</el-button>
      </div>
    </el-drawer>
    <!-- 新增字典配置 -->
    <template>
      <div>
        <el-drawer
          :before-close="handleClose"
          title="新增字典"
          :visible.sync="addzidian"
          direction="rtl"
        >
          <el-form ref="addForm" :rules="addFormRule" size="small" :model="formList">
            <el-form-item label="字典标签" prop="dictLabel" :label-width="formLabelWidth">
              <el-input @input="formList.dictLabel=verifyfilter('char',formList.dictLabel)" v-model="formList.dictLabel" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="字典键值" prop="dictValue" :label-width="formLabelWidth">
              <el-input @input="formList.dictValue=verifyfilter('char',formList.dictValue)" v-model="formList.dictValue" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="字典类型" prop="dictType" :label-width="formLabelWidth">
              <el-input disabled v-model="formList.dictType" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              type="number"
              :min="0"
              prop="sortNum"
              label="字典排序"
              :label-width="formLabelWidth"
            >
              <el-input @input="formList.sortNum=verifyfilter('digit',formList.sortNum)" v-model="formList.sortNum"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input @input="formList.remark=verifyfilter('char',formList.remark)" type="textarea" v-model="formList.remark"></el-input>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button size="small" @click="cancel()">取 消</el-button>
            <el-button size="small" type="primary" @click="addZidian()">保 存</el-button>
          </div>
        </el-drawer>
      </div>
    </template>
    <!-- 字典列表 -->
    <template>
      <div class="excelBox">
        <el-drawer :before-close="handleClose" title="字典列表" :visible.sync="exlc" direction="rtl">
          <div style="padding: 0 1rem;border-bottom: 1px solid gainsboro;">
            <div style="display:flex;justify-content: space-between;">
              <el-form @submit.native.prevent ref="form" size="mini" :model="ParamformList" inline>
                <el-form-item label="字典标签">
                  <el-input @input="ParamformList.dictLabel=verifyfilter('char',ParamformList.dictLabel)" @keyup.enter.native="getListData" v-model="ParamformList.dictLabel"></el-input>
                </el-form-item>
                <el-form-item>
                  <div class>
                    <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
                  </div>
                </el-form-item>
                <div style="height:6px"></div>
              </el-form>
              <div class="asa">
                <el-button size="mini" type icon="el-icon-plus" @click="zidianAddModel()"></el-button>
              </div>
            </div>
          </div>
          <el-table max-height="620" highlight-current-row stripe :data="tableDataList" style="width: 100%">
            <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
            <el-table-column prop="dictLabel" label="字典标签" width="120"></el-table-column>
            <el-table-column prop="dictValue" label="字典键值" width></el-table-column>
            <el-table-column prop="delFlag" label="状态" width>
              <template slot-scope="scope">
                <el-tag size="mini" type="success" v-if="scope.row.delFlag == '0'">使用中</el-tag>
                <el-tag size="mini" type="warning" v-if="scope.row.delFlag == '1'">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dictType" label="字典类型" width="120"></el-table-column>
            <el-table-column prop="sortNum" type="number" :min="0" label="字典排序"></el-table-column>
            <!-- <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column> -->
            <el-table-column prop="remark" label="备注" width="150"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="200">
              <template slot-scope="scoper">
                <el-button size="mini" @click="zEdit(scoper.$index, scoper.row)">
                  <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
                </el-button>
                <el-popconfirm
                  @onConfirm="deleteZidian(scoper.row.id)"
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
          <div class="page">
            <el-pagination
              background
              @size-change="handleSizeCha"
              @current-change="handleCurrentCha"
              :current-page="startpage1"
              :page-sizes="[5, 10, 15, 20,25,30]"
              :page-size="pagesize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum1"
            ></el-pagination>
          </div>
        </el-drawer>
      </div>
    </template>
    <!-- 编辑字典类型 -->
    <el-drawer :before-close="handleClose" title="修改字典类型" :visible.sync="editleixMod">
      <el-form ref="editTypeData" size="small" :model="nowData">
        <el-form-item
          prop="dictName"
          :rules="[
            { required: true, message: '字典名称不能为空'},
          ]"
          label="字典名称"
          :label-width="formLabelWidth"
        >
          <el-input @input="nowData.dictName=verifyfilter('char',nowData.dictName)" v-model="nowData.dictName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="dictType"
          :rules="[
            { required: true, message: '字典类型不能为空'},
          ]"
          label="字典类型"
          :label-width="formLabelWidth"
        >
          <el-input @input="nowData.dictType=verifyfilter('char',nowData.dictType)" v-model="nowData.dictType" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="editTypeList()">保 存</el-button>
      </div>
    </el-drawer>
    <!-- 编辑字典 -->
    <el-drawer :before-close="handleClose" title="编辑字典" :visible.sync="editzidian">
      <el-form :rules="editFormRule" ref="editDataRef" size="small" :model="nowData">
        <el-form-item label="字典标签" prop="dictLabel" :label-width="formLabelWidth">
          <el-input @input="nowData.dictLabel=verifyfilter('char',nowData.dictLabel)" v-model="nowData.dictLabel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue" :label-width="formLabelWidth">
          <el-input @input="nowData.dictValue=verifyfilter('char',nowData.dictValue)" v-model="nowData.dictValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType" :label-width="formLabelWidth">
          <el-input disabled v-model="nowData.dictType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典排序" prop="sortNum" :label-width="formLabelWidth">
          <el-input @input="nowData.sortNum=verifyfilter('digit',nowData.sortNum)"  v-model="nowData.sortNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input @input="nowData.remark=verifyfilter('char',nowData.remark)" type="textarea" v-model="nowData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="zeditTypeList()">保 存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Dictionaries",
  data() {
    return {
      paramform: {
        dictName: "",
        dictType: "",
        remark: "",
        delFlag: ""
      }, // 查询类型
      ParamformList: {
        dictLabel: "",
        dictValue: "",
        sortNum: 1,
        dictType: "",
        remark: "",
        delFlag: "0"
      }, // 查询字典
      form: {
        dictName: "",
        dictType: "",
        remark: "",
        delFlag: ""
      }, // 字典类型form
      formList: {
        dictLabel: "",
        dictValue: "",
        sortNum: 1,
        dictType: "",
        remark: "",
        delFlag: "0"
      }, // 字典列表form
      startpage: 1,
      startpage1: 1,
      ids: [], // 批量删除
      formLabelWidth: "120px", // form的item宽度
      editleixMod: false, // 修改弹出字典标签框
      addleixingMod: false, // 新增字典标签框
      exlc: false, // 列表字典框
      addzidian: false, // 新增字典框
      editzidian: false, // 修改字典框
      tableData: [], // 字典类型配置
      tableDataList: [], // 字典配置
      nowData: {}, // 临时存放操作数据
      addFormRule: {
        dictLabel: [
          { required: true, message: "请输入字典标签", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "请输入字典键值", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "请输入字典类型", trigger: "blur" }
        ],
        sortNum: [
          { required: true, message: "请输入字典排序", trigger: "blur" }
        ]
      },
      editFormRule: {
        dictLabel: [
          { required: true, message: "请输入字典标签", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "请输入字典键值", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "请输入字典类型", trigger: "blur" }
        ],
        sortNum: [
          { required: true, message: "请输入字典排序", trigger: "blur" }
        ]
      },
      // 分页
      currentPage: 1,
      totalNum: 1,
      totalNum1: 1, //总条数
      pagesize: 10,
      pagesize1: 10,
      dicttype: "",
      // 批量删除
      ids: []
    };
  },
  mounted() {
    this.getData();
    this.getParams();
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async getParams() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=${this.dicttype}`
      );
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
    // 修改字典类型弹出
    handleEdit(index, row) {
      this.nowData = row;
      if (!this.editleixMod) {
        this.editleixMod = true;
      }
    },
    // 修改字典类型PUT /api/psys-master-service/api/external/dicttype/updateById
    async editTypeList() {
      this.form.dictName = this.nowData.dictName;
      this.form.dictType = this.nowData.dictType;
      this.form.remark = this.nowData.remark;
      this.form.id = this.nowData.id;
      // editTypeData
      this.$refs["editTypeData"].validate(async valid => {
        if (valid) {
          const res = await this.$http.put(
            `/psys-master-service/api/external/dicttype/update`,
            this.form
          );
          if (res.status == 200) {
            if (res.data.success) {
              if (this.editleixMod) {
                this.editleixMod = false;
              }
              this.$message.success(res.data.msg);
              this.getData();
            } else {
              this.$message.warning(res.data.msg);
            }
          } else {
            this.$message.error("获取数据失败！");
          }
        } else {
          return;
        }
      });
    },
    // 修改字典弹出
    zEdit(index, row) {
      this.nowData = row;
      if (!this.editzidian) {
        this.editzidian = true;
      }
    },
    // 修改字典PUT /api/psys-master-service/api/external/dictdata/updateById
    async zeditTypeList() {
      this.formList.dictLabel = this.nowData.dictLabel;
      this.formList.remark = this.nowData.remark;
      this.formList.sortNum = this.nowData.sortNum;
      this.formList.dictValue = this.nowData.dictValue;
      this.formList.dictType = this.nowData.dictType;
      this.formList.id = this.nowData.id;
      delete this.form.delFlag;
      const data = this.formList;
      this.$refs["editDataRef"].validate(async valid => {
        if (valid) {
          const res = await this.$http.put(`/psys-master-service/api/external/dictdata/update`, data);
          if (res.status == 200) {
            if (res.data.success) {
              if (this.editzidian) {
                this.editzidian = false;
              }
              this.$message.success(res.data.msg);
              this.getListData();
            } else {
              this.$message.warning(res.data.msg);
            }
          } else {
            this.$message.error("获取数据失败！");
          }
        } else {
          return;
        }
      });
    },
    // 字典列表弹出
    excelFun(index, row) {
      if (!this.exlc) {
        this.exlc = true;
      }
      this.nowData = row;
      this.getListData();
    },
    // 字典新增弹出框
    zidianAddModel() {
      if (!this.addzidian) {
        this.addzidian = true;
      }
      this.formList = {
        dictLabel: "",
        dictValue: "",
        sortNum: null,
        dictType: "",
        remark: "",
        delFlag: ""
      };
      this.formList.dictType = this.nowData.dictType;
    },
    // 字典类型新增弹出框
    leixingAddModel() {
      if (!this.addleixingMod) {
        this.addleixingMod = true;
      }
      this.form = { dictName: "", dictType: "", remark: "", delFlag: "" };
    },
    // 新增字典类型
    addList() {
      delete this.form.delFlag;
      this.$refs["addTypeData"].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            `/psys-master-service/api/external/dicttype/insert`,
            this.form
          );
          if (res.status == 200) {
            if (res.data.success) {
              if (this.addleixingMod) {
                this.addleixingMod = false;
              }
              this.$message.success(res.data.msg);
              this.getData();
            } else {
              this.$message.warning(res.data.msg);
            }
          } else {
            this.$message.error("新增失败！");
          }
        } else {
          return false;
        }
      });
    },
    // 删除字典类型 /psys-master-service/api/external/dicttype/deleteById?id=1
    async subDelete(id) {
      const data = {
        id: id
      };
      if (id.length !== 0) {
        if (typeof id === "object") {
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            const res = await this.$http.delete(
              `/psys-master-service/api/external/dicttype/deletebyid?id=${id}`
            );
            if (res.status == 200) {
              if (res.data.success) {
                this.$message.success(res.data.msg);
                this.startpage = 1;
                this.getData();
              } else {
                this.$message.warning(res.data.msg);
              }
            } else {
              this.$message.error("删除失败！");
            }
          });
        } else {
          const res = await this.$http.delete(
            `/psys-master-service/api/external/dicttype/deletebyid?id=${id}`
          );
          if (res.status == 200) {
            if (res.data.success) {
              this.$message.success(res.data.msg);
              this.startpage = 1;
              this.getData();
            } else {
              this.$message.warning(res.data.msg);
            }
          } else {
            this.$message.error("删除失败！");
          }
        }
      } else {
        this.$message.warning("请选择需要删除的数据");
      }
    },
    // 删除字典列表
    async deleteZidian(id) {
      if (id) {
        const param = { id: id };
        const res = await this.$http.delete(
          `/psys-master-service/api/external/dictdata/deletebyid?id=${id}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.$message.success(res.data.msg);
            this.startpage1 = 1;
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
    removeArray(_arr, _obj) {
      var length = _arr.length;
      for (var i = 0; i < length; i++) {
        if (isObjectValueEqual(_arr[i], _obj)) {
          if (i == 0) {
            _arr.shift(); //删除并返回数组的第一个元素
            return _arr;
          } else if (i == length - 1) {
            _arr.pop(); //删除并返回数组的最后一个元素
            return _arr;
          } else {
            _arr.splice(i, 1); //删除下标为i的元素
            return _arr;
          }
        }
      }
    },
    // 新增字典数据
    async addZidian() {
      // addForm
      this.$refs["addForm"].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            `/psys-master-service/api/external/dictdata/insert`,
            this.formList
          );
          if (res.status == 200) {
            if (res.data.success) {
              if (this.addzidian) {
                this.addzidian = false;
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
          return;
        }
      });
    },
    // 查询数据字典类型 table
    async getData() {
      const that = this;
      if (
        that.paramform.dictName ||
        that.paramform.dictType ||
        that.paramform.delFlag
      ) {
        that.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/dicttype/queryall?startpage=${that.startpage}&pagesize=${that.pagesize}&dictName=${that.paramform.dictName}&dictType=${that.paramform.dictType}&delFlag=${that.paramform.delFlag}`
      );

      if (res.status == 200) {
        if (res.data.success) {
          that.tableData = res.data.data.pages;
          that.tableData.map(n => {
            n.createTime = new Date(n.createTime)
              .toLocaleDateString()
              .replace(/\//g, "-");
          });
          // 分页
          this.startpage = res.data.data.pageNum; // 当前页
          this.totalNum = parseInt(res.data.data.totalNum); // 总数量
          this.pagesize = res.data.data.pageSize; //
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    // 字典列表
    async getListData() {
      const that = this;
      if (
        that.ParamformList.dictValue ||
        that.ParamformList.dictLabel
      ) {
        that.startpage1 = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/dictdata/queryall?startpage=${that.startpage1}&pagesize=${that.pagesize1}&dictType=${this.nowData.dictType}&dictLabel=${that.ParamformList.dictLabel}&dictValue=${that.ParamformList.dictValue}`
      );
      if (res.status == 200) {
        if (res.data.data) {
          that.tableDataList = res.data.data.pages;
          that.tableDataList.map(n => {
            n.createTime = new Date(n.createTime)
              .toLocaleDateString()
              .replace(/\//g, "-");
            n.updateTime = new Date(n.updateTime)
              .toLocaleDateString()
              .replace(/\//g, "-");
          });
          // 分页
          this.startpage1 = res.data.data.pageNum;
          this.totalNum1 = parseInt(res.data.data.totalNum);
          this.pagesize1 = res.data.data.pageSize;
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    quxiaoliebaio() {
      if (this.exlc) {
        this.exlc = false;
      }
    },
    // 取消
    cancel() {
      if (this.editleixMod) {
        this.editleixMod = false;
      }
      if (this.addleixingMod) {
        this.addleixingMod = false;
      }

      if (this.addzidian) {
        this.addzidian = false;
      }
      if (this.editzidian) {
        this.editzidian = false;
      }
      this.$message("已取消！");
    },

    // 每页显示的条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.startpage = val;
      this.getData();
    },
    // 每页显示的条数
    handleSizeCha(val) {
      this.pagesize1 = val;
      this.getListData();
    },
    // 当前页
    handleCurrentCha(val) {
      this.startpage1 = val;
      this.getListData();
    }
  }
};
</script>


<style lang="less" scoped>
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 20px 0;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  padding: 0 1rem;
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
/deep/ .el-drawer__body {
  padding: 0 1rem;
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
.right /deep/ .el-button--mini {
  padding: 7px 6px;
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
.asa {
  display: inline;
  /deep/ .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 6px;
  }
}
.selectBox {
  justify-content: space-between;
  display: flex;
  flex-direction: row-reverse;
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-left: none;
  line-height: 28px;
  height: 37px;
  padding-top: 11px;
  padding-left: 14px;
  padding-right: 20px;
}
.excelBox /deep/ .el-drawer__open .el-drawer.rtl {
  width: 50% !important;
}
/deep/ .el-form-item--mini.el-form-item {
  line-height: 28px;
}
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 16px;
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
</style>
