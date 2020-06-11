<template>
  <div class="foot">
    <!-- 查询条件 -->
    <div class="selectBox">
      <el-form ref="form" size="mini" :model="form" inline>
        <el-form-item label="桩脚名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="桩脚位置">
          <el-input v-model="form.char"></el-input>
        </el-form-item>
        <el-form-item label="所属库场">
          <el-select v-model="form.company" placeholder="所属公司">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="" icon="el-icon-plus" @click="add()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询列表 -->
    <el-table  stripe :data="tableData"  style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="date" label="桩脚名称" width=""></el-table-column>
      <el-table-column prop="name" label="所属库场" width=""></el-table-column>
      <el-table-column prop="address" label="桩脚位置"></el-table-column>
      <el-table-column label="作业过程"></el-table-column>
      <!-- <el-table-column prop="create" label="创建人"></el-table-column> -->
      <el-table-column label="操作" align="center"  width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"> <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑</el-button>
        <el-popconfirm @onConfirm="sub" @onCancel="cancel" title="您确定删除吗？">
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
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>
    <el-dialog title="新增桩脚" :visible.sync="dialog">
      <el-form size="small" :model="form">
        <el-form-item label="桩脚" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="桩脚" :label-width="formLabelWidth">
          <el-select v-model="form.company" placeholder="请选择桩脚">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="即时配送" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="桩脚" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动性质" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="桩脚" :label-width="formLabelWidth">
          <el-select v-model="form.company" placeholder="请选择桩脚">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊资源" :label-width="formLabelWidth">
          <el-radio-group v-model="form.company">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="addOk()">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑操作工艺" :visible.sync="dialogFormVisible">
      <el-form size="small" :model="form">
        <el-form-item label="操作工艺" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作工艺" :label-width="formLabelWidth">
          <el-select v-model="form.company" placeholder="请选择操作工艺">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="即时配送" :label-width="formLabelWidth">
          <el-switch v-model="form.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="操作工艺" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动性质" :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="操作工艺" :label-width="formLabelWidth">
          <el-select v-model="form.company" placeholder="请选择操作工艺">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊资源" :label-width="formLabelWidth">
          <el-radio-group v-model="form.company">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="edit()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trafficTool",
  data() {
    return {
      form: {
        name: "",
        char: "",
        state: "",
        company: "",
        type: [],
        delivery: true
      },
      currentPage: 3,// 当前页
      formLabelWidth: "120px", // form的item宽度
      dialogFormVisible: false, // 修改弹出框
      dialog:false, // 新增
      tableData: [
        {
          date: "桩脚1",
          name: "库场2",
          address: "库场2",
          create:"张三"
        },
        {
          date: "桩脚1",
          name: "库场2",
          address: "上海市普陀区金沙江路 1517 弄",
          create:"张三"
        },
        {
          date: "桩脚1",
          name: "库场2",
          address: "上海市普陀区金沙江路 1517 弄",
          create:"张三"
        },
        {
          date: "桩脚1",
          name: "库场2",
          address: "上海市普陀区金沙江路 1519 弄",
          create:"张三"
        },
        {
          date: "time",
          name: "库场1",
          address: "上海市普陀区金沙江路 1516 弄",
          create:"张三"
        },
        {
          date: "time",
          name: "库场1",
          address: "库场1"
        },
        {
          date: "time",
          name: "操作工艺",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "time",
          name: "操作工艺",
          address: "上海市普陀区金沙江路 1519 弄",
          create:"张三"
        },
      ]
    };
  },
  methods: {
     // 修改
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
     
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
    },
    // 删除确认
    sub() {
      console.log("确定");
       this.$message.success('删除成功！')
    },
    // 取消
    cancel() {
      
      if(this.dialogFormVisible){
        this.dialogFormVisible = false
      }
      this.$message('已取消！')
    },
    // 修改
    edit(){
       if(this.dialogFormVisible){
        this.dialogFormVisible = false
      }
       this.$message.success('修改成功！')
    },
    // 新增确认
    addOk(){
      if(this.dialogFormVisible){
        this.dialogFormVisible = false
      }
       this.$message.success('新增成功！')
    },
    add() {
      this.dialog = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      
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
  border-radius: 4px 4px 0 0;
  line-height: 50px;
}
.foot {
  background: #ffffff;
  border: 1px solid #e1e4eb;
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
/deep/ .el-table .cell{
  white-space: nowrap;
}
/deep/ .el-form-item--mini .el-form-item__label {
  line-height: 0;
}
/deep/ .el-pagination {
  text-align: right;
}
/deep/ .el-table th>.cell{
      font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #606266;
}
/deep/ .el-table .el-button:focus,.el-table .el-button:hover{
    background-color: #fff;
    border: 1px solid #E1E4EB;
}
/deep/ .el-table .el-button--mini{
  color: #1684F6;
  border-color: transparent;
  background: transparent;
}
/deep/ .el-table th{
  border-left:1px solid #EBEEF5
}
/deep/ .el-table th:nth-child(1){
  border-left:none;
}
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td{
      background: #F5F7FA;
}

/deep/.el-pagination.is-background .btn-next,
/deep/ .el-pagination.is-background .btn-prev,
/deep/ .el-pagination.is-background .el-pager li {
  background: #ffffff;
  border: 1px solid #e1e4eb;
  border-radius: 3px;
  border-radius: 3px;
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
</style>