<template>
    <div class="department">
        <el-card style="display:flex;height:30px;padding:15px;background: #F5F7FA;box-shadow:none;border: #E1E4EB;" >
            <div class="sele" style="width: 100%;display: flex;justify-content: space-between;" id="card">
                <el-form inline  :model="formInline" size='mini'>
                    <el-form-item label="部门名称：">
                        <el-input v-model="formInline.deptName" placeholder=""  style="background-color: #FFFFFF" @input="formInline.deptName=verifyfilter('char',formInline.deptName)"></el-input>
                    </el-form-item>
                    <el-form-item label="部门状态：">
                        <el-select  v-model="formInline.delFlag" filterable clearable placeholder="" style="background-color: #FFFFFF">
                            <el-option label="在用" value="0"></el-option>
                            <el-option label="停用" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" size='mini' icon="el-icon-search">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-button-group class="form_cionBtn">
                    <el-button icon="el-icon-plus" size="mini" @click="create"></el-button>
                </el-button-group>
            </div>
        </el-card>
        <template>
            <el-table
            highlight-current-row
                    :data="tableData"
                    style="width: 100%;margin-bottom: 20px; border-top:none"
                    row-key="id"
                    border
                    stripe
                    default-expand-all
                    :cell-style='cellStyle'
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column
                            prop="name"
                            label="部门名称"
                            sortable min-width="180px">
                    </el-table-column>
                    <el-table-column
                            prop="deptOrCompany"
                            label="公司或部门" min-width="90px">
                    </el-table-column>
                    <el-table-column
                            label="类型">
                        <template slot-scope="scope">
                            {{scope.row.type == "00" ? "内部":"外部" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="manager"
                            label="责任人">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="联系方式" min-width="100px">
                    </el-table-column>
                    <el-table-column
                            label="虚拟公司">
                        <template slot-scope="scope">
                            {{scope.row.isVirtual == "00" ? "虚拟":"非虚拟" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="delFlag" label="状态" width="110">
                        <template slot-scope="scope">
                            <el-button type="success" round plain size="mini" v-if="scope.row.state == '0'">正常</el-button>
                            <el-button type="danger" round plain size="mini" v-if="scope.row.state == '1'">失效</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="270px" header-align="center">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    style="border: none;background-color: transparent;"
                                    @click="handleCreate(scope.$index, scope.row)">
                                    <i class="iconfont icon-liebiaotubiao_liebiaoxinzeng" style="color:#46C484"></i>新增</el-button>
                            <el-button
                                    size="mini"
                                    style="border: none;background-color: transparent;"
                                    @click="handleEdit(scope.$index, scope.row)"><i class="iconfont icon-liebiaotubiao_liebiaobianji" style="color:#2166B2"></i>编辑</el-button>
                            <el-popconfirm @onConfirm="handleDelete(scope.$index, scope.row)" title="您确定删除吗？">
                                <el-button style="border: none;background-color: transparent;" size="mini" slot="reference">
                                    <i class="iconfont icon-tubiao_liebiaoshanchu" style="color:#DA2821"></i> 删除
                                </el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
        </template>
        <!-- 部门抽屉弹出 -->
        <el-drawer
                :visible.sync="dialog"
                :withHeader="false"
                :modal="false"
                direction="rtl"
                size="25%"
                :before-close="handleClose"
                :append-to-body="false"
                custom-class="demo-drawer"
                ref="drawer">
            <div class="header" style="padding-left:10px;line-height:40px">修改部门信息</div>
            <div class="demo-drawer__content" style="margin-top:30px">
                <el-form :model="form" ref="addDeptForm" :rules="companyRules">
                    <el-form-item label="部门名称" :label-width="formLabelWidth" prop="deptName">
                        <el-input v-model="form.deptName" autocomplete="off" size="mini" style="width:180px" @input="form.deptName=verifyfilter('char',form.deptName)"></el-input>
                    </el-form-item>
                    <el-form-item label="所属公司" :label-width="formLabelWidth">
                        <el-input v-model="form.companyName" autocomplete="off" size="mini" style="width:180px" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="部门类型" :label-width="formLabelWidth">
                        <el-select v-model="form.type" placeholder="" filterable size="mini">
                            <el-option label="内部公司" value="00"></el-option>
                            <el-option label="外部公司" value="01"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" prop="sortNum">
                        <el-input v-model="form.sortNum" autocomplete="off" size="mini" style="width:180px" @input="form.sortNum=verifyfilter('char',form.sortNum)"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" style="padding-left: 78px;">
                        <el-switch
                                v-model="form.delFlag"
                                active-text="启用"
                                inactive-text="停用"/>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <el-button @click="cancelForm" style="position: fixed;right: 125px;bottom:10px">取 消</el-button>
                <el-button type="primary" @click="editDeptenter" style="color:#fff;position: fixed;right: 10px;bottom:10px">确定</el-button>
            </div>
        </el-drawer>

        <!-- 新增部门信息 -->
        <el-drawer
                :visible.sync="deptAdd"
                :withHeader="false"
                direction="rtl"
                :before-close="handleClose"
                :modal="false"
                size="25%"
                :append-to-body="false"
                custom-class="demo-drawer"
                ref="drawer">
            <div class="header" style="padding-left:10px;line-height:40px">新增部门信息</div>
            <div class="demo-drawer__content" style="margin-top:30px">
                <el-form :model="deptData" :rules="companyRules" ref="editForm">
                    <el-form-item label="部门名称" :label-width="formLabelWidth" prop="deptName">
                        <el-input v-model="deptData.deptName" autocomplete="off" size="mini" style="width:180px" @input="deptData.deptName=verifyfilter('char',deptData.deptName)"></el-input>
                    </el-form-item>
                    <el-form-item :label="deptOrCom" :label-width="formLabelWidth">
                        <el-input v-model="deptData.companyName" autocomplete="off" size="mini" style="width:180px" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="部门类型" :label-width="formLabelWidth">
                        <el-select v-model="deptData.type" placeholder="" filterable size="mini">
                            <el-option label="内部" value="00"></el-option>
                            <el-option label="外部" value="01"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" prop="sortNum">
                        <el-input v-model="deptData.sortNum" autocomplete="off" size="mini" style="width:180px"  @input="deptData.sortNum=verifyfilter('char',deptData.sortNum)"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" style="padding-left: 78px;">
                        <el-switch
                                v-model="deptData.delFlag"
                                active-text="启用"
                                inactive-text="停用"/>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <el-button @click="deptAdd=false" style="position: fixed;right: 125px;bottom:10px">取 消</el-button>
                <el-button type="primary" @click="addDeptenter" style="color:#fff;position: fixed;right: 10px;bottom:10px">确定</el-button>
            </div>
        </el-drawer>

        <!-- 公司右侧弹出 -->
        <el-drawer
                :visible.sync="dialogtwo"
                direction="rtl"
                :before-close="handleClose"
                title="修改公司信息"
                custom-class="demo-drawer"
                ref="drawer">
            <div class="demo-drawer__content">
                <el-form :model="formtwo" :rules="companyEditRules" ref="companyEditRules">
                    <el-form-item label="公司名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="formtwo.name" autocomplete="off" size="mini" style="width:210px" @input="formtwo.name=verifyfilter('char',formtwo.name)"></el-input>
                    </el-form-item>
                    <el-form-item label="上级公司" :label-width="formLabelWidth">
                        <el-select v-model="formtwo.parentId" placeholder="" filterable size="mini" style="width:210px" >
                            <el-option
                                    v-for="item in companyData"
                                    :key="item.id"
                                    :label="item.companyName"
                                    :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公司类型" :label-width="formLabelWidth" prop="type">
                        <el-select v-model="formtwo.type" placeholder="" filterable size="mini" style="width:210px">
                            <el-option label="内部公司" value="00"></el-option>
                            <el-option label="外部公司" value="01"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否作业公司" :label-width="formLabelWidth" prop="type">
                        <el-radio-group v-model="formtwo.isWorkComp">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="负责人" :label-width="formLabelWidth" prop="manager">
                        <el-input v-model="formtwo.manager" autocomplete="off" size="mini" style="width:210px" @input="formtwo.manager=verifyfilter('char',formtwo.manager)"></el-input>
                    </el-form-item>

                    <el-form-item label="虚拟公司" :label-width="formLabelWidth" prop="isVirtual">
                        <el-radio-group v-model="formtwo.isVirtual" >
                            <el-radio label="虚拟公司" size="mini"></el-radio>
                            <el-radio label="非虚拟公司" size="mini"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="排序列" :label-width="formLabelWidth" prop="sortNum">
                        <el-input v-model="formtwo.sortNum" autocomplete="off" size="mini" style="width:210px" @input="formtwo.sortNum=verifyfilter('char',formtwo.sortNum)"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="formtwo.phone" autocomplete="off" size="mini" style="width:210px" @input="formtwo.phone=verifyfilter('char',formtwo.phone)"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                        <el-input v-model="formtwo.email" autocomplete="off" size="mini" style="width:210px"></el-input>
                    </el-form-item>
                    <el-form-item label="所在地址" :label-width="formLabelWidth">
                        <el-input v-model="formtwo.address" autocomplete="off" size="mini" style="width:210px" @input="formtwo.address=verifyfilter('char',formtwo.address)"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth">
                        <el-switch
                                v-model="formtwo.delFlag"
                                active-text="启用"
                                inactive-text="停用"/>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="formtwo.remark" size="mini" style="width:210px;margin-bottom: 70px;" @input="formtwo.remark=verifyfilter('char',formtwo.remark)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="demo-drawer__footer" style="padding-bottom:15px">
                <el-button @click="dialogtwo=false">取 消</el-button>
                <el-button type="primary" @click="submitComEdit('companyEditRules')" :loading="loading" >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
            </div>
        </el-drawer>

        <!-- 公司新增弹出 -->
        <el-drawer
                :visible.sync="dialogVisible"
                title="新增公司信息"
                :before-close="handleClose"
                direction="rtl"
                size="45%"
                custom-class="demo-drawer"
                ref="drawer">
            <div class="demo-drawer__content">
                <el-col :span="12" style="overflow-y: auto">
                    <el-form :model="ruleForm"
                             :rules="companyRules"
                             ref="ruleForm">
                        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="ruleForm.name" autocomplete="off" size="mini" style="width:210px" @input="ruleForm.name=verifyfilter('char',ruleForm.name)"></el-input>
                        </el-form-item>
                        <el-form-item label="上级公司" :label-width="formLabelWidth">
                            <el-input v-model="ruleForm.parentName" autocomplete="off" size="mini" style="width:210px" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="公司类型" :label-width="formLabelWidth" prop="type">
                            <el-select v-model="ruleForm.type" filterable placeholder="" size="mini" style="width:210px">
                                <el-option label="内部公司" value="00"></el-option>
                                <el-option label="外部公司" value="01"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否作业公司" :label-width="formLabelWidth">
                            <el-radio-group v-model="ruleForm.isWorkComp">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="负责人" :label-width="formLabelWidth" prop="manager">
                            <el-input v-model="ruleForm.manager" autocomplete="off" size="mini" style="width:210px"  @input="ruleForm.manager=verifyfilter('char',ruleForm.manager)"></el-input>
                        </el-form-item>
                        <el-form-item label="虚拟公司" :label-width="formLabelWidth" prop="isVirtual">
                            <el-radio-group v-model="ruleForm.isVirtual" >
                                <el-radio label="虚拟" size="mini"></el-radio>
                                <el-radio label="非虚拟" size="mini"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="排序列" :label-width="formLabelWidth" prop="sortNum">
                            <el-input v-model="ruleForm.sortNum" autocomplete="off" size="mini" style="width:210px" @input="ruleForm.sortNum=verifyfilter('char',ruleForm.sortNum)"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                            <el-input v-model="ruleForm.phone" autocomplete="off" size="mini" style="width:210px" @input="ruleForm.phone=verifyfilter('char',ruleForm.phone)"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                            <el-input v-model="ruleForm.email" autocomplete="off" size="mini" style="width:210px" ></el-input>
                        </el-form-item>
                        <el-form-item label="所在地址" :label-width="formLabelWidth">
                            <el-input v-model="ruleForm.address" autocomplete="off" size="mini" style="width:210px;" @input="ruleForm.address=verifyfilter('char',ruleForm.address)"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" :label-width="formLabelWidth">
                            <el-switch
                                    v-model="ruleForm.delFlag"
                                    active-text="启用"
                                    inactive-text="停用"/>
                        </el-form-item>
                        <el-form-item label="备注" :label-width="formLabelWidth">
                            <el-input type="textarea" v-model="ruleForm.remark" size="mini" style="width:210px;margin-bottom: 70px;" @input="ruleForm.remark=verifyfilter('char',ruleForm.remark)"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <div class="right_title" style="margin-left: 10px;font-size: 14px;font-family: Microsoft YaHei;">上级公司</div>
                    <!-- 树形控件 -->
                    <el-tree
                            :data="companyTree"
                            :props="treeProps"
                            default-expand-all
                            node-key="id"
                            ref="ruleTree"
                            @node-click="handleNodeClick">
                    </el-tree>
                </el-col>
                <el-col>
                    <div class="demo-drawer__footer" style="padding-bottom:15px">
                        <el-button @click="cancelFormtwo" style="margin-right: 20px;">取 消</el-button>
                        <el-button type="primary" @click="companyenter('ruleForm')" :loading="loading" >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                    </div>
                </el-col>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    export default {
        data(){
            let num = /^(0|\+?[1-9][0-9]*)$/;
            let isNum = (rule, value, callback) => {
                if (!num.test(value)) {
                    return callback(new Error('请输入非负整数'))
                } else {
                    callback()
                }
            };
            let phone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9])\d{8}$/;
            let isPhone = (rule, value, callback) => {
                if (!phone.test(value)) {
                    return callback(new Error('请输入正确格式的手机号'))
                } else {
                    callback()
                }
            };
            let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            let isEmail = (rule, value, callback) => {
                if(value==undefined || value.length<=0) callback();
                if (!email.test(value)) {
                    return callback(new Error('请输入正确格式的邮箱地址'))
                } else {
                    callback()
                }
            };
            return{
                companyRules: {
                    deptName:[
                        { required: true, message: '请输入部门名称', trigger: 'blur' }
                    ],
                    isVirtual:[
                        { required: true, message: '请选择虚拟公司', trigger: 'blur' }
                    ],
                    manager:[
                        { required: true, message: '请输入负责人', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    sortNum:[
                        { required: true, message: '请输排序列', trigger: 'blur' },
                        { validator: isNum}
                    ],
                    name:  [
                        { required: true, message: '请输入公司名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    companyCode:  [
                        { required: true, message: '请输入公司编码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    parentId:  [
                        { required: true, message: '请选择上级公司', trigger: 'blur' }
                    ],
                    type:  [
                        { required: true, message: '请选择公司类型', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' },
                        { validator: isPhone}
                    ],
                    email: [{ required: false, message: '请输入正确的邮箱', trigger: 'blur' },{validator:isEmail}]
                },
                companyEditRules: {
                    isVirtual:[
                        { required: true, message: '请选择虚拟公司', trigger: 'blur' }
                    ],
                    manager:[
                        { required: true, message: '请输入负责人', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    sortNum:[
                        { required: true, message: '请输排序列', trigger: 'blur' },
                        { validator: isNum}
                    ],
                    name:  [
                        { required: true, message: '请输入公司名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    companyCode:  [
                        { required: true, message: '请输入公司编码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    parentId:  [
                        { required: true, message: '请选择上级公司', trigger: 'blur' }
                    ],
                    type:  [
                        { required: true, message: '请选择公司类型', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' },
                        { validator: isPhone}
                    ],
                    email: [{validator:isEmail}]
                },
                ruleForm: {
                    name: '',
                    parentId: '',
                    type: '',
                    manager: '',
                    phone: '',
                    email: '',
                    isVirtual: '虚拟',
                    address: '',
                    remark: '',
                    delFlag: true,
                    sortNum:'',
                    parentCode:'',
                    parentName:'',
                    isWorkComp:'0'
                },
                dialogVisible:false,
                dialog: false,
                deptAdd: false,
                dialogtwo:false,
                deptOrCom:'所属公司',
                loading: false,
                dialogtitle:"",
                companyTree:[],
                //树形控件的绑定对象
                treeProps: {
                    children: "children",
                    label: "name"
                },
                form: {
                    delFlag: true,
                    type: "00",
                    companyCode: '',
                    deptName: '',
                    sortNum: '',
                    id: '',
                    companyName:'',
                    deptCode:''
                },
                formtwo: {
                    name: '',
                    parentId: '',
                    type: '',
                    manager: '',
                    phone: '',
                    email: '',
                    isVirtual: '虚拟公司',
                    address: '',
                    remark: '',
                    delFlag: '0',
                    id:'',
                    sortNum: '',
                    companyCode:'',
                    isWorkComp:'0'
                },
                formInline: {
                    id:'',
                    deptName: '',
                    delFlag:''
                },
                deptData: {
                    delFlag: true,
                    type: "00",
                    companyCode: '',
                    deptName: '',
                    sortNum: '',
                    parentCode:'',
                    parentId:'',
                    companyName:''
                },
                companyData: [],
                formLabelWidth: '120px',
                timer: null,
                tableData: []
            }
        },

        created(){
            //查询全部公司部门树形表
            this.$http.get(`/psys-master-service/api/external/sysdept/selecttree?state=`+this.formInline.delFlag
                +(this.formInline.deptName.length>0?"&name="+this.formInline.deptName:""),{})
                .then(res=>{
                    if(res.status==200 ){
                        if(res.data.success){
                            this.tableData = res.data.data;
                        } else{
                            this.$message.error( "查询公司部门信息失败，错误代码："+res.data.code + res.data.msg );
                        }
                    }else{
                        this.$message.error("查询公司部门信息失败。状态码："+res.status);
                    }
                });

            //查询公司列表
            this.$http.get(`/psys-master-service/api/external/public/listcompany`,{})
                .then(res=>{
                    if(res.status==200 ){
                        if(res.data.success){
                            this.companyData = res.data.data;
                        } else{
                            this.$message.error("查询公司列表信息失败错误代码："+res.data.code + res.data.msg);
                        }
                    }else{
                        this.$message.error("查询公司列表信息失败。状态码："+res.status);
                    }
                });
            //查询公司树
            this.$http.get(`/psys-master-service/api/external/sysdept/selectcomptree`,{})
                .then(res=>{
                    if(res.status==200 ){
                        if(res.data.success){
                            this.companyTree = res.data.data;
                        } else{
                            this.$message.error("查询公司列表树失败错误代码："+res.data.code + res.data.msg);
                        }
                    }else{
                        this.$message.error("查询公司列表树失败。状态码："+res.status);
                    }
                });
        },
        methods:{
            handleNodeClick(data){
                this.ruleForm.parentId = data.id;
                this.ruleForm.parentCode = data.companyCode;
                this.ruleForm.parentName = data.name;
            },
            // 关闭抽屉操作
            handleClose(done) {
                this.$confirm("确认关闭？")
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            changeParentCode(){
                var parentCom = this.companyData.filter(i=> i.id===this.ruleForm.parentId);

                this.ruleForm.parentCode = parentCom[0].companyCode;
            },
            //点击取消重置新增框表单校验
            closedept(formName){
                this.$refs[formName].resetFields();
                Object.assign(this.ruleForm, this.$options.ruleForm())
                this.dialogVisible = false;
            },

            editDeptenter(){
                this.$refs['addDeptForm'].validate(async (valid) => {
                    if (valid) {
                        this.$http.put('/psys-master-service/api/external/sysdept/update',{
                            id:this.form.id,
                            companyId: this.form.companyCode,
                            deptName:this.form.deptName,
                            sortNum:this.form.sortNum,
                            deptType: this.form.type,
                            state: this.form.delFlag?"0":"1",
                            deptCode:this.form.deptCode
                        }).then(res=>{
                            if(res.status==200 ){
                                if(res.data.success){
                                    window.sessionStorage.setItem("token",res.headers.token);
                                    this.tableData = res.data.data;
                                    this.$message.success("修改部门成功！");
                                    this.dialog = false;

                                    this.onSubmit();
                                } else{
                                    this.$message.error( "修改部门信息失败，错误代码："+res.data.code + res.data.msg );
                                }
                            }else{
                                this.$message.error("修改部门信息失败。状态码："+res.status);
                            }
                        })
                    }
                });
            },
            addDeptenter(){
                this.$refs['editForm'].validate(async (valid) => {
                    if (valid) {
                        this.$http.post('/psys-master-service/api/external/sysdept/insert',{
                            "companyId": this.deptData.companyCode,
                            "deptName": this.deptData.deptName,
                            "deptType": this.deptData.type,
                            "sortNum": this.deptData.sortNum,
                            "state": this.deptData.delFlag?"0":"1",
                            deptCode: this.deptData.parentCode,
                            parentId: this.deptData.companyCode
                        }).then(res=>{
                            if(res.status==200 ){
                                if(res.data.success){
                                    this.tableData = res.data.data;
                                    this.$message.success("新增部门成功！");

                                    this.onSubmit();
                                } else{
                                    this.$message.error( "新增部门信息失败，错误代码："+res.data.code + res.data.msg );
                                }
                            }else{
                                this.$message.error("新增部门信息失败。状态码："+res.status);
                            }
                        })
                    }
                });

            },
            // 新建
            create(){
                this.dialogVisible = true;
                this.ruleForm.parentId = "";
                this.ruleForm.parentCode = "";
                this.ruleForm.parentName = '';
                this.ruleForm.isWorkComp = '0';
                // this.$refs.ruleForm.resetFields();
            },
            //提交新建表单
            companyenter(formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        var data = {
                            "address": this.ruleForm.address,
                            "parentId": this.ruleForm.parentId,
                            "phone": this.ruleForm.phone,
                            "remark": this.ruleForm.remark,
                            "isVirtual": this.ruleForm.isVirtual=="虚拟公司"?"00":"01",
                            "state": this.ruleForm.delFlag?"0":"1",
                            "email": this.ruleForm.email,
                            "manager": this.ruleForm.manager,
                            "companyType": this.ruleForm.type,
                            "companyName": this.ruleForm.name,
                            companyCode: this.ruleForm.parentCode,
                            sortNum: this.ruleForm.sortNum,
                            isworkcomp:this.ruleForm.isWorkComp
                        };

                        if(data.companyCode=='' || data.parentId==''){
                            let code = this.companyTree[0].companyCode;
                            data.companyCode = code.substr(0,code.length-3);
                            data.parentId = this.companyTree[0].parentId;
                        }
                        this.$http.post(`/psys-master-service/api/external/syscompany/insert`,data).then(res=>{
                            if(res.status==200 ){
                                if(res.data.success){
                                    this.tableData = res.data.data;
                                    this.dialogVisible = false;

                                    this.onSubmit();
                                } else{
                                    this.$message.error( "新增公司信息失败，错误代码："+res.data.code + res.data.msg );
                                }
                            }else{
                                this.$message.error("新增公司信息失败。状态码："+res.status);
                            }
                        })
                    }else{
                        this.$message.error("验证失败！");
                    }
                });
            },
            //单条查询
            onSubmit() {
                //查询全部公司部门树形表
                this.$http.get(`/psys-master-service/api/external/sysdept/selecttree?state=`+this.formInline.delFlag
                    +(this.formInline.deptName.length>0?"&name="+this.formInline.deptName:""),{})
                    .then(res=>{
                        if(res.status==200 ){
                            if(res.data.success){
                                this.tableData = res.data.data;
                            } else{
                                this.$message.error( "查询公司部门信息失败，错误代码："+res.data.code + res.data.msg );
                            }
                        }else{
                            this.$message.error("查询公司部门信息失败。状态码："+res.status);
                        }
                    });
            },
            // 修改
            handleEdit(index,row){
                console.log(row);
                if(row.deptOrCompany=="公司"){
                    this.dialogtwo = true;
                    this.formtwo.name = row.name;
                    this.formtwo.parentId = row.parentId;
                    this.formtwo.type = row.type;
                    this.formtwo.manager = row.manager;
                    this.formtwo.phone = row.phone;
                    this.formtwo.email = row.email;
                    this.formtwo.isVirtual = row.isVirtual=="00"?"虚拟公司":"非虚拟公司";
                    this.formtwo.address = row.address;
                    this.formtwo.remark = row.remark;
                    this.formtwo.delFlag = row.state=="0";
                    this.formtwo.id = row.id;
                    this.formtwo.sortNum = row.sortNum;
                    this.formtwo.companyCode = row.companyCode;
                    this.formtwo.isWorkComp = row.isworkcomp;
                }else if(row.deptOrCompany=="部门"){
                    this.dialog = true;
                    this.form.delFlag = row.delFlag=="0";
                    this.form.type = row.type;
                    this.form.companyCode = row.parentId;
                    this.form.deptName = row.name;
                    this.form.sortNum = row.sortNum;
                    this.form.id = row.id;
                    this.form.deptCode = row.companyCode;
                    this.form.companyName = row.companyName;
                }
            },
            //新增
            handleCreate(index,row){
                this.deptAdd = true;
                this.deptData.parentId = row.id;
                this.deptData.companyCode = row.id;
                this.deptData.parentCode = row.companyCode;
                this.deptData.companyName = row.name;
                if(row.deptOrCompany=="公司"){
                    this.deptOrCom = "所属公司";
                }else if(row.deptOrCompany=="部门"){
                    this.deptData.companyCode = row.companyId;
                    this.deptOrCom = "所属部门";
                }
            },

            handleDelete(index,row){
                if(row.deptOrCompany=="公司"){
                    this.$http.delete(`/psys-master-service/api/external/syscompany/deletebyid?id=`+row.id)
                        .then(res=>{
                            if(res.status==200 ){
                                if(res.data.success){
                                    this.tableData = res.data.data;
                                    this.$message.success("删除公司成功！");

                                    this.onSubmit();
                                } else{
                                    this.$message.error( "删除公司信息失败，错误代码："+res.data.code + res.data.msg );
                                }
                            }else{
                                this.$message.error("删除公司信息失败。状态码："+res.status);
                            }
                        });
                }else if(row.deptOrCompany=="部门"){
                    this.$http.delete(`/psys-master-service/api/external/sysdept/deletebyid?id=`+row.id)
                        .then(res=>{
                            if(res.status==200 ){
                                if(res.data.success){
                                    this.tableData = res.data.data;
                                    this.$message.success("删除部门成功！");

                                    this.onSubmit();
                                } else{
                                    this.$message.error( "删除部门信息失败，错误代码："+res.data.code + res.data.msg );
                                }
                            }else{
                                this.$message.error("删除部门信息失败。状态码："+res.status);
                            }
                        });
                }
            },

            cancelForm() {
                this.loading = false;
                this.dialog = false;
            },

            cancelFormtwo(){
                this.dialogVisible = false;
            },

            submitComEdit( formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        var data = {
                            "address": this.formtwo.address,
                            "parentId": this.formtwo.parentId,
                            "phone": this.formtwo.phone,
                            "remark": this.formtwo.remark,
                            "isVirtual": this.formtwo.isVirtual=="虚拟公司"?"00":"01",
                            "state": this.formtwo.delFlag?"0":"1",
                            "email": this.formtwo.email,
                            "manager": this.formtwo.manager,
                            "companyType": this.formtwo.type,
                            "companyName": this.formtwo.name,
                            "id":this.formtwo.id,
                            sortNum:this.formtwo.sortNum,
                            companyCode:this.formtwo.companyCode,
                            isworkcomp: this.formtwo.isWorkComp
                        };

                        this.$http.put(`/psys-master-service/api/external/syscompany/update`,data).then(res=>{
                            if(res.status==200 ){
                                if(res.data.success){
                                    this.dialogtwo = false;
                                    this.tableData = res.data.data;
                                    this.$message.success("修改公司信息成功！");

                                    this.onSubmit();
                                } else{
                                    this.$message.error( "修改公司信息失败，错误代码："+res.data.code + res.data.msg );
                                }
                            }else{
                                this.$message.error("修改公司信息失败。状态码："+res.status);
                            }
                        })
                    }else{
                        this.$message.error("验证失败！");
                    }
                });

            },

            cellStyle(){
                return 'border-left: none;border-right: none;';
            }
        },
    }
</script>

<style lang="less" scoped>
    /deep/ .el-button--primary {
        background-color: #338ce8;
        border-color: #338ce8;
    }

    /deep/ .el-collapse-item__header{
        background: #F5F7FA;
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

   .department {
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
    /deep/.el-drawer .rtl{
        overflow: no-display;
    }
</style>
