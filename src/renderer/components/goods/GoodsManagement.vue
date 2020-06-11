<template>
  <div class="box">
    <div class="selectBox">
      <div class="btn">
        <!-- 新增按钮 -->
        <el-button icon="el-icon-plus" @click="leixingAddModel" size="mini"></el-button>
        <!-- 删除按钮 -->
        <!-- <el-button icon="el-icon-delete" @click="subDelete(ids)" size="mini"></el-button> -->
      </div>
      <div>
        <el-form ref="paramform" size="mini" :model="form" inline>
          <el-form-item label="货类名称">
            <el-select
              v-model="paramform.cargoclasscode"
              placeholder
              clearable
              filterable
              @change="getChange()"
              style="width:100%"
            >
              <el-option
                v-for="item in cargoClass"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData()" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 货物列表 -->
    <keep-alive>
    <el-table
    highlight-current-row
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'sortNum', order: 'descending'}"
      stripe
      :data="cargotableData"
      style="width: 100%"
    >
      <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
      <el-table-column prop="cargoName" label="货物名称" width></el-table-column>
      <el-table-column prop="CARGOCLASS_TYPE" label="货物" width></el-table-column>
      <el-table-column prop="cargoCode" label="货物Code" width></el-table-column>
      <el-table-column prop="sortNum" label="排序" width="100" sortable></el-table-column>
      <el-table-column label="操作" align="center" width="300">
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

    <!-- 新增货物列表 -->
    <el-drawer
      :before-close="handleClose"
      title="新增货物"
      :visible.sync="addleixingMod"
      direction="rtl"
    >
      <el-form ref="addRef" status-icon size="small" :model="form">
        <el-form-item
          prop="cargoName"
          :rules="[
            { required: true, message: '货物名称不能为空'},
          ]"
          label="货物名称"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="form.cargoName=verifyfilter('char',form.cargoName)"
            v-model="form.cargoName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="货物Code" :label-width="formLabelWidth">
          <el-input
            @input="form.cargoCode=verifyfilter('latin',form.cargoCode)"
            v-model="form.cargoCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item required label="货物类型" :label-width="formLabelWidth">
          <el-select
            filterable
            v-model="paramform.cargoclasscode"
            placeholder
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in cargoClass"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="shortCode"
          :rules="[
            { required: true, message: '速记码不能为空'},
          ]"
          label="速记码"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="form.shortCode=verifyfilter('latin',form.shortCode)"
            v-model="form.shortCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="sortNum"
          :rules="[
            { required: true, message: '排序不能为空'},
          ]"
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="form.sortNum=verifyfilter('digit',form.sortNum)"
            type
            v-model="form.sortNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="addList()">保 存</el-button>
      </div>
    </el-drawer>
    <!-- 编辑货物列表 -->
    <el-drawer :before-close="handleClose" title="修改货物" :visible.sync="editleixMod">
      <el-form ref="typeRef" status-icon size="small" :model="nowData">
        <el-form-item
          prop="cargoName"
          :rules="[
            { required: true, message: '货物名称不能为空'},
          ]"
          label="货物名称"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="nowData.cargoName=verifyfilter('char',nowData.cargoName)"
            v-model="nowData.cargoName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="货物Code" :label-width="formLabelWidth">
          <el-input
            @input="nowData.cargoCode=verifyfilter('latin',nowData.cargoCode)"
            v-model="nowData.cargoCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="shortCode"
          :rules="[
            { required: true, message: '速记码'},
          ]"
          label="速记码"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="nowData.shortCode=verifyfilter('latin',nowData.shortCode)"
            v-model="nowData.shortCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="货物类型" :label-width="formLabelWidth">
          <el-select
            filterable
            v-model="nowData.cargoclassCode"
            placeholder
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in cargoClass"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="sortNum"
          :rules="[
            { required: true, message: '货物排序不能为空'},
            { type: 'number', message: '货物排序必须为数字值'}
          ]"
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input
            type
            @input="nowData.sortNum=verifyfilter('digit',nowData.sortNum)"
            v-model.number="nowData.sortNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="editTypeList()">保 存</el-button>
      </div>
    </el-drawer>
    <!-- 新增货名配置 -->

    <template>
      <div>
        <el-drawer
          :before-close="handleClose"
          title="新增货名"
          :visible.sync="addzidian"
          direction="rtl"
        >
          <el-form ref="addming" status-icon size="small" :model="formList">
            <el-form-item
              prop="cargoName"
              :rules="[
                { required: true, message: '货名名称不能为空'},
              ]"
              label="货名名称"
              :label-width="formLabelWidth"
            >
              <el-input
                @input="formList.cargoName=verifyfilter('char',formList.cargoName)"
                v-model="formList.cargoName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="shortCode"
              :rules="[
                { required: true, message: '速记码不能为空'},
              ]"
              label="速记码"
              :label-width="formLabelWidth"
            >
              <el-input
                @input="formList.shortCode=verifyfilter('latin',formList.shortCode)"
                v-model="formList.shortCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="货名Code" :label-width="formLabelWidth">
              <el-input disabled v-model="formList.cargoCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              prop="sortNum"
              :rules="[
            { required: true, message: '排序不能为空'},
          ]"
              label="排序"
              :label-width="formLabelWidth"
            >
              <el-input
                @input="formList.sortNum=verifyfilter('digit',formList.sortNum)"
                type
                v-model="formList.sortNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="货名颜色" :label-width="formLabelWidth">
              <el-color-picker :active-change="changeColor" v-model="formList.cargoColor"></el-color-picker>
            </el-form-item>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button size="small" @click="cancel()">取 消</el-button>
            <el-button size="small" type="primary" @click="addZidian()">保 存</el-button>
          </div>
        </el-drawer>
      </div>
    </template>
    <!-- 修改货名 -->
    <el-drawer :before-close="handleClose" title="编辑货名" :visible.sync="editzidian">
      <el-form ref="editming" status-icon size="small" :model="nowData">
        <el-form-item
          prop="cargoinfoName"
          :rules="[
            { required: true, message: '货名名称不能为空'},
          ]"
          label="货名名称"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="nowData.cargoinfoName=verifyfilter('char',nowData.cargoinfoName)"
            v-model="nowData.cargoinfoName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="shortCode"
          :rules="[
            { required: true, message: '速记码不能为空'},
          ]"
          label="速记码"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="nowData.shortCode=verifyfilter('latin',nowData.shortCode)"
            v-model="nowData.shortCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="货名Code" :label-width="formLabelWidth">
          <el-input disabled v-model="nowData.cargoinfoCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="sortNum"
          :rules="[
            { required: true, message: '排序不能为空'},
          ]"
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input
            @input="nowData.sortNum=verifyfilter('digit',nowData.sortNum)"
            v-model="nowData.sortNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="货名颜色" :label-width="formLabelWidth">
          <el-color-picker :active-change="changeColor" v-model="nowData.cargoinfoColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="zeditTypeList()">保 存</el-button>
      </div>
    </el-drawer>
    <!-- 货名列表 -->
    <template>
      <div class="excelBox">
        <el-drawer :before-close="handleClose" title="货名列表" :visible.sync="exlc" direction="rtl">
          <div style="margin-left:1rem;">
            <el-form status-icon ref="form" size="mini" :model="ParamformList" inline>
              <!-- <el-form-item label="货名名称">
                <el-input v-model="ParamformList.cargoName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
              </el-form-item>-->
              <el-form-item style="float:right;">
                <div class="btn">
                  <el-button icon="el-icon-plus" @click="zidianAddModel" size="mini"></el-button>
                </div>
                <!-- <el-button plain icon="el-icon-delete" @click="deleteZidian(ids)"></el-button> -->
              </el-form-item>
            </el-form>
          </div>

          <el-table border="" highlight-current-row stripe :data="cargotableDataList" style="width: 100%">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column prop="cargoinfoName" label="货名名称" width></el-table-column>
            <el-table-column prop="shortCode" label="速记码" width></el-table-column>
            <el-table-column prop="cargoinfoColor" label="货名颜色">
              <template slot-scope="scope">
                <span class="isomcolor" :style="{ background: scope.row.cargoinfoColor}"></span>
              </template>
            </el-table-column>
            <el-table-column prop="sortNum" type="number" :min="0" label="排序"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
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
              @current-change="handleCurrentChange"
              :current-page="startpage1"
              :page-sizes="[5, 10, 15, 20,25,30]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum1"
            ></el-pagination>
          </div>
        </el-drawer>
      </div>
    </template>
  </div>
