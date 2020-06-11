import Vue from 'vue'
import Router from 'vue-router'

import Login from "@/components/login/Login.vue"

import HomePage from '@/components/HomePage.vue'

import Home from '@/components/home/Home.vue'
// 角色管理
import RoleManage from '@/components/power/RoleManage.vue'
//交通工具
import trafficToolComponent from "@/components/traffic/trafficTool.vue";
// 工艺
import TechnologyComponent from "@/components/operation/Technology.vue";
// 客户
import CustomerComponent from "@/components/customer/Customer.vue";
// 字典
import DictionariesComponent from "@/components/dictionaries/Dictionaries.vue";
// 作业过程

import jobproComponent from "@/components/task/Jobpro.vue";

// 作业停时
import worktimeComponent from "@/components/task/worktime.vue";

// 泊位信息组件
import GarageInfo from "@/components/garage/garageInfoList.vue";

// 缆桩信息组件
import BittInfo from '../components/garage/bittInfoList.vue';

import UserInfoManage from "@/components/userInfo/UserInfomanage.vue";

import MenuManage from "@/components/menuManage/Menumanage.vue";

//库场
import Field from "@/components/storehouse/Field.vue"

import Foot from "@/components/storehouse/Foot.vue"

import Heap from "@/components/storehouse/Heap.vue"
//公司部门
import Department from "@/components/company/Department.vue"

import GoodsManagement from "@/components/goods/GoodsManagement"
// 潮汐设置
import Tide from "@/components/Tide/tideInfo.vue"

// 海轮管理
import SeagoingVessel from "@/components/seagoingvessel/SeagoingVessel"
// 驳船管理
import Barge from "@/components/boship/Barge"
//机械管理

import MachilbeManage from "@/components/mechan/Machibemabage.vue"

// 泊位上报
import Berth from "@/components/berth/berth.vue"

// 设备维保

import Equipment from "@/components/equipment/Equipment.vue"

// 人员信息

import Human from "@/components/human/Human.vue"

// 内部委托

import Internal from "@/components/internal/Internal.vue"

// 外服信息
import Outer from "@/components/outer/Outer.vue"

// 杂作业申请
import Workza from "@/components/workza/Workza.vue"

//机械信息
import Mechanics from "@/components/mechanics/Mechanics.vue"

// 拖轮信息
import Tugboat from "@/components/tugboat/tugboat.vue"
import LinkHome from "@/components/externalLink/LinkHome.vue"

Vue.use(Router)


