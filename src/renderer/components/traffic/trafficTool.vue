<template>
  <div class="box">
    <div class="selectBox">
      <el-form ref="form" size="mini" :model="form" inline>
        <el-form-item label="中文船名">
          <el-input
            @input="queryInfo.nameCn=verifyfilter('char',queryInfo.nameCn)"
            @keyup.enter.native="getListData"
            v-model="queryInfo.nameCn"
          ></el-input>
        </el-form-item>
        <el-form-item label="速记码">
          <el-input
            @input="queryInfo.shortCode=verifyfilter('latin',queryInfo.shortCode)"
            @keyup.enter.native="getListData"
            v-model="queryInfo.shortCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="船类型">
          <el-select
            filterable
            @keyup.enter.native="getListData"
            clearable
            v-model="queryInfo.shipKindCode"
            placeholder="请选择"
          >
            <el-option
              v-for="item in boatData"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
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
        :default-sort="{prop: 'sortNum', order: 'descending'}"
        stripe
        :data="tableData"
        style="width: 100%"
        max-height="620"
      >
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column prop="nameCn" label="中文船名" width="120"></el-table-column>
        <el-table-column prop="nameEn" label="英文船名" width="120"></el-table-column>
        <el-table-column prop="shortCode" label="速记码"></el-table-column>
        <el-table-column prop="imoNo" label="IMO"></el-table-column>
        <el-table-column prop="mmsi" label="MMSI" width sortable></el-table-column>
        <el-table-column prop="shipLength" label="船长" width sortable></el-table-column>
        <el-table-column prop="shipHeight" label="船高" sortable></el-table-column>
        <el-table-column prop="shipWidth" label="船宽" sortable></el-table-column>
        <el-table-column prop="shipCompany" label="船公司" width="120"></el-table-column>
        <el-table-column prop="shipOwner" label="船主"></el-table-column>
        <el-table-column prop="netTon" label="净吨" width sortable></el-table-column>
        <el-table-column prop="totalTon" label="总吨" width sortable></el-table-column>
        <el-table-column prop="weightTon" label="载重吨" sortable></el-table-column>
        <el-table-column prop="deadWeight" label="船舶自重" width="120" sortable></el-table-column>
        <el-table-column prop="shipKindName" label="船舶种类"></el-table-column>
        <el-table-column prop="hatchNo" label="舱口数" width></el-table-column>
        <el-table-column prop="siloCoverCode" label="仓口盖形式" width="120"></el-table-column>
        <el-table-column prop="mouldedHeight" label="型高"></el-table-column>
        <el-table-column prop="mouldedDepth" label="型深"></el-table-column>
        <el-table-column prop="callNo" label="呼号"></el-table-column>
        <el-table-column prop="captainPhone" label="船长电话"></el-table-column>
        <el-table-column prop="tonClassCode" label="船舶吨级"></el-table-column>
        <el-table-column prop="shipTypeName" label="船型"></el-table-column>
        <el-table-column prop="buildDate" label="建造日期" width="150"></el-table-column>
        <el-table-column prop="shipNationCode" label="船籍代码"></el-table-column>
        <el-table-column prop="cabinNum" label="舱数"></el-table-column>
        <el-table-column prop="cabinNo" label="舱层数"></el-table-column>
        <el-table-column prop="cgdkfsCode" label="舱盖打开方式" width="120"></el-table-column>
        <el-table-column prop="storageCapacity" label="仓容"></el-table-column>
        <el-table-column prop="cabinSize" label="舱尺寸"></el-table-column>
        <el-table-column prop="shipSpeed" label="航速"></el-table-column>
        <el-table-column prop="hangerNo" label="吊机数量"></el-table-column>
        <el-table-column prop="headerNum" label="头架距离"></el-table-column>
        <el-table-column prop="craneTypeCode" label="吊机类型"></el-table-column>
        <el-table-column prop="hangerForm" label="吊机位置"></el-table-column>
        <el-table-column prop="hangerLoad" label="吊机负荷"></el-table-column>
        <el-table-column prop="waterDepth" label="富余水深"></el-table-column>
        <el-table-column prop="fullloadWater" label="满载吃水"></el-table-column>
        <el-table-column prop="unloadedDraft" label="空载吃水"></el-table-column>
        <el-table-column prop="waterCapacity" label="淡水容量"></el-table-column>
        <el-table-column prop="cabinPositionCode" label="机舱位置"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="250">
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
        :title="flag?'新增海轮信息':'编辑海轮信息'"
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
              <el-input
                @input="form.nameCn=verifyfilter('char',form.nameCn)"
                v-model="form.nameCn"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文船名" prop="nameEn" :label-width="formLabelWidth">
              <el-input
                @input="form.nameEn=verifyfilter('latin',form.nameEn)"
                v-model="form.nameEn"
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
            <el-form-item label="IMO" prop="imoNo" :label-width="formLabelWidth">
              <el-input
                @input="form.imoNo=verifyfilter('char',form.imoNo)"
                v-model="form.imoNo"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="MMSI" prop="mmsi" :label-width="formLabelWidth">
              <el-input
                @input="form.mmsi=verifyfilter('char',form.mmsi)"
                v-model="form.mmsi"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="呼号" prop="callNo" :label-width="formLabelWidth">
              <el-input
                @input="form.callNo=verifyfilter('digit',form.callNo)"
                v-model="form.callNo"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船长" prop="shipLength" :label-width="formLabelWidth">
              <el-input
                @input="form.shipLength=verifyfilter('digit',form.shipLength)"
                v-model="form.shipLength"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船高" prop="shipHeight" :label-width="formLabelWidth">
              <el-input
                @input="form.shipHeight=verifyfilter('digit',form.shipHeight)"
                v-model="form.shipHeight"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船宽" prop="shipWidth" :label-width="formLabelWidth">
              <el-input
                @input="form.shipWidth=verifyfilter('digit',form.shipWidth)"
                v-model="form.shipWidth"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船舶吨级" :label-width="formLabelWidth">
              <el-input
                @input="form.tonClassCode=verifyfilter('digit',form.tonClassCode)"
                v-model="form.tonClassCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船舶自重" prop :label-width="formLabelWidth">
              <el-input
                @input="form.deadWeight=verifyfilter('digit',form.deadWeight)"
                v-model="form.deadWeight"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="总吨" :label-width="formLabelWidth">
              <el-input
                @input="form.totalTon=verifyfilter('digit',form.totalTon)"
                v-model="form.totalTon"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="舱口数" :label-width="formLabelWidth">
              <el-input
                @input="form.hatchNo=verifyfilter('digit',form.hatchNo)"
                v-model="form.hatchNo"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船型" prop="shipTypeCode" :label-width="formLabelWidth">
              <el-select clearable v-model="form.shipTypeCode" placeholder="船型">
                <el-option
                  v-for="item in boatKind"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="船舶种类" prop="shipKindCode" :label-width="formLabelWidth">
              <el-select clearable v-model="form.shipKindCode" placeholder="船舶种类">
                <el-option
                  v-for="item in boatData"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="formt-itm" @click="colpopFun()">
            <p>结构信息</p>
            <div>
              <i v-if="!colpop" class="el-icon-arrow-down"></i>
              <i v-if="colpop" class="el-icon-arrow-up"></i>
            </div>
          </div>
          <div v-if="colpop" class="form-t">
            <el-form-item label="舱数" :label-width="formLabelWidth">
              <el-input
                @input="form.cabinNum=verifyfilter('digit',form.cabinNum)"
                v-model="form.cabinNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="舱层数" :label-width="formLabelWidth">
              <el-input
                @input="form.cabinNo=verifyfilter('digit',form.cabinNo)"
                v-model="form.cabinNo"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="净吨" :label-width="formLabelWidth">
              <el-input
                @input="form.netTon=verifyfilter('digit',form.netTon)"
                v-model="form.netTon"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="载重吨" :label-width="formLabelWidth">
              <el-input
                @input="form.weightTon=verifyfilter('digit',form.weightTon)"
                v-model="form.weightTon"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="仓容" :label-width="formLabelWidth">
              <el-input
                @input="form.storageCapacity=verifyfilter('digit',form.storageCapacity)"
                v-model="form.storageCapacity"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船尺寸" :label-width="formLabelWidth">
              <el-input
                @input="form.cabinSize=verifyfilter('digit',form.cabinSize)"
                v-model="form.cabinSize"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="最大船速" prop :label-width="formLabelWidth">
              <el-input
                @input="form.topSpeed=verifyfilter('digit',form.topSpeed)"
                v-model="form.topSpeed"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item label="航速" prop :label-width="formLabelWidth">
              <el-input
                @input="form.shipSpeed=verifyfilter('digit',form.shipSpeed)"
                v-model="form.shipSpeed"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="型深" prop :label-width="formLabelWidth">
              <el-input
                @input="form.mouldedDepth=verifyfilter('digit',form.mouldedDepth)"
                v-model="form.mouldedDepth"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="型高" prop :label-width="formLabelWidth">
              <el-input
                @input="form.mouldedHeight=verifyfilter('digit',form.mouldedHeight)"
                v-model="form.mouldedHeight"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="吊机数量" :label-width="formLabelWidth">
              <el-input
                @input="form.hangerNo=verifyfilter('digit',form.hangerNo)"
                v-model="form.hangerNo"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="吊机负荷" :label-width="formLabelWidth">
              <el-input
                @input="form.hangerLoad=verifyfilter('digit',form.hangerLoad)"
                v-model="form.hangerLoad"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="机舱位置" :label-width="formLabelWidth">
              <el-input
                @input="form.cabinPositionCode=verifyfilter('char',form.cabinPositionCode)"
                v-model="form.cabinPositionCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="仓口盖形式" :label-width="formLabelWidth">
              <el-input
                @input="form.siloCoverCode=verifyfilter('char',form.siloCoverCode)"
                v-model="form.siloCoverCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="仓盖打开形式" :label-width="formLabelWidth">
              <el-input
                @input="form.cgdkfsCode=verifyfilter('char',form.cgdkfsCode)"
                v-model="form.cgdkfsCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="船盖打开形式" :label-width="formLabelWidth">
              <el-input v-model="form.cgdkfsCode" autocomplete="off"></el-input>
            </el-form-item>-->
            <el-form-item label="吊机位置" :label-width="formLabelWidth">
              <el-input
                @input="form.hangerForm=verifyfilter('char',form.hangerForm)"
                v-model="form.hangerForm"
                autocomplete="off"
              ></el-input>
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
            <el-form-item label="船公司" :label-width="formLabelWidth">
              <el-input
                @input="form.shipCompany=verifyfilter('char',form.shipCompany)"
                v-model="form.shipCompany"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船主" :label-width="formLabelWidth">
              <el-input
                @input="form.shipOwner=verifyfilter('char',form.shipOwner)"
                v-model="form.shipOwner"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="船长电话" :label-width="formLabelWidth">
              <el-input
                @input="form.captainPhone=verifyfilter('number',form.captainPhone)"
                v-model="form.captainPhone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="建造日期" :label-width="formLabelWidth">
              <el-date-picker v-model="form.buildDate" type="date" placeholder="请选择"></el-date-picker>
            </el-form-item>
            <el-form-item label="船籍代码" :label-width="formLabelWidth">
              <el-input
                @input="form.shipNationCode=verifyfilter('char',form.shipNationCode)"
                v-model="form.shipNationCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="淡水容量" :label-width="formLabelWidth">
              <el-input
                @input="form.waterCapacity=verifyfilter('digit',form.waterCapacity)"
                v-model="form.waterCapacity"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="富余水深" :label-width="formLabelWidth">
              <el-input
                @input="form.waterDepth=verifyfilter('digit',form.waterDepth)"
                v-model="form.waterDepth"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="满载吃水" :label-width="formLabelWidth">
              <el-input
                @input="form.fullloadWater=verifyfilter('digit',form.fullloadWater)"
                v-model="form.fullloadWater"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="空载吃水" :label-width="formLabelWidth">
              <el-input
                @input="form.unloadedDraft=verifyfilter('digit',form.unloadedDraft)"
                v-model="form.unloadedDraft"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="吊机类型" :label-width="formLabelWidth">
              <el-input
                @input="form.craneTypeCode=verifyfilter('char',form.craneTypeCode)"
                v-model="form.craneTypeCode"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="头架距离" :label-width="formLabelWidth">
              <el-input
                @input="form.headerNum=verifyfilter('digit',form.headerNum)"
                v-model="form.headerNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <div style="margin-left:1rem">
              <div>
                <el-form-item label="备注" prop="desc">
                  <el-input
                    type="textarea"
                    @input="form.remark=verifyfilter('char',form.remark)"
                    v-model="form.remark"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
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
  name: "trafficTool",
  data() {
    return {
      // 基础信息验证
      basisRules: {
        nameCn: [
          { required: true, message: "中文船名不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        nameEn: [
          { required: true, message: "英文船名不能为空", trigger: "blur" },
        ],
        shortCode: [
          { required: true, message: "请输入速记码", trigger: "blur" },
          { min: 1, message: "长度在 1个字符以上", trigger: "blur" }
        ],
        imoNo: [{ required: true, message: "IMO不能为空", trigger: "blur" }],
        mmsi: [{ required: true, message: "MMSI不能为空", trigger: "blur" }],
        callNo: [{ required: true, message: "呼号不能为空", trigger: "blur" }],
        shipTypeCode: [
          {
            required: true,
            message: "干货船、散货船等不能为空",
            trigger: "blur"
          }
        ],
        callNo: [{ required: true, message: "呼号不能为空", trigger: "blur" }],
        shipKindCode: [
          { required: true, message: "船舶种类不能为空", trigger: "blur" }
        ],
        shipLength: [
          { required: true, message: "船长不能为空", trigger: "blur" }
        ],
        shipHeight: [
          { required: true, message: "船高不能为空", trigger: "blur" }
        ],
        shipWidth: [
          { required: true, message: "船宽不能为空", trigger: "blur" }
        ]
      },
      queryInfo: {
        nameCn: "",
        shortCode: "",
        shipKindCode: ""
      }, //查询参数
      flag: false,
      ids: [], // 批量删除
      form: {
        nameCn: "",
        nameEn: "",
        shortCode: "",
        imoNo: "",
        mmsi: "",
        callNo: "",
        captainPhone: "",
        shipCompany: "",
        shipCompanyCode: "",
        shipOwner: null,
        shipOwnerCode: null,
        netTon: null,
        weightTon: null,
        tonClassCode: null,
        deadWeight: null,
        totalTon: null,
        shipTypeCode: "",
        shipKindCode: "",
        buildDate: new Date(),
        shipNationCode: null,
        hatchNo: null,
        cabinNum: null,
        cabinNo: null,
        siloCoverCode: null,
        cgdkfsCode: null,
        storageCapacity: null,
        cabinSize: null,
        hatchLayer: null,
        shipLength: "",
        shipHeight: "",
        shipWidth: "",
        topSpeed: null,
        shipSpeed: null,
        mouldedDepth: null,
        mouldedHeight: null,
        cabinPositionCode: null,
        hangerNo: null,
        hangerForm: null,
        hangerLoad: null,
        waterCapacity: null,
        waterDepth: null,
        fullloadWater: null,
        unloadedDraft: null,
        craneTypeCode: null,
        headerNum: null,
        delFlag: "",
        remark: null
      },
      formLabelWidth: "120px", // form的item宽度
      drawer: false, // 新增修改
      relation: false, // 关联
      loading: false,
      tableData: [],
      colpo: false, // 基本信息
      colpop: false, //构造信息
      colpopo: false, // 其他信息
      nowData: {},
      // 分页
      startpage: 1,
      totalNum: 1,
      pagesize: 10,
      currentPage: 1, // 当前页
      dicttype: "ship_type",
      boatData: [], // 船类型
      boatKind: [] //船型
    };
  },
  mounted() {
    this.getListData();
    this.getboatType();
    this.getboatWar();
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async getboatType() {
      // /psys-master-service/api/external/public/listdict
      const that = this;
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=ship_type`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.boatData = res.data.data;
        }
      }
    },
    async getboatWar() {
      // /psys-master-service/api/external/public/listdict
      const that = this;
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listdict?dicttype=ship_kind`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.boatKind = res.data.data;
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
    // 基本信息
    colpoFun() {
      this.colpo = !this.colpo;
      if (this.colpop) {
        this.colpop = false;
      }
      if (this.colpopo) {
        this.colpopo = false;
      }
    },
    // 构造信息
    colpopFun() {
      this.colpop = !this.colpop;
      if (this.colpo) {
        this.colpo = false;
      }
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
      if (this.colpop) {
        this.colpop = false;
      }
    },
    // 海轮类型事件
    cusChange(value) {
      console.log(value);
    },
    // 查询数据table
    async getListData() {
      const that = this;
      this.$http.headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: window.sessionStorage.getItem("token")
      };
      if (
        this.queryInfo.shipKindCode ||
        this.queryInfo.nameCn ||
        this.queryInfo.shortCode
      ) {
        this.startpage = 1;
      }
      const res = await this.$http.get(
        `/psys-master-service/api/external/shipInfo/queryall?pagesize=${this.pagesize}&startpage=${this.startpage}&shipKindCode=${this.queryInfo.shipKindCode}&nameCn=${this.queryInfo.nameCn}&shortCode=${this.queryInfo.shortCode}`
      );
      if (res.status == 200) {
        if (res.data.success) {
          this.tableData = res.data.data.pages;
          that.tableData.map(n => {
            n.buildDate = new Date(n.buildDate)
              .toLocaleDateString()
              .replace(/\//g, "-");
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
      delete this.form.shipKindName;
      delete this.form.shipTypeName;
      let that = this;
      that.form.buildDate = new Date(that.form.buildDate);
      // flag为真进行添加操作
      that.$refs["basisRulesRef"].validate(async valid => {
        if (valid) {
          if (that.flag) {
            delete this.form.id;
            const res = await that.$http.post(
              "/psys-master-service/api/external/shipInfo/add",
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
            that.form.buildDate = new Date(that.form.buildDate);
            // 进行修改操作elseRules
            const res = await that.$http.put(
              "/psys-master-service/api/external/shipInfo/updatebyid",
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
          `/psys-master-service/api/external/shipInfo/deletebyid?id=${id}`
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
        this.$message.warning("请选择删除的数据");
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
      this.form.buildDate = new Date();
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

/deep/ .el-button--primary {
  background-color: #338ce8;
  border-color: #338ce8;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  padding-right: 2.5rem;
}
/deep/ .el-textarea__inner {
  width: 90%;
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
/deep/ .el-select:hover .el-input__inner {
  color: #909399;
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
.leftbox /deep/ .el-input {
  width: 60% !important;
}
.leftbox /deep/ .el-select {
  // width: 100% !important;
}
.btn /deep/ .el-button--mini,
.el-button--mini.is-round {
  padding: 7px;
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