</template>

<script>
import verify from "@/plugins/verify.js";
export default {
  name: "Goodsman",
  data() {
    return {
      cargoClass: [],
      paramform: {
        cargoclasscode: "",
        cargoclasstype: "cargoclass",
        cargo: "",
        remark: "",
        delFlag: ""
      }, // 查询类型
      cargeCode: "", // 货物code
      ParamformList: {
        dictLabel: "",
        dictValue: "",
        sortNum: 1,
        cargo: "",
        remark: "",
        delFlag: "0"
      }, // 查询货物
      form: {
        cargoName: "",
        shortCode: "",
        cargoCode: "",
        sortNum: ""
      }, // 货物列表form
      formList: {
        dictLabel: "",
        dictValue: "",
        sortNum: 1,
        cargo: "",
        remark: "",
        delFlag: "0",
        color: "#409EFF"
      }, // 货名列表form
      startpage1: 1,
      startpage: 1,
      pagesize: 10,
      ids: [], // 批量删除
      formLabelWidth: "120px", // form的item宽度
      editleixMod: false, // 修改弹出货物标签框
      addleixingMod: false, // 新增货物标签框
      exlc: false, // 列表货物框
      addzidian: false, // 新增货物框
      editzidian: false, // 修改货物框
      cargotableData: [], // 货物列表配置
      cargotableDataList: [], // 货物配置
      nowData: {}, // 临时存放操作数据
      // 分页
      currentPage: 1,
      totalNum1: 1,
      totalNum: 1,
      cargoclassId: "",
      // 批量删除
      ids: []
    };
  },
  watch: {
    form: function(val) {
      let ret = new RegExp(/[\u4e00-\u9fa5]/);
      let flas = ret.test(val.cargoclassCode);
      if (flas) {
        this.$message.warning("请输入正确的货名code");
      } else {
        this.form.cargoclassCode = val.cargoclassCode;
      }
    }
  },
  mounted() {
    this.getData();
    this.getParas();
  },
  methods: {
    getChange() {
      // str.indexOf("Hello")!=-1
      // this.cargoClass.forEach((n)=>{
      // if(n.dictValue = this.paramform.cargoclasscode){
      //   this.paramform.cargoclasstype
      // }
      // })
    },
    change(z) {
      this.$forceUpdate();
      if (z === "code") {
        this.form.cargoclassCode = this.verifyfilter(
          "latin",
          this.form.cargoclassCode
        );
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // api/psys-master-service/api/external/public/listdict?dicttype=cargoclass
    async getParas() {
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=cargoclass`
      );
      if (res.status == 200) {
        if (res.data.success) {
          // console.log(res)
          this.cargoClass = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    // 修改颜色选择器
    changeColor() {
      // console.log(this.formList.color);
      // console.log(this.nowData.color);
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
    // 修改货物列表弹出
    handleEdit(index, row) {
      this.nowData = row;
      if (!this.editleixMod) {
        this.editleixMod = true;
      }
    },
    // 修改货物列表PUT
    async editTypeList() {
      const data = {
        id: this.nowData.id,
        cargoCode: this.nowData.cargoCode,
        cargoName: this.nowData.cargoName,
        cargoclassCode: this.nowData.cargoclassCode,
        cargoclassType: "cargoclass", //this.paramform.cargoclassType,
        shortCode: this.nowData.shortCode,
        sortNum: this.nowData.sortNum
      };
      this.$refs["typeRef"].validate(async valid => {
        if (valid) {
          const res = await this.$http.put(`/psys-master-service/api/external/cargo/updatecargo`, data);
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
    // 修改货名弹出
    zEdit(index, row) {
      this.nowData.cargoinfoCode = this.nowData.cargoCode;
      this.nowData = row;
      if (!this.editzidian) {
        this.editzidian = true;
      }
    },
    // 修改货名PUT /api//psys-master-service/api/external/cargo/cargo/updatecargoinfo
    async zeditTypeList() {
      const data = {
        cargoinfoCode: this.nowData.cargoinfoCode,
        cargoinfoColor: this.nowData.cargoinfoColor,
        cargoinfoName: this.nowData.cargoinfoName,
        cargoId: this.nowData.cargoId,
        shortCode: this.nowData.shortCode,
        sortNum: this.nowData.sortNum,
        id: this.nowData.id
      };
      // editming
      this.$refs["editming"].validate(async valid => {
        if (valid) {
          const res = await this.$http.put(
            `/psys-master-service/api/external/cargo/updatecargoinfo`,
            data
          );
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
    // 货名列表弹出
    excelFun(index, row) {
      console.log(index, row);
      if (!this.exlc) {
        this.exlc = true;
      }
      this.nowData = row;
      this.cargeCode = row.cargoCode;
      this.cargoclassId = row.id;
      this.getListData();
    },
    // 货名新增弹出框
    zidianAddModel() {
      if (!this.addzidian) {
        this.addzidian = true;
      }
      this.formList = {};
      this.formList.cargoCode = this.cargeCode;
    },
    // 货物列表新增弹出框
    leixingAddModel() {
      if (!this.addleixingMod) {
        this.addleixingMod = true;
      }
      this.form = {};
    },
    // 新增货物列表
    async addList() {
      // { "cargoname":"货物1", "cargoclasscode":"货类代码", "cargoclasstype":"CARGOCLASSTYPE","shortcode":"HW1","sortnum":"0"}
      const data = {
        cargoname: this.form.cargoName,
        cargoclasscode: this.paramform.cargoclasscode,
        cargoclasstype: this.paramform.cargoclasstype,
        shortcode: this.form.shortCode,
        cargoCode: this.form.cargoCode,
        sortnum: this.form.sortNum
      };
      this.$refs["addRef"].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(`/psys-master-service/api/external/cargo/addcargo`, data);
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
          return;
        }
      });
    },
    // 删除货物列表 /psys-master-service/api/external/cargo/deletecargo
    async subDelete(id) {
      // this.$message.success(id)
      if (id) {
        const res = await this.$http.delete(
          `/psys-master-service/api/external/cargo/deletecargo?id=${id}`
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
      } else {
        this.$message.warning("请先选择删除数据");
      }
    },
    // 删除货名列表
    async deleteZidian(id) {
      if (id) {
        const param = { id: id };
        const res = await this.$http.delete(
          `/psys-master-service/api/external/cargo/deletebyid?id=${id}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.startpage1 = 1;
            this.$message.success(res.data.msg);
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
    // 新增货名数据
    async addZidian() {
      const data = {
        cargoinfoCode: this.formList.cargoCode,
        cargoinfoColor: this.formList.cargoColor,
        cargoinfoName: this.formList.cargoName,
        cargoId: this.cargoclassId,
        shortCode: this.formList.shortCode,
        sortNum: this.formList.sortNum,
        parentId: "2"
      };
      // addming
      this.$refs["addming"].validate(async valid => {
        if (valid) {
          const res = await this.$http.post(`/psys-master-service/api/external/cargo/add`, data);
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
    // 查询数据货物列表 table
    async getData() {
      const that = this;
      if (that.paramform.cargoName) {
        that.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/cargo/getcargolist?startpage=${that.startpage}&pagesize=${that.pagesize}&cargoclasscode=${that.paramform.cargoclasscode}`
      );

      if (res.status == 200) {
        if (res.data.success) {
          that.cargotableData = res.data.data.pages;
          // 分页
          this.startpage = res.data.data.pageNum;
          this.totalNum = parseInt(res.data.data.totalNum);
          this.pagesize = res.data.data.pageSize;
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    // 货名列表
    async getListData() {
      const that = this;
      if (this.cargoclassId === undefined) {
        this.cargoclassId = this.nowData.cargoclassId;
      }

      const res = await this.$http.get(
        `/psys-master-service/api/external/cargo/getcargoinfolistbycargoid?startpage=${that.startpage1}&pagesize=${that.pagesize}&cargoid=${this.cargoclassId}`
      );
      if (res.status == 200) {
        if (res.data.data) {
          that.cargotableDataList = res.data.data.pages;
          // 分页
          this.startpage1 = res.data.data.pageNum;
          this.totalNum1 = parseInt(res.data.data.totalNum);
          this.pagesize = res.data.data.pageSize;
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    quxiaoliebiao() {
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
    handleSizeCha(val) {
      this.pagesize1 = val;
      this.getData();
      this.getListData();
    },
    // 每页显示的条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
      this.getListData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.startpage = val;
      this.getData();
      this.getListData();
    }
  }
};
</script>


<style lang="less" scoped>
.isomcolor {
  width: 1rem;
  height: 1rem;
  position: absolute;
  border-radius: 3px;
  left: 37%;
  top: 1.3rem;
}
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

.btn /deep/ .el-button--mini,
.el-button--mini.is-round {
  padding: 7px 6px;
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

/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 10px 13px;
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
/deep/ .el-drawer__body {
  padding: 0 1rem;
}
/deep/ .el-button + .el-button {
  margin-left: 3px;
}
</style>