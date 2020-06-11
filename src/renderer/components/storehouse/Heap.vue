<template>
  <div class="heap">
    <div>
      <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="堆名称">
            <el-input v-model="formInline.user" placeholder="堆名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="所属桩脚">
            <el-select v-model="formInline.region" placeholder="所属桩脚" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="堆位置">
            <el-input v-model="formInline.user" placeholder="xxxxx" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="mini">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button plain @click="oncreated" icon="el-icon-plus" size="mini"></el-button>
          </el-form-item>
        </el-form>
      </el-card>
       <el-drawer
      :title="flag?'新增堆列信息':'编辑堆列信息'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
      :append-to-body="true"
    >
      <div style="padding:1rem">
        <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="80px">
          <el-form-item required label="堆列名称" prop="bittName">
            <el-input v-model="addForm.bittName"></el-input>
          </el-form-item>
          <el-form-item required label="堆列编号" prop="bittCode">
            <el-input v-model="addForm.bittCode"></el-input>
          </el-form-item>
          <el-form-item required label="速记码" prop="shortName">
            <el-input v-model="addForm.shortName"></el-input>
          </el-form-item>
          <el-form-item required label="所属泊位" prop="berthId">
            <el-select v-model="addForm.berthId" placeholder="请选择">
              <el-option
                v-for="item in berthNameoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item required label="经度" prop="berthLongitude">
            <el-input type="number" :min="0" v-model="addForm.berthLongitude"></el-input>
          </el-form-item>
          <el-form-item required label="纬度" prop="berthDimension">
            <el-input type="number" :min="0" v-model="addForm.berthDimension"></el-input>
          </el-form-item>
        </el-form>
        <span class="demo-drawer__footer">
          <!-- 取消 -->
          <el-button size="mini" @click="addDialogVisible = false">取 消</el-button>
          <!-- 确认 -->
          <el-button size="mini" type="primary" @click="addUpdate">保 存</el-button>
        </span>
      </div>
    </el-drawer>
    </div>

    <!-- 查询列表 -->
    <div class="list">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑
            </el-button>
            <el-popconfirm title="您确定删除吗？">
              <el-button size="mini" type slot="reference">
                <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20,25,30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      dialog: false,
      loading: false,
       ids: [],
       berthNameoptions: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
       // 当前页码
      addForm: {
        bittName: "",
        bittCode: "",
        shortName: "",
        berthId: "",
        berthName: "",
        berthLongitude: "",
        berthDimension: ""
      },
      addDialogVisible: false,
      flag: false,
      nowData: {}, // 临时存放操作数据
      addFormRule: {
        bittName: [
          { required: true, message: "请输入堆列名称", trigger: "blur" }
        ],
        bittCode: [
          { required: true, message: "堆列编号不能为空", trigger: "blur" }
        ],
        shortName: [
          { required: true, message: "请输入速记码", trigger: "blur" }
        ],
        berthName: [
          { required: true, message: "请输入所属泊位", trigger: "blur" }
        ],
        berthLongitude: [
          { required: true, message: "请输入经度", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" }
        ],
        berthDimension: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" }
        ]
      },
      // 分页
      startpage: 1,
      totalNum: 1,
      pagesize: 10,
      currentPage: 1, // 当前页
      formLabelWidth: "120px",
      tableData:[],
      queryall: {
        startpage: 1,
        pagesize: 10
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      tableData: []
    };
  },
  mounted(){
      this.getBittInfo()
  },
  methods: {
    // 每页显示的条数
    handleSizeChange(val) {
      this.pagesize = val;
      this.getListData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.startpage = val;
      this.getListData();
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
    async addUpdate() {
      // 传递的参数等待确认
      // flag为真进行添加操作
      let that = this;
      delete this.addForm.berthName;
      this.addForm.berthId = this.senData.id; // 关联泊位
      that.$refs["addForm"].validate(async valid => {
        if (valid) {
          if (this.flag) {
            const data = {};
            const res = await this.$http.post(
              "/psys-master-service/api/external/mbitt/add",
              this.addForm
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              that.getBittInfo();
            } else {
              that.$message.warning(res.data.msg);
            }
          } else {
            // 进行修改操作
            const res = await this.$http.put(
              "/psys-master-service/api/external/mbitt/updatebyid",
              this.addForm
            );
            if (res.data.success) {
              if (that.addDialogVisible) {
                that.addDialogVisible = false;
              }
              that.$message.success(res.data.msg);
              that.getBittInfo();
            } else {
              that.$message.warning(res.data.msg);
            }
          }
        } else {
          return false;
        }
      });
    },
     async getBittInfo() {
      // 获取BittInfo信息
      var that = this;
        const res = await this.$http.get(
          `/psys-master-service/api/external/mbitt/queryall?startpage=${this.queryall.startpage}&pagesize=${this.queryall.pagesize}`
        );
        if (res.status == 200) {
          if (res.data.success) {
            this.tableData = res.data.data.pages;
            // 分页
            // this.currentPage = res.data.data.pageNum;
            this.totalNum = res.data.data.totalNum;
          } else {
            this.$message.warning(res.data.msg);
          }
        }
    },
    //查询事件
    onSubmit() {
    },
    //新增事件
    oncreated() {
     this.addDialogVisible = true;
      this.flag = true;
    },
   // 编辑信息
    handleEdit(index, info) {
      this.addDialogVisible = true;
      this.addForm.id = info.id;
      this.addForm.shortName = info.shortName;
      this.addForm.bittName = info.bittName;
      this.addForm.berthDimension = info.berthDimension;
      this.addForm.berthLongitude = info.berthLongitude;
      this.addForm.bittCode = info.bittCode;
      this.addForm.berthId = info.berthId;
      this.flag = false;
      console.log(info);
    },
  }
};
</script>

<style lang="less" scoped>
/deep/ .box-card{
    height: 42px !important;
    padding: 5px 0 0 10px !important;
    border: none !important;
}
.page {
  background: #ffffff;
  border-radius: 4px 4px 0 0;
padding: 5px 1rem;
}
.heap .title {
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
.box-card {
  height: 60px;
  padding: 10px 0 0 10px;
}
/deep/ .el-pagination{
        text-align: right;
}
/deep/.el-card__body {
  padding: 0;
}
/deep/.el-card__body .el-pagination {
  text-align: right;
}
/deep/ .list .el-button {
  border: none !important;
}
</style>