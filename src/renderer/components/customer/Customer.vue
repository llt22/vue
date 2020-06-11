<template>
  <div class="box">
    <div class="selectBox">
      <div class="btn">
        <!-- 新增按钮 -->
        <el-button icon="el-icon-plus" @click="add" size="mini"></el-button>
        <!-- 删除按钮 -->
        <!-- <el-button icon="el-icon-delete" @click="subDelete(ids)" size="mini"></el-button> -->
      </div>
      <div>
        <el-form ref="paramform" size="mini" :model="form" inline>
          <el-form-item label="客户名称">
            <el-input
              @input="queryInfo.fullName=verifyfilter('char',queryInfo.fullName)"
              @keyup.enter.native="getListData"
              placeholder="请输入客户名称"
              v-model="queryInfo.fullName"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户类型">
            <el-select
              filterable
              @keyup.enter.native="getListData"
              clearable
              v-model="queryInfo.companyTypeCode"
              placeholder="客户类型"
            >
              <el-option
                v-for="item in cusType"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getListData()" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <keep-alive>
    <el-table
    highlight-current-row
      @selection-change="handleSelectionChange"
      stripe
      :data="tableData"
      style="width: 100%"
      fit
       max-height="620"
    >
      <el-table-column prop="fullName" label="客户名称" width="120"></el-table-column>
      <el-table-column prop="fullName" label="审核状态" width></el-table-column>
      <el-table-column prop="chnRefer" label="客户简称"></el-table-column>
      <el-table-column prop="shortCode" label="速记码"></el-table-column>
      <el-table-column prop="companyTypeCode" label="客户类型"></el-table-column>
      <el-table-column prop="province" label="所属省份" width></el-table-column>
      <el-table-column prop="city" label="所属城市" width></el-table-column>
      <el-table-column prop="parentId" label="母公司名称" width="120"></el-table-column>
      <el-table-column prop="legalPersonName" label="法人名称"></el-table-column>
      <el-table-column prop="legalPersonPhone" label="法人联系电话" width="120"></el-table-column>
      <el-table-column prop="contactPhone" label="公司联系电话" width="120"></el-table-column>
      <el-table-column prop="businessRange" label="经营范围"></el-table-column>
      <el-table-column prop="taxNum" label="税号"></el-table-column>
      <el-table-column prop="bank" label="开户银行"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="RelationFun(scope.$index, scope.row)">
            <i class="iconfont icon-liebiaotubiao_guanlianjigou" style="color:#E6A91F"></i>关联机构
          </el-button>
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

    <div class="kehuguanxi">
      <el-drawer :before-close="handleClose" title="客户关系" :visible.sync="relation" direction="rtl">
        <div class="headerspan">
          <p v-cloak>{{companyName}}</p>
        </div>
        <div class="headerspan-item">下属机构</div>
        <div class="form-t">
          <el-form>
            <el-form-item :label-width="formLabelWidth">
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
          <el-button size="small" @click="cancel()">取 消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="customerSyscomp()"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '保 存' }}</el-button>
        </div>
      </el-drawer>
    </div>
    <div class="leftbox">
      <el-drawer
        :before-close="handleClose"
        :title="flag?'新增客户信息':'编辑客户信息'"
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
            <el-form-item label="客户名称" prop="fullName" :label-width="formLabelWidth">
              <el-input
                @input="form.fullName=verifyfilter('char',form.fullName)"
                v-model="form.fullName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户简称" prop="chnRefer" :label-width="formLabelWidth">
              <el-input
                @input="form.chnRefer=verifyfilter('char',form.chnRefer)"
                v-model="form.chnRefer"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文名称" :label-width="formLabelWidth">
              <el-input
                @input="form.engName=verifyfilter('latin',form.engName)"
                v-model="form.engName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文简称" :label-width="formLabelWidth">
              <el-input
                @input="form.engRefer=verifyfilter('latin',form.engRefer)"
                v-model="form.engRefer"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="速记码" prop="shortCode" :label-width="formLabelWidth">
              <el-input
                @input="form.shortCode=verifyfilter('latin',form.shortCode)"
                v-model="form.shortCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户类型" required :label-width="formLabelWidth">
              <div style="margin-left:104px">
                <el-checkbox-group v-model="checkedCus" @change="cusChange">
                  <el-checkbox
                    v-for="cus in customerType"
                    :label="cus.dictLabel"
                    :key="cus.dictValue"
                  >{{cus.dictLabel}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item label="统一社会信用代码" :label-width="formLabelWidth">
              <el-input
                @input="form.uscCode=verifyfilter('char',form.uscCode)"
                v-model="form.uscCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码证" :label-width="formLabelWidth">
              <el-input
                @input="form.structureCode=verifyfilter('char',form.structureCode)"
                v-model="form.structureCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="法人名称" prop="legalPersonName" :label-width="formLabelWidth">
              <el-input
                @input="form.legalPersonName=verifyfilter('char',form.legalPersonName)"
                v-model="form.legalPersonName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="法人身份证" prop="legalPersonCredit" :label-width="formLabelWidth">
              <el-input
                @input="form.legalPersonCredit=verifyfilter('cardNum',form.legalPersonCredit)"
                v-model="form.legalPersonCredit"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="法人联系电话" prop="legalPersonPhone" :label-width="formLabelWidth">
              <el-input
                @input="form.legalPersonPhone=verifyfilter('number',form.legalPersonPhone)"
                v-model="form.legalPersonPhone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司电话" :label-width="formLabelWidth">
              <el-input
                @input="form.contactPhone=verifyfilter('number',form.contactPhone)"
                v-model="form.contactPhone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="税号" :label-width="formLabelWidth">
              <el-input
                @input="form.taxNum=verifyfilter('char',form.taxNum)"
                v-model="form.taxNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
          <div class="formt-itm" @click="colpopFun()">
            <p>其他信息</p>
            <div>
              <i v-if="!colpop" class="el-icon-arrow-down"></i>
              <i v-if="colpop" class="el-icon-arrow-up"></i>
            </div>
          </div>
          <div v-if="colpop" class="form-t">
            <el-form-item label="所属母公司" :label-width="formLabelWidth">
              <!-- <el-input v-model="form.parentId" autocomplete="off"></el-input> -->
              <el-select filterable v-model="form.parentId" placeholder="选择所属母公司" clearable>
                <el-option
                  v-for="item in parentComp"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属省份" :label-width="formLabelWidth">
              <el-input
                @input="form.province=verifyfilter('char',form.province)"
                v-model="form.province"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属城市" :label-width="formLabelWidth">
              <el-input
                @input="form.city=verifyfilter('char',form.city)"
                v-model="form.city"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司类型代码" :label-width="formLabelWidth">
              <el-input
                @input="form.ctCode=verifyfilter('char',form.ctCode)"
                v-model="form.ctCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司联系人身份证" :label-width="formLabelWidth">
              <el-input
                @input="form.compPersonCredit=verifyfilter('cardNum',form.compPersonCredit)"
                v-model="form.compPersonCredit"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司联系人名称" :label-width="formLabelWidth">
              <el-input
                @input="form.compPersonName=verifyfilter('char',form.compPersonName)"
                v-model="form.compPersonName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司联系电话" :label-width="formLabelWidth">
              <el-input
                @input="form.compPersonPhone=verifyfilter('number',form.compPersonPhone)"
                v-model="form.compPersonPhone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="单位地址" :label-width="formLabelWidth">
              <el-input
                @input="form.address=verifyfilter('char',form.address)"
                v-model="form.address"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item label="开户银行" :label-width="formLabelWidth">
              <el-input
                @input="form.bank=verifyfilter('number',form.bank)"
                v-model="form.bank"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="银行账户" :label-width="formLabelWidth">
              <el-input
                @input="form.bankNum=verifyfilter('number',form.bankNum)"
                v-model="form.bankNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="经营范围" :label-width="formLabelWidth">
              <el-input
                @input="form.businessRange=verifyfilter('char',form.businessRange)"
                v-model="form.businessRange"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <div style="margin-left:1rem">
              <el-form-item label="备注" prop="desc">
                <el-input
                  @input="form.remark=verifyfilter('char',form.remark)"
                  type="textarea"
                  v-model="form.remark"
                  autocomplete="off"
                ></el-input>
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
          >{{ loading ? '提交中 ...' : '保 存' }}</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Customer",
  data() {
    return {
      // 基础信息验证
      basisRules: {
        fullName: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        chnRefer: [
          { required: true, message: "请输入客户简称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        shortCode: [
          { required: true, message: "请输入速记码", trigger: "blur" },
          { min: 1, message: "长度在 1个字符以上", trigger: "blur" }
        ],
        legalPersonName: [
          { required: true, message: "请输入法人名称", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        legalPersonCredit: [
          { required: true, message: "请输入法人身份证", trigger: "blur" },
          { min: 15, max: 18, message: "请输入正确的身份证", trigger: "blur" }
        ],
        legalPersonPhone: [
          { required: true, message: "请输入法人联系电话", trigger: "blur" },
          { min: 8, max: 11, message: "长度在 8 到 11 个字符", trigger: "blur" }
        ]
      },
      queryInfo: {
        fullName: "",
        companyTypeCode: ""
      }, //查询参数
      flag: false,
      ids: [], // 批量删除
      checkedCus: [], // 选中的客户
      customerType: [], // 客户类型复选框
      checkedComp: [],
      parentComp: [], // 母公司
      comp: [],
      form: {
        fullName: "",
        chnRefer: "",
        engName: "",
        engRefer: "",
        shortCode: "",
        uscCode: "",
        structureCode: "",
        legalPersonName: "",
        legalPersonCredit: "",
        legalPersonPhone: "",
        compPersonCredit: "",
        compPersonName: "",
        compPersonPhone: "",
        taxNum: "",
        address: "",
        contactPhone: "",
        bank: "",
        bankNum: "",
        companyTypeCode: "",
        ctCode: "",
        businessSymbol: "",
        sortNum: "",
        businessRange: "",
        remark: ""
      },
      formLabelWidth: "120px", // form的item宽度
      drawer: false, // 新增修改
      relation: false, // 关联
      loading: false,
      companyName: "", // 下属公司header
      tableData: [],
      colpo: false, // 基本信息
      colpop: false, // 其他信息
      nowData: {},
      // 分页
      startpage: 1,
      totalNum: 1,
      pagesize: 10,
      currentPage: 1, // 当前页
      selectId: [],
      arr: [],
      cusType: [],
      cusTypeCode: null
    };
  },
  mounted() {
    this.getListData();
    this.getCusType();
  },
  methods: {
    //psys-master-service/api/external/c_company/queryparent
    async queryparent() {
      const res = await this.$http.get(`/psys-master-service/api/external/c_company/queryparent`);
      if (res.status == 200) {
        if (res.data.success) {
          // console.log(res)
          this.parentComp = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      } else {
        this.$message.error("获取数据失败！");
      }
    },
    // /psys-master-service/api/external/c_company/finddict
    async getSelectCusAdd() {
      let that = this;
      let data = [];
      let ids = new Array();
      const res = await this.$http.get(`/psys-master-service/api/external/c_company/finddict`);
      if (res.status == 200) {
        if (res.data.success) {
          this.customerType = res.data.data;
          if (that.customerType.length !== 0) {
            for (const n of that.customerType) {
              // 如果绑定
              if (n.bind) {
                data.push(n.dictLabel);
                ids.push(n.dictValue);
              }
            }
            this.checkedCus = data;
            this.cusTypeCode = ids.join(",");

            // trueId = that.comp.filter(n => n.bind).map(n => n.id);
          }
        }
      }
    },
    async getSelectCus() {
      let that = this;
      let data = [];
      let ids = new Array();
      const res = await this.$http.get(
        `/psys-master-service/api/external/c_company/finddictbyid?id=${this.form.id}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.customerType = res.data.data;
          if (that.customerType.length !== 0) {
            for (const n of that.customerType) {
              // 如果绑定
              if (n.bind) {
                data.push(n.dictLabel);
                ids.push(n.dictValue);
              }
            }
            this.checkedCus = data;
            this.cusTypeCode = ids.join(",");
            // trueId = that.comp.filter(n => n.bind).map(n => n.id);
          }
        }
      }
    },
    // 客户类型事件
    cusChange(v) {
      if (v.length !== 0) {
        this.checkedCus = v;
        this.arr = this.customerType.filter(n =>
          this.checkedCus.includes(n.dictLabel)
        );
        this.arr.forEach(i => {
          i.bind = true;
        });
      }
      if (this.checkedCus.length === 0) {
        this.arr = [];
      }
    },
    async getCusType() {
      const that = this;
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=c_company_type`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.cusType = res.data.data;
        }
      }
    },
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
      this.ids = this.newArr(that.ids);
    },
    // 基本信息
    colpoFun() {
      this.colpo = !this.colpo;
      if (this.colpop) {
        this.colpop = false;
      }
    },

    // 其他信息
    colpopFun() {
      this.colpop = !this.colpop;
      if (this.colpo) {
        this.colpo = false;
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
        if (this.checkedComp.length === 0) {
          this.arr = [];
        }
      }
    },
    // 关联信息弹出请求
    async RelationFun(index, row) {
      this.nowData = row;
      if (!this.relation) {
        this.relation = true;
      }
      const that = this;
      let data = [];
      let ids = new Array();
      const res = await this.$http.get(
        `/psys-master-service/api/external/customerSyscomp/listcustomerbind?id=${row.id}`
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
    newArr(arr) {
      return Array.from(new Set(arr));
    },
    // 客户关系
    async customerSyscomp() {
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
            compId: that.selectId.join(), // ['2','4','8'],
            customCompId: that.nowData.id
            // compType: that.nowData.companyTypeCode
          };
          const res = await that.$http.post("/psys-master-service/api/external/c_company/issue", data);
          if (res.data.success) {
            if (that.relation) {
              that.relation = false;
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
          compId: that.selectId.join(), // ['2','4','8'],
          customCompId: that.nowData.id
          // compType: that.nowData.companyTypeCode
        };
        const res = await that.$http.post("/psys-master-service/api/external/c_company/issue", data);
        if (res.data.success) {
          if (that.relation) {
            that.relation = false;
          }
          that.$message.success(res.data.msg);
          that.getListData();
        } else {
          that.$message.warning(res.data.msg);
        }
      }
    },

    // 查询数据table
    async getListData() {
      const that = this;
      if (this.queryInfo.fullName || this.queryInfo.companyTypeCode) {
        this.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/c_company/queryall?pagesize=${this.pagesize}&startpage=${this.startpage}&companyTypeCode=${this.queryInfo.companyTypeCode}&fullName=${this.queryInfo.fullName}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
          // 分页
          this.startpage = res.data.data.pageNum; // 当前页
          this.pagesize = res.data.data.pageSize; // 每页多少
          this.totalNum = res.data.data.totalNum;
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
      // flag为真进行添加操作
      that.$refs["basisRulesRef"].validate(async valid => {
        if (valid) {
          if (that.flag) {
            delete this.form.id;
            let trueId = new Set();
            // this.customerType = this.arr;
            trueId = this.arr.filter(n => n.bind).map(n => n.dictValue);
            this.cusTypeCode = trueId.join(",");
            if (this.cusTypeCode.length !== 0) {
              that.form.companyTypeCode = this.cusTypeCode;
            } else {
              // that.form.companyTypeCode = null
              this.$message.warning("请选择客户类型");
              return;
            }
            const res = await that.$http.post(
              "/psys-master-service/api/external/c_company/add",
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
            let trueId = new Set();
            // this.customerType = this.arr;
            trueId = this.arr.filter(n => n.bind).map(n => n.dictValue);
            this.cusTypeCode = trueId.join(",");
            if (this.cusTypeCode.length !== 0) {
              that.form.companyTypeCode = this.cusTypeCode;
            } else {
              // that.form.companyTypeCode = null
              this.$message.warning("请选择客户类型");
              return;
            }
            const res = await that.$http.put(
              "/psys-master-service/api/external/c_company/updatebyid",
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
      this.getSelectCus();
      this.queryparent();
    },

    // 删除确认
    async subDelete(id) {
      const data = {
        id: id
      };
      const res = await this.$http.delete(
        `/psys-master-service/api/external/c_company/deletebyid?id=${id}`
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
      this.queryparent();
      this.form = {};
      this.getSelectCusAdd();
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
/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
[v-cloak] {
  display: none;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  padding-right: 1rem;
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
.kehuguanxi /deep/ .el-drawer__open .el-drawer.rtl {
  width: 30% !important;
}
/deep/ .el-drawer__header {
  margin-bottom: 12px;
  padding: 8px 20px 0;
}
/deep/ .el-drawer__body {
  overflow-y: auto;
  padding-bottom: 50px;
}
.leftbox /deep/ .el-input {
  width: 60% !important;
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
