<template>
  <div class="container">
    <!-- 查询表单 -->
    <el-card style="display:flex;height:30px;padding:10px 25px;background: #F5F7FA;box-shadow:none;border: #E1E4EB;" >
      <div class="sele" style="width: 100%;
    display: flex;
    justify-content: space-between;" id="card">
        <el-form size="mini" ref="searchForm" :model="searchForm" inline>
          <el-form-item label="作业公司">
            <el-select style="background-color: #FFFFFF;border: #C8CFDE;" filterable clearable v-model="searchForm.company" placeholder="请选择作业公司">
              <el-option
                      v-for="(item,index) in company"
                      :key="index"
                      :label="item.companyName"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="selectone">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button-group class="form_cionBtn">
          <el-button icon="el-icon-plus" size="mini" @click="create"></el-button>
        </el-button-group>
      </div>
    </el-card>

    <!-- 表格 -->
    <template>
      <el-table :data="tableData"
                :cell-style='cellStyle'
                highlight-current-row
                stripe border style="width:100%;border-top:none" @row-click="rowclick"
                max-height="260"
                >
        <!-- <el-table-column type="selection" width="55" header-align="center">
        </el-table-column> -->
        <el-table-column prop="storehouseName" label="库场名称" >
        </el-table-column>
        <el-table-column prop="shortCode" label="速记码"  >
        </el-table-column>
        <el-table-column prop="storehouseArea" label="库场面积" >
        </el-table-column>
        <el-table-column label="场地类型"  >
          <template slot-scope="scope">
            {{scope.row.storagetype == "0" ? "散杂货":"件杂货" }}
          </template>
        </el-table-column>
        <el-table-column prop="compName" label="所属公司"  >
        </el-table-column>
        <el-table-column prop="unitcapacity" label="单位面积承载吨"  >
        </el-table-column>
        <el-table-column label="是否港内货场"  >
          <template slot-scope="scope">
            {{scope.row.inouttype == "0" ? "是":"否" }}
          </template>
        </el-table-column>
        <el-table-column prop="cargoCapacity" label="杂货容量"  >
        </el-table-column>

        <el-table-column label="操作" header-align="center" width="220">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEditone(scope.$index, scope.row)" class="editBtn">
              <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑</el-button>
            <el-popconfirm
                    @onConfirm="sub(scope.$index,scope.row)"
                    title="您确定删除吗？"
            >
              <el-button size="mini" type slot="reference" class="deleteBtn">
                <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页 -->
    <el-card class="card_pagination" style="border-top: none;
        height: 31px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: none;
        border-radius: 0;">
      <div class="page" style="padding-right: 50px;">
        <el-pagination
                background
                :total="total"
                :current-page="currentPage"
                :page-sizes="[10, 15, 30, 45]"
                :page-size="pagesize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </el-card>
    <!-- 折叠桩脚列表 -->
    <el-collapse accordion v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title" style="background: #F5F7FA;border: 1px solid #E1E4EB;padding-left: 18px;font-size: 14px!important;">
          桩脚
        </template>

        <div class="tzfoot" style="text-align:right;padding:10px 25px 10px 0">
          <el-button icon="el-icon-plus" size="mini" @click="createfoot"></el-button>
        </div>

        <el-table highlight-current-row max-height="260" :data="tableDatatwo" stripe border  style="width: 100%;" :cell-style='cellStyle'>
          <el-table-column  prop="PILE_FOOT_NAME"  label="桩脚名称" >
          </el-table-column>
          <el-table-column  prop="SHORT_CODE"  label="速记码"  >
          </el-table-column>
          <el-table-column  prop="STOREHOUSE_NAME"  label="所属库场"  >
          </el-table-column>
          <el-table-column  prop="PILE_FOOT_LOCATION"  label="桩脚位置"  >
          </el-table-column>
          <el-table-column  label="操作"  width="290">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdittwo(scope.$index, scope.row)" class="editBtn">
                <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑</el-button>
              <el-button size="mini" @click="handleList(scope.$index, scope.row)" class="editBtn">
                <i class="iconfont icon-liebiaotubiao_liebiao" style="color:#9420A8"></i>堆列表</el-button>
              <el-popconfirm
                      @onConfirm="subone(scope.$index,scope.row)"
                      title="您确定删除吗？">
                <el-button size="mini" type slot="reference" class="deleteBtn" >
                  <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-card class="card_pagination" style="border-top: none;height: 31px;padding-top: 10px;padding-bottom: 10px;border-bottom: none;border-radius: 0;">
          <div class="page" style="padding-right: 50px;">
            <el-pagination
                    background
                    :total="pileFootPage.totalNum"
                    :current-page="pileFootPage.currentPage"
                    :page-sizes="[10, 15, 30, 45]"
                    :page-size="pileFootPage.pagesize"
                    @size-change="handlePileSizeChange"
                    @current-change="handlePileFootChange"
                    layout="total, sizes, prev, pager, next, jumper"></el-pagination>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
    <!-- 新增库场 -->
    <el-drawer
            title="新增库场信息"
            :before-close="handleClose"
            :visible.sync="dialogone"
            direction="rtl"
            custom-class="demo-drawer">
      <div class="demo-drawer__content">
        <el-form :model="form"  ref="formDrawer" :rules="rules" >
          <el-form-item label="库场名称：" :label-width="formLabelWidth" prop="storehouseName">
            <el-input v-model="form.storehouseName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" prop="shortCode">
            <el-input v-model="form.shortCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库场面积：" :label-width="formLabelWidth" prop="storehouseArea">
            <el-input v-model="form.storehouseArea" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="场地类型：" :label-width="formLabelWidth" prop="storType">
            <el-select  filterable v-model="form.storageType" placeholder="请选择场类型" style="width:100%">
              <el-option label="散杂货" value="0" ></el-option>
              <el-option label="件杂货" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司：" :label-width="formLabelWidth" prop="compId">
            <el-select v-model="form.compId" filterable placeholder="请选择所属公司" style="width:100%">
              <el-option
                      v-for="(item,index) in company"
                      :key="index"
                      :label="item.companyName"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位面承载吨数：" :label-width="formLabelWidth" prop="unitcapacity">
            <el-input v-model="form.unitcapacity" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否港内货场：" :label-width="formLabelWidth">
            <el-radio-group v-model="form.inouttype">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="杂货容量：" :label-width="formLabelWidth" prop="cargoCapacity">
            <el-input v-model="form.cargoCapacity" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否有桩脚：" :label-width="formLabelWidth" >
            <el-radio-group v-model="form.pileFoot">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="横货位数：" :label-width="formLabelWidth" prop="numHbooth">
            <el-input v-model="form.numHbooth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="纵货位数：" :label-width="formLabelWidth" prop="numVbooth">
            <el-input v-model="form.numVbooth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总货位数：" :label-width="formLabelWidth" prop="numBooth">
            <el-input v-model="form.numBooth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="有效面积：" :label-width="formLabelWidth" prop="effectArea">
            <el-input v-model="form.effectArea" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="有效使用率：" :label-width="formLabelWidth" prop="areaUserate">
            <el-input v-model="form.areaUserate" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库场位置：" :label-width="formLabelWidth" >
            <el-input v-model="form.storehouseLocation" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="片属性：" :label-width="formLabelWidth" >
            <el-radio-group v-model="form.sliceattr">
              <el-radio label="0">属性1</el-radio>
              <el-radio label="1">属性2</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否外租：" :label-width="formLabelWidth">
            <el-radio-group v-model="form.throughput">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="片属性：" :label-width="formLabelWidth" >
            <el-radio-group>
              <el-radio label="0">属性1</el-radio>
              <el-radio label="1">属性2</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="cancelFormone">取 消</el-button>
          <el-button type="primary" @click="submitForm">保 存</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 新增桩脚 -->
    <el-drawer
            title="新增桩脚信息"
            :before-close="handleClose"
            :visible.sync="dialogfour"
            direction="rtl"
            custom-class="demo-drawer">
      <div class="demo-drawer__content">
        <el-form :model="formfoot"  ref="footDrawer" :rules="rules" >
          <el-form-item label="桩脚名称：" :label-width="formLabelWidth" prop="PILE_FOOT_NAME">
            <el-input v-model="formfoot.PILE_FOOT_NAME" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" prop="SHORT_CODE">
            <el-input v-model="formfoot.SHORT_CODE" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属库场：" :label-width="formLabelWidth" prop="STOREHOUSE_NAME">
            <el-input v-model="formfoot.STOREHOUSE_NAME" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="桩脚位置：" :label-width="formLabelWidth" >
            <el-input v-model="formfoot.PILE_FOOT_LOCATION" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="dialogfour=false">取 消</el-button>
          <el-button type="primary" @click="savefoot" >保 存</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 库场编辑页面 -->
    <el-drawer
            title="修改库场信息"
            :before-close="handleClose"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer">
      <div class="demo-drawer__content">
        <el-form :model="form"  ref="editFormDrawer" :rules="rules" >
          <el-form-item label="库场名称：" :label-width="formLabelWidth" prop="storehouseName">
            <el-input v-model="form.storehouseName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" prop="shortCode">
            <el-input v-model="form.shortCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库场面积：" :label-width="formLabelWidth" prop="storehouseArea">
            <el-input v-model="form.storehouseArea" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="场地类型：" :label-width="formLabelWidth" prop="storType">
            <el-select v-model="form.storagetype" filterable placeholder="请选择场类型" style="width:100%">
              <el-option label="散杂货" value="0" ></el-option>
              <el-option label="件杂货" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属公司：" :label-width="formLabelWidth" prop="compId">
            <el-select  filterable v-model="form.compId" placeholder="请选择所属公司" style="width:100%">
              <el-option
                      v-for="(item,index) in company"
                      :key="index"
                      :label="item.companyName"
                      :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位面承载吨数：" :label-width="formLabelWidth" prop="unitcapacity">
            <el-input v-model="form.unitcapacity" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否港内货场：" :label-width="formLabelWidth">
            <el-radio-group v-model="form.inouttype">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="杂货容量：" :label-width="formLabelWidth" prop="cargoCapacity">
            <el-input v-model="form.cargoCapacity" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否有桩脚：" :label-width="formLabelWidth" >
            <el-radio-group v-model="form.pileFoot">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="横货位数：" :label-width="formLabelWidth" prop="numHbooth">
            <el-input v-model="form.numHbooth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="纵货位数：" :label-width="formLabelWidth" prop="numVbooth">
            <el-input v-model="form.numVbooth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总货位数：" :label-width="formLabelWidth" prop="numBooth">
            <el-input v-model="form.numBooth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="有效面积：" :label-width="formLabelWidth" prop="effectArea">
            <el-input v-model="form.effectArea" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="有效使用率：" :label-width="formLabelWidth" prop="areaUserate">
            <el-input v-model="form.areaUserate" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="库场位置：" :label-width="formLabelWidth" >
            <el-input v-model="form.storehouseLocation" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否外租：" :label-width="formLabelWidth">
            <el-radio-group v-model="form.throughput">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="片属性：" :label-width="formLabelWidth" >
            <el-input v-model="form.sliceattr" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveform" >保 存</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 桩脚编辑页面 -->
    <el-drawer
            title="修改桩脚信息"
            :before-close="handleClose"
            :visible.sync="dialogtwo"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
    >
      <div class="demo-drawer__content" id="fiefooter">
        <el-form :model="formfoot" :rules="rules" ref="editFootDrawer">
          <el-form-item label="桩脚名称：" :label-width="formLabelWidth" prop="PILE_FOOT_NAME">
            <el-input v-model="formfoot.PILE_FOOT_NAME" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="速记码：" :label-width="formLabelWidth" prop="SHORT_CODE">
            <el-input v-model="formfoot.SHORT_CODE" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属库场：" :label-width="formLabelWidth" prop="STOREHOUSE_NAME">
            <el-input v-model="formfoot.STOREHOUSE_NAME" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="桩脚位置：" :label-width="formLabelWidth" >
            <el-input v-model="formfoot.PILE_FOOT_LOCATION" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="padding-bottom:15px">
          <el-button @click="cancelFormtwo">取 消</el-button>
          <el-button type="primary" @click="saveformfoot">保 存</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 货位编辑多层嵌套 -->
    <el-drawer
            class="yesgoods"
            title="货位"
            :visible.sync="drawerthree"
            :before-close="handleClose"
            size="50%">
      <div>
        <div class="anniu" >
          <el-button plain icon="el-icon-plus" size="mini" @click="addgoods"></el-button>
          <!-- <el-button plain icon="el-icon-delete" size="mini"></el-button> -->
        </div>
        <el-table highlight-current-row :data="tableDatathree" stripe border style="width:100%" :cell-style='cellStyle'>
          <el-table-column prop="HEAP_NAME" label="堆名称"  >
          </el-table-column>
          <el-table-column prop="SHORT_CODE" label="速记码"  >
          </el-table-column>
          <el-table-column prop="HEAP_LOCATION" label="堆位置"  >
          </el-table-column>
          <el-table-column prop="PILE_FOOT_NAME" label="所属桩脚"  >
          </el-table-column>
          <el-table-column label="操作" header-align="center" min-width="150px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEditonetwo(scope.$index, scope.row)" class="editBtn">
                <i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑</el-button>
              <el-popconfirm
                      @onConfirm="deleteHead(scope.$index,scope.row)"
                      title="您确定删除吗？">
                <el-button size="mini" type slot="reference" class="deleteBtn">
                  <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-card class="card_pagination" style="border-top: none;height: 31px;padding-top: 10px;padding-bottom: 10px;border-bottom: none;border-radius: 0;">
          <div class="page" style="padding-right: 50px;">
            <el-pagination
                    background
                    :total="heap.totalNum"
                    :current-page="heap.currentPage"
                    :page-sizes="[10, 15, 30, 45]"
                    :page-size="heap.pagesize"
                    @size-change="handleHeapSizeChange"
                    @current-change="handleHeaChange"
                    layout="total, sizes, prev, pager, next, jumper"></el-pagination>
          </div>
        </el-card>
        <!-- <el-button @click="innerDrawer = true">打开里面的!</el-button> -->
        <el-drawer
                title="修改货位信息"
                :append-to-body="true"
                :before-close="handleClose"
                :visible.sync="innerDrawer">
          <div class="demo-drawer__content">
            <el-form :model="goodsupdate" :rules="rules" ref="editGoodsDrawer" >
              <el-form-item label="堆名称：" :label-width="formLabelWidth" prop="HEAP_NAME">
                <el-input v-model="goodsupdate.HEAP_NAME" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="速记码：" :label-width="formLabelWidth" prop="SHORT_CODE">
                <el-input v-model="goodsupdate.SHORT_CODE" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="堆位置：" :label-width="formLabelWidth" >
                <el-input v-model="goodsupdate.HEAP_LOCATION" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="所属桩脚" :label-width="formLabelWidth" prop="PILE_FOOT_NAME">
                <el-input v-model="goodsupdate.PILE_FOOT_NAME" autocomplete="off" readonly></el-input>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer" style="padding-bottom:15px">
              <el-button @click="cancelFormthree">取 消</el-button>
              <el-button type="primary" @click="updategoods">保 存</el-button>
            </div>
          </div>
        </el-drawer>
        <!-- 添加货位 -->
        <el-drawer
                title="添加货位信息"
                :append-to-body="true"
                :before-close="handleClose"
                :visible.sync="innerDrawerone">
          <div class="demo-drawer__content" >
            <el-form :model="formgoods"  :rules="rules" ref="goodsDrawer" >
              <el-form-item label="堆名称：" :label-width="formLabelWidth"  prop="heapName">
                <el-input v-model="formgoods.heapName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="速记码：" :label-width="formLabelWidth" prop="shortCode">
                <el-input v-model="formgoods.shortCode" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="堆位置：" :label-width="formLabelWidth" >
                <el-input v-model="formgoods.heapLocation" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="所属桩脚：" :label-width="formLabelWidth"  prop="pileFootName">
                <el-input v-model="formgoods.pileFootName" autocomplete="off" readonly></el-input>
              </el-form-item>

            </el-form>
            <div class="demo-drawer__footer" style="padding-bottom:15px">
              <el-button @click="innerDrawerone=false">取 消</el-button>
              <el-button type="primary" @click="savefgoods">保 存</el-button>
            </div>
          </div>
        </el-drawer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    data() {
      let num = /^[0-9]+(.[0-9]{1,2})?$/;
      let isNum = (rule, value, callback) => {
        if (!num.test(value)) {
          return callback(new Error('请输入非负数,包含小数点小数点后保留两位'))
        } else {
          callback()
        }
      };
      let isNullNum = (rule, value, callback) => {
        if(value==undefined || value.length<=0) callback();
        if (!num.test(value)) {
          return callback(new Error('请输入非负数,包含小数点小数点后保留两位'))
        } else {
          callback()
        }
      };
      let isNull =  (rule, value, callback) => {
        if (value==undefined || value.length<=0) {
          return callback(new Error('请选择场地类型'));
        } else {
          callback()
        }
      };
      return {
        heap:{
          currentPage:1, //初始页
          pagesize:10, //每页显示几条
          totalNum:1
        },
        goodsupdate:{},
        footId:'',
        formgoods:{
          heapName:'',
          shortCode:'',
          pileFootName:'',
          heapLocation:'',
          pileFootId:''
        },
        innerDrawerone:false,
        compid:'', //公司Id
        dialogone:false,
        formfoot:{
          PILE_FOOT_NAME:'',
          SHORT_CODE:'',
          STOREHOUSE_NAME:'',
          PILE_FOOT_LOCATION:'',
          STOREHOUSE_ID:''
        },
        companyid:'',
        cancelFormfours:false,
        dialogfour:false,
        company:[],//所属公司
        currentPage:1, //初始页
        pagesize:10, //每页显示几条
        pileFootPage:{
          currentPage:1, //初始页
          pagesize:10, //每页显示几条
          totalNum:1
        },
        total:0,
        activeNames: ['1'],
        name:'collapse',
        form:{region:'',storageType:'0'},
        dialog:false,
        dialogtwo:false,
        drawerthree:false,
        innerDrawer:false,
        formLabelWidth:'145px',
        substr:'', //多选后ID
        poptitle:"",
        // 查询表单
        searchForm: {
          company: ""
        },
        //编辑表单
        editForm: {
          storehouseName: "", //库场名称
          compName: "", //角色名称
          storehouseArea: "", //类型
          shortCode: "", //权限字符
          storagetype: "", //显示顺序
          compId: "" //备注
        },
        //表格
        tableData: [],
        tableDatatwo:[],
        tableDatathree:[],
        selectRow:'',
        selectFiled:'',
        //前端校验
        rules: {
          HEAP_NAME:[
            { required: true, message: '请输入堆名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          heapName:[
            { required: true, message: '请输入堆名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          pileFootName:[
            { required: true, message: '请输入所属桩脚', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          storehouseName: [
            { required: true, message: '请输入库场名称', trigger: 'blur' },
            { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          ],
          storehouseArea: [
            { required: true, message: '请输入库场面积', trigger: 'blur' },
            {validator:isNum}
          ],
          SHORT_CODE: [
            { required: true, message: '请输入速记码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          shortCode: [
            { required: true, message: '请输入速记码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          compId: [
            { required: true, message: '请选择所属公司', trigger: 'blur' }
          ],
          PILE_FOOT_NAME:[
            { required: true, message: '请输入桩脚名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          unitcapacity: [
            { required: true, message: '请输入单位面承载吨数', trigger: 'blur' },
            {validator:isNum}
          ],
          STOREHOUSE_NAME:[
            { required: true, message: '请输入单位所属库场', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          storehouseId:[
            { required: true, message: '请输入单位所属库场', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          compName: [
            { required: true, message: '请输入单位面积承载数', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          inouttype: [
            { required: true, message: '请输入是否港内货位', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          cargoCapacity: [
            { required: true, message: '请输入杂货容量', trigger: 'blur' },
            {validator:isNum}
          ],
          numHbooth: [
            {validator:isNullNum}
          ],
          numVbooth: [
            {validator:isNullNum}
          ],
          numBooth: [
            {validator:isNullNum}
          ],
          effectArea: [
            {validator:isNullNum}
          ],
          areaUserate: [
            {validator:isNullNum}
          ]
        },
        // 控制编辑对话框的显示和隐藏
        editDialogVisible: false,
        editDialogVisibletwo: false,
        // 菜单权限树形数据
        rightsList: [],
        //树形控件的绑定对象
        treeProps: {
          children: "children",
          label: "label"
        },
        //默认选中的节点数据
        defkey: ["1", "2"],

      };
    },
    methods: {
      handleHeapSizeChange(val){
        this.heap.pagesize = val;
        this.$http.get('/psys-master-service/api/external/mstorehouse/getheapbypilefoot',{
          params:{
            startpage:1,
            pagesize:this.heap.pagesize,
            pilefootid:this.footId
          }
        }).then(res=>{
          this.tableDatathree =  res.data.data.pages;
          this.heap.totalNum = res.data.data.totalNum;
        })
      },
      handleHeaChange(val){
        this.heap.currentPage = val;
        this.$http.get('/psys-master-service/api/external/mstorehouse/getheapbypilefoot',{
          params:{
            startpage:this.heap.currentPage,
            pagesize:this.heap.pagesize,
            pilefootid:this.footId
          }
        }).then(res=>{
          this.tableDatathree =  res.data.data.pages;
          this.heap.totalNum = res.data.data.totalNum
          console.log( res.data.data);
        })
      },
      handleSizeChange(val){
        this.pagesize = val;
        this.$http.get('/psys-master-service/api/external/mstorehouse/getList',{
          params:{
            startpage:1,
            pagesize:this.pagesize
          }
        }).then(res=>{
          this.tableData =  res.data.data.result.pages;
          this.total = res.data.data.result.totalNum;
        })
      },
      handlePileSizeChange(val){
        this.pileFootPage.pagesize = val;
        this.$http.get('/psys-master-service/api/external/mstorehouse/getsublist',{
          params:{
            startpage:1,
            pagesize:this.pileFootPage.pagesize,
            id:this.companyid
          }
        }).then(res=>{
          this.tableDatatwo =  res.data.data.result.pages;
          this.pileFootPage.totalNum = res.data.data.result.totalNum
        })
      },
      handlePileFootChange(newPage) {
        this.pileFootPage.currentPage = newPage;
        this.$http.get('/psys-master-service/api/external/mstorehouse/getsublist',{
          params:{
            startpage:this.pileFootPage.currentPage,
            pagesize:this.pileFootPage.pagesize,
            id:this.companyid
          }
        }).then(res=>{
          this.tableDatatwo =  res.data.data.result.pages;
          this.pileFootPage.totalNum = res.data.data.result.totalNum
        })
      },
      cellStyle(){
        return 'border-left: none;border-right: none;';
      },
      deleteHead(index,row){
        this.$http.delete(`/psys-master-service/api/external/mstorehouse/deleteheapbypilefoot?id=${row.ID}`)
                .then(res=>{
                  if(res.data.code == "0000"){
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.handleList(1,this.selectFiled);
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })
      },
      createfoot(){
        this.dialogfour = true;
        this.formfoot.PILE_FOOT_NAME = '';
        this.formfoot.SHORT_CODE = '';
        this.formfoot.PILE_FOOT_LOCATION = '';
      },
      handleChange(val){
        this.compid = val
      },
      //修改库场信息
      saveform(){
        this.$refs['editFormDrawer'].validate(async (valid) => {
          if (valid) {
            var comData = this.company.filter(i=>i.id===this.form.compId);
            this.$http.put('/psys-master-service/api/external/mstorehouse/updateOne',{
              "id":this.form.id,
              "storehouseName":this.form.storehouseName,
              "shortCode":this.form.shortCode,
              "storehouseArea":this.form.storehouseArea,
              "storagetype":this.form.storagetype,
              "compId":this.form.compId,
              "compName": comData[0].companyName,
              "unitcapacity":this.form.unitcapacity,
              "inouttype":this.form.inouttype,
              "cargoCapacity":this.form.cargoCapacity,
              "pileFoot":this.form.pileFoot,
              "numHbooth":this.form.numHbooth,
              "numVbooth":this.form.numVbooth,
              "numBooth":this.form.numBooth,
              "effectArea":this.form.effectArea,
              "areaUserate":this.form.areaUserate,
              "storehouseLocation":this.form.storehouseLocation,
              "throughput":this.form.throughput,
              "sliceattr":this.form.sliceattr
            })
                    .then(res=>{
                      if(res.data.success){
                        this.$message({
                          message: '修改成功',
                          type: 'success'
                        });
                      }else{
                        this.$message({
                          message: '修改失败',
                          type: 'warning'
                        });
                      }
                    })
            this.dialog = false;
          }else{
            this.$message.error("表单验证失败");
          }
        });
      },
      //桩脚编辑页面
      saveformfoot(){
        this.$refs['editFootDrawer'].validate(async (valid) => {
          if (valid) {
            this.$http.put('/psys-master-service/api/external/mstorehouse/updatepilefoot',{
              "id":this.formfoot.ID,
              "pileFootName":this.formfoot.PILE_FOOT_NAME,
              "shortCode":this.formfoot.SHORT_CODE,
              "storehouseId":this.formfoot.STOREHOUSE_ID,
              "pileFootLocation":this.formfoot.PILE_FOOT_LOCATION
            })
                    .then(res=>{
                      if(res.data.code == "0000"){
                        this.dialogtwo = false;
                        this.$message({
                          "message":"修改成功",
                          "type":"success"
                        })
                      }
                    })
          }else{
            this.$message.error("表单验证失败");
          }
        });

      },
      //桩脚添加
      savefoot(){
        this.$refs['footDrawer'].validate(async (valid) => {
          if (valid) {
            var data = {
              pileFootLocation: this.formfoot.PILE_FOOT_LOCATION,
              pileFootName: this.formfoot.PILE_FOOT_NAME,
              shortCode: this.formfoot.SHORT_CODE,
              storehouseId: this.formfoot.STOREHOUSE_ID,
            };
            this.$http.post("/psys-master-service/api/external/mstorehouse/addmbasepilefoot",data)
                    .then(res=>{
                      if(res.data.code == "0000"){
                        this.dialogfour = false;
                        this.$message({
                          message: '添加成功',
                          type: 'success'
                        });
                        this.rowclick(this.selectRow);
                      }else{
                        this.$message.error(res.data.msg);
                      }
                    })
          }else{
            this.$message.error("表单校验失败");
          }
        });

      },
      //添加货位
      addgoods(){
        this.innerDrawerone = true;
        this.formgoods.heapName ='';
        this.formgoods.shortCode='';
        this.formgoods.heapLocation = '';
      },
      //货位表单提交
      savefgoods(){
        this.$refs['goodsDrawer'].validate(async (valid) => {
          if (valid) {
            var formData = {
              heapName:this.formgoods.heapName,
              pileFootId:this.formgoods.pileFootId,
              shortCode:this.formgoods.shortCode,
              heapLocation:this.formgoods.heapLocation
            }
            this.$http.post('/psys-master-service/api/external/mstorehouse/addmbaseheap',formData)
                    .then(res=>{
                      console.log(res);
                      if(res.data.code == "0000"){
                        this.innerDrawerone = false;
                        this.$message({
                          message: '新增成功',
                          type: 'success'
                        });
                        this.handleList(1,this.selectFiled);
                      }else{
                        this.$message.error(res.data.msg);
                      }
                    })
          }else{
            this.$message.error("表单验证失败");
          }
        });
      },
      cancelFormone(){
        this.dialogone = false;
        this.$http.get(`/psys-master-service/api/external/mstorehouse/getList?startpage=1&pagesize=${this.pagesize}`).then(res=>{
          this.tableData = res.data.data.result.pages;
          this.total = res.data.data.totalNum;
        })
      },
      handleEdittwo(index,row){
        this.dialogtwo = true
        this.formfoot = row
      },
      cancelFormtwo(){
        this.dialogtwo = false;
      },
      cancelFormthree(){
        this.innerDrawer = false;

      },
      cancelForm(){
        this.dialog = false
      },
      handleEditone(index,row){
        this.dialog = true;
        this.form = row
      },
      handleEditonetwo(index,row){
        this.innerDrawer = true;
        this.goodsupdate = row;
      },
      updategoods(){
        this.$refs['editGoodsDrawer'].validate(async (valid) => {
          if (valid) {
            this.$http.put('/psys-master-service/api/external/mstorehouse/updatembaseheap',{
              "id":this.goodsupdate.ID,
              "heapName":this.goodsupdate.HEAP_NAME,
              "shortCode":this.goodsupdate.SHORT_CODE,
              "pileFootId":this.goodsupdate.PILE_FOOT_ID,
              heapLocation:this.goodsupdate.HEAP_LOCATION
            })
                    .then(res=>{
                      if(res.data.code == "0000"){
                        this.innerDrawer = false,
                                this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                      }else{
                        this.$message.error(res.data.msg);
                      }
                    })
          }else{
            this.$message.error("表单验证失败");
          }
        });
      },
      handleList(index,row){
        this.selectFiled = row;
        this.footId = row.ID
        this.drawerthree = true;
        this.formgoods.pileFootName = row.PILE_FOOT_NAME;
        this.formgoods.pileFootId = row.ID;
        this.$http.get(`/psys-master-service/api/external/mstorehouse/getheapbypilefoot?startpage=1&pagesize=10&pilefootid=${row.ID}`)
                .then(res=>{
                  console.log(res);
                  if(res.data.code == "0000"){
                    this.tableDatathree = res.data.data.pages;
                    this.heap.totalNum = res.data.data.totalNum;
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })
      },
      subone(index,row){
        this.$http.delete(`/psys-master-service/api/external/mstorehouse/deletepilefootbystorehouse?id=${row.ID}`)
                .then(res=>{
                  if(res.data.code == "0000"){
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.rowclick(this.selectRow);
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })
      },
      // 关闭抽屉操作
      handleClose(done) {
        this.$confirm("确认关闭？")
                .then(_ => {
                  done();
                })
                .catch(_ => {});
      },
      //查询所有列表数据
      getFieldlist(){
        this.$http.get(`/psys-master-service/api/external/mstorehouse/getList?startpage=1&pagesize=${this.pagesize}`).then(res=>{
          this.tableData =  res.data.result;
          this.total = res.data.data.totalNum;
        })
      },
      rowclick(val){
        this.selectRow = val;
        this.companyid = val.id;
        this.formfoot.STOREHOUSE_NAME = val.storehouseName;
        this.formfoot.STOREHOUSE_ID = val.id;
        this.$http.get(`/psys-master-service/api/external/mstorehouse/getsublist?startpage=1&pagesize=${this.pileFootPage.pagesize}&id=${this.companyid}`)
                .then(res=>{
                  if(res.data.code == "0000"){
                    this.tableDatatwo = res.data.data.result.pages;
                    this.pileFootPage.totalNum = res.data.data.result.totalNum;
                  }
                })
      },
      //多选删除
      delselection(){
        this.$http.delete(`/psys-master-service/api/external/mstorehouse/deleteById?id=${this.substr}`)
                .then(res=>{
                  if(res.data.success){
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.$http.get(`/psys-master-service/api/external/mstorehouse/getList?startpage=1&pagesize=${this.pagesize}`).then(res=>{
                      this.tableData = res.data.data.result.pages;
                      this.total = res.data.data.totalNum;
                    })
                  }
                })
      },

      //提交新增库场表单
      submitForm() {
        console.log(this.form);
        this.$refs['formDrawer'].validate(async (valid) => {
          if (valid) {
            var comData = this.company.filter(i=>i.id===this.form.compId);
            var data = {
              "areaUserate": this.form.areaUserate==undefined?"":this.form.areaUserate,
              "cargoCapacity": this.form.cargoCapacity,
              "compId": this.form.compId,
              "compName": comData[0].companyName,
              "effectArea": this.form.effectArea==undefined?"":this.form.effectArea,
              "inouttype": this.form.inouttype==undefined?"":this.form.inouttype,
              "numBooth": this.form.numBooth==undefined?"":this.form.numBooth,
              "numHbooth": this.form.numHbooth==undefined?"":this.form.numHbooth,
              "numVbooth": this.form.numVbooth==undefined?"":this.form.numVbooth,
              "pileFoot": this.form.pileFoot==undefined?"":this.form.pileFoot,
              "shortCode": this.form.shortCode,
              "sliceattr": this.form.sliceattr==undefined?"":this.form.sliceattr,
              "storagetype": this.form.storageType,
              "storehouseArea": this.form.storehouseArea,
              "storehouseLocation": this.form.storehouseLocation==undefined?"":this.form.storehouseLocation,
              "storehouseName": this.form.storehouseName,
              "throughput": this.form.throughput==undefined?"":this.form.throughput,
              "unitcapacity": this.form.unitcapacity
            };
            this.$http.post('/psys-master-service/api/external/mstorehouse/addmStorehouse',data).then(res=>{
              if(res.data.code == "0000"){
                this.dialogone = false;
                this.selectone();
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });

              }else{
                this.$message({
                  message: '新增失败',
                  type: 'error'
                });
              }
            })
          }else{
            this.$message({
              message: '校验失败',
              type: 'error'
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 新增菜单
      create(){
        this.dialogone = true;
        this.form = {}
        this.form.storageType='0';
      },
      // 查询单个
      selectone(){
        this.$http.get(`/psys-master-service/api/external/mstorehouse/getList?compid=${this.searchForm.company}&startpage=1&pagesize=${this.pagesize}`)
                .then(res=>{
                  this.tableData = res.data.data.result.pages;
                  this.tableDatatwo = new Array();
                  this.total = res.data.data.totalNum;
                })
      },
      // 编辑
      handleEdit(index, row) {
        this.editDialogVisibletwo = true;
        this.poptitle = "修改信息";
        this.editForm = row;
      },

      // 根据id删除用户角色
      sub(index,row) {
        this.$http.delete(`/psys-master-service/api/external/mstorehouse/deleteById?id=${row.id}`)
                .then(res=>{
                  if(res.data.success == true){
                    this.selectone();
                  }else{
                    alert(res.data.msg)
                  }
                })
      },
      //分页 监听页码值改变
      handleCurrentChange(newPage) {
        this.currentPage = currentPage;
        this.$http.get('/psys-master-service/api/external/mstorehouse/getList',{
          params:{
            startpage:this.currentPage,
            pagesize:this.pagesize
          }
        }).then(res=>{
          this.tableData =  res.data.data.result.pages;
          this.total = res.data.data.result.totalNum
        })
      }
    },
    //页面初始化查询列表
    created(){
      this.$http.get('/psys-master-service/api/external/mstorehouse/getList',{
        params:{
          startpage:1,
          pagesize:this.pagesize
        }
      }).then(res=>{
        this.tableData =  res.data.data.result.pages;
        this.total = res.data.data.result.totalNum
      })

      // 公共所属公司
      this.$http.get('/psys-master-service/api/external/public/listworkcompany')
              .then(res=>{
                this.company = res.data.data
              })
    }
  };
</script>
<style lang="less" scoped>

  /deep/ .el-collapse-item__header{
    background: #F5F7FA;
  }
  /deep/ .el-table {
    overflow: auto;
  }
  /deep/ .el-table thead{
    font-size: 14px;
    font-family: Microsoft YaHei;
    color: #606266;
  }
  /deep/ #el-drawer__title{
    background: #F5F7FA;
  }
  #fiefooter /deep/ .el-select{
    width:100%
  }
  .yesgoods /deep/ .el-drawer__body{
    padding-top: 0;
  }
  .yesgoods .anniu{
    text-align: right;
    padding: 10px 20px 10px;
  }
  #card /deep/ .el-form-item__content{
    margin: 0;
  }
  /deep/ .el-button+.el-button{
    margin-left: 0;
  }
  /deep/ .el-drawer__header{
    margin: 0;
    padding: 16px;
  }

  /deep/ .el-drawer__body{
    overflow: auto;
    padding-top: 30px;
  }
  /deep/ .el-form-item__content{
    margin: 0 51px 0 134px;
  }
  /deep/ .el-collapse-item__header{
    padding-left: 19px;
    font-size: 16px;
  }
  /deep/ .el-breadcrumb{
    font-size: 16px;
  }
  /* 第一行居中 */
  .el-table td:first-child,
  el-table th:first-child,
  .el-table td:last-child,
  el-table th:last-child {
    text-align: center !important;
  }
</style>
<style lang="less" scoped>

  .container {
    .form_card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    /deep/.el-card__body{
      width: 100%;
      padding: 0;
      border-radius: 0;
    }
    /deep/.el-pagination.is-background .btn-next,
    /deep/ .el-pagination.is-background .btn-prev,
    /deep/ .el-pagination.is-background .el-pager li {
      background: #ffffff;
      border: 1px solid #e1e4eb;
      border-radius: 3px;
      border-radius: 3px;
    }
    .editBtn,
    .deleteBtn{
      color: #1684f6;
      border-color: transparent;
      background: transparent;
    }
    //分页
    .card_pagination {
      text-align: right;
    }
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
      white-space: nowrap;
    }
  }
  .el-table{
    margin-bottom:0 !important;
  }
  .el-table td {
    padding:10px 0;
    text-align: left;
  }
  /deep/ .el-button--primary {
    background-color: #338ce8;
    border-color: #338ce8;
  }
</style>