const routes = [

    {
        path: '/',
        redirect: '/login'
    },

    //登录
    {
        path: '/login',
        component: Login
    },

    // 主页目录
    {
        path: '/homePage',
        component: HomePage,
        redirect: '/home',
        children: [
            //主页
            {
                path: '/home',
                component: Home,
                name: 'home',
                meta: {
                    title: '主页',
                }
            },
            //角色管理
            {
                path: '/roleManage',
                component: RoleManage,
                name: 'roleManage',
                meta: {
                    title: '角色管理'
                }
            },
            // 交通工具
            {
                path: '/trafficTool',
                component: trafficToolComponent,
                name: 'trafficTool',
                meta: {
                    title: '交通工具',
                }
            },
            // 作业停时

            {
                path: '/worktime',
                component: worktimeComponent,
                name: 'worktime',
                meta: {
                    title: '作业停时'
                }
            },
            // 操作工艺
            {
                path: '/Technology',
                component: TechnologyComponent,
                name: 'Technology',
                meta: {
                    title: '操作工艺'
                }
            },
            // 客户资料
            {
                path: '/customer',
                component: CustomerComponent,
                name: 'customer',
                meta: {
                    title: '客户资料',
                }
            },
            // 字典管理
            {
                path: '/dictionaries',
                component: DictionariesComponent,
                name: 'dictionaries',
                meta: {
                    title: '字典管理',
                }
            },
            // 作业过程
            {
                path: '/jobpro',
                component: jobproComponent,
                name: 'jobpro',
                meta: {
                    title: ' 作业过程'
                }
            }, // 泊位信息
            {
                path: '/garageInfo',
                component: GarageInfo,
                name: 'garageInfo',
                meta: {
                    title: '泊位管理'
                }
            }, // 缆桩信息
            {
                path: '/bittInfo',
                component: BittInfo,
                name: 'bittInfo',
                meta: {
                    title: '缆桩信息'
                }
            },
            // 用户信息管理
            {
                path: '/userInfoManage',
                component: UserInfoManage,
                name: 'userInfoManage',
                meta: {
                    title: '用户信息管理'
                }
            },
            //菜单管理
            {
                path: '/menuManage',
                component: MenuManage,
                name: 'menuManage',
                meta: {
                    title: '菜单管理',
                }
            },
            // 库场
            {
                path: '/Field',
                component: Field,
                name: 'Field',
                meta: {
                    title: '库场'
                }
            },
            // 桩脚
            {
                path: '/Foot',
                component: Foot,
                name: 'Foot',
                meta: {
                    title: '桩脚'
                }
            },
            // 堆列
            {
                path: '/Heap',
                component: Heap,
                name: 'Heap',
                meta: {
                    title: '堆列'
                }
            },
            // 公司部门
            {
                path: '/Department',
                component: Department,
                name: 'Department',
                meta: {
                    title: '公司部门'
                }
            },
            // 货物管理
            {
                path: '/goodsmanagement',
                component: GoodsManagement,
                name: 'goodsmanagement',
                meta: {
                    title: '货物管理'
                }
            },
            //  潮汐设置
            {
                path: '/tideInfo',
                component: Tide,
                name: 'Tide',
                meta: {
                    title: '潮汐设置'
                }
            },
            // 海轮管理
            {
                path: '/seagoingvessel',
                component: SeagoingVessel,
                name: 'seagoingvessel',
                meta: {
                    title: '海轮管理'
                }
            },
            // 驳船管理
            {
                path: '/barge',
                component: Barge,
                name: 'barge',
                meta: {
                    title: '驳船管理'
                }
            },
            //机械管理
            {
                path: '/machilbeManage',
                component: MachilbeManage,
                name: 'MachilbeManage',
                meta: {
                    title: '机械管理'
                }
            },

            // 泊位信息上报
            {
                path: '/berth',
                component: Berth,
                name: 'berth',
                meta: {
                    title: '泊位信息'
                }
            },
            // 设备维保
            {
                path: '/equipment',
                component: Equipment,
                name: 'equipment',
                meta: {
                    title: '设备维保'
                }
            },
            // 人员信息
            {
                path: '/human',
                component: Human,
                name: 'human',
                meta: {
                    title: '人员信息'
                }
            },
            // 内部委托
            {
                path: '/internal',
                component: Internal,
                name: 'internal',
                meta: {
                    title: '内部委托'
                }
            },
            // 外服信息
            {
                path: '/outer',
                component: Outer,
                name: 'outer',
                meta: {
                    title: '外服信息'
                }
            },
            // 杂作业申请
            {
                path: '/workza',
                component: Workza,
                name: 'workza',
                meta: {
                    title: '杂作业申请'
                }
            },
            // 机械信息
            {
                path: '/mechanics',
                component: Mechanics,
                name: 'mechanics',
                meta: {
                    title: '机械信息'
                }
            },
            // 拖轮信息
            {
                path: '/tugboat',
                component: Tugboat,
                name: 'tugboat',
                meta: {
                    title: '拖轮信息'
                }
            },
            {
                path: '/externalLink',
                component: LinkHome,
                name: 'LinkHome',
                children: [{
                    path: '/externalLink_jd',
                    meta: {
                        link: 'http://192.168.75.87:8080/webroot/decision/view/report?viewlet=PPM_CLOUD/business/作业公司营收分析V1.0.frm',
                        title: '作业公司营收分析'
                    }
                }]
            },
        ]
    },
]

const router = new Router({
    routes
})

export default router