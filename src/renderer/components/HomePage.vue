<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="headstyle">
        <!-- 左上角header -->
        <div class="header-left" :class="{ 'header-left-ac': isCollapse }">
          <img src="../assets/icon/logo@2x.png" v-show="isCollapse" alt srcset />
          <!-- <label v-show="!isCollapse">基础数据子系统</label> -->
          <i class="iconfont icon-logo-011" v-show="!isCollapse"></i>
        </div>
        <div style="width:23px"></div>
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-top_shouqi" v-show="!isCollapse" title="收起" style="color:#fff"></i>
          <i class="iconfont icon-top_zhankai" v-show="isCollapse" title="展开" style="color:#fff"></i>
        </div>
        <!-- header右上角 -->
        <div class="imgBox" :class="{ activ: isCollapse }">
          <div style="padding-left: 1rem;">
            <!-- 跳转面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="item in breadList"
                :to="{ path: item.path }"
                :key="item.name"
              >{{ item.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="display:flex">
            <div class="searchBox">
              <i class="el-icon-search"></i>
              <el-input v-model="searchName" placeholder="搜索..."></el-input>
            </div>
            <div class="compzzz">
              <div class="ava">
                <img src="../assets/icon/tximg.svg" width="28" />
              </div>
              <p>{{userName}}</p>
              <!-- <el-select  v-model="">
                <el-option
                  v-for="item in compData"
                  :key="item.companyCode"
                  :label="item.companyName"
                  :value="item.companyCode"
                ></el-option>
              </el-select>-->
              <!-- <el-menu  :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                  <el-submenu index="2">
                    <template slot="title">{{companyName}}</template>
                    <div v-for="item in compData" :key="item.id">
                      <el-menu-item  index="item.companyCode">{{item.companyName}}</el-menu-item>
                    </div>
                  </el-submenu>
              </el-menu>-->
            </div>
            <div style="background:#5d90c2;height:14px;width:1px;margin: 18px 0px;"></div>
            <div class="icon">
              <i class="el-icon-message"></i>
            </div>
            <div style="background:#5d90c2;height:14px;width:1px;margin: 18px 0px;"></div>
            <div @click="loginOut" class="icon">
              <i class="el-icon-switch-button">退出</i>
            </div>
          </div>
        </div>
      </div>
    </el-header>
    <!-- 主题内容 -->
    <el-container>
      <!--左侧导航-->
      <el-aside>
        <div class="sideleft">
          <!--导航菜单-->
          <el-menu
            default-active="/home"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            unique-opened
            router
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuData" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="'iconfont '+item.icon"></i>
                <span>{{item.menuName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subItem.url"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="routeChange(subItem)"
              >
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <i :class="'iconfont '+subItem.icon"></i>
                  <span>{{subItem.menuName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <!-- 右侧tab搜索路由内容 -->
      <el-main>
        <div>
          <template>
            <el-tag
              :class="{'activTag':(tagClo===index || item.path.indexOf(leftPath) != -1)}"
              size="small"
              :closable="item.name==='首页'?false:true"
              v-for="(item,index) in path"
              :key="index"
              @click="tagClick(item.path,index)"
              @close="removeTag(index)"
            >{{item.name}}</el-tag>
          </template>
        </div>
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isCollapse: false, // 展开left
      collapsed: false, // 同步切换header和left
      searchName: '', // 搜索功能
      activeIndex: '1',
      tagClo: null,
      compData: [],
      userName: '',
      leftPath: '', // 判断关联tab
      // 菜单数据
      menuData: [],
      // 面包屑
      breadList: [{ meta: { title: '首页' }, name: 'home', path: '/home' }],
      // 存放路径数组的
      path: [
        {
          name: '首页',
          path: '/home'
        },
        {
          name: '泊位信息',
          path: '/berth'
        },
        {
          name: '设备维保',
          path: '/equipment'
        },
        {
          name: '人员信息',
          path: '/human'
        },
        {
          name: '内部委托',
          path: '/internal'
        },
        {
          name: '外服信息',
          path: '/outer'
        },
        {
          name: '杂作业申请',
          path: '/workza'
        },
        {
          name: '机械信息',
          path: '/mechanics'
        },
        {
          name: '拖轮信息',
          path: '/tugboat'
        }
      ],
      pathItem: {
        name: '首页',
        path: '/home'
      }
    }
  },
  mounted() {
    this.userName = window.sessionStorage.getItem('userName')
    this.getCompData()
    this.getMenuData()
    this.path = [
      {
        name: '首页',
        path: '/home'
      }
    ]
    // this.$router.push('/home')
  },
  methods: {
    async getCompData() {
      const that = this
      const token = window.sessionStorage.getItem('token')
      const res = await this.$http.get(
        `/psys-master-service/api/external/public/listcompany`
      )
      if (res.status == 200) {
        if (res.data.success) {
          // console.log(res11.data.data);
          this.compData = res.data.data
        }
      }
    },
    async getMenuData() {
      const that = this
      const token = window.sessionStorage.getItem('token')
      const res = await this.$http.get(
        '/psys-master-service/api/external/sysmenu/listmenubyacc'
      )
      if (res.status == 200) {
        if (res.data.success) {
          // console.log(res.data.data,'data')
          this.menuData = res.data.data
        }
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    //折叠导航栏
    collapse: function() {
      this.isCollapse = !this.isCollapse
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {
      this.path.slice(key)
    },
    // 动态路由
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      // console.log(matched.title);
      this.breadList = matched
      // if (this.breadList.length === 0) {//多个菜单s
      //   this.breadList = matched;
      // } else {
      //   this.breadList.push(matched[0]);
      //   let obj = {};
      //   this.breadList = this.breadList.reduce((preVal, curVal) => {
      //     obj[curVal.name]
      //       ? ""
      //       : (obj[curVal.name] = true && preVal.push(curVal));
      //     return preVal;
      //   }, []);
      // }
      // console.log(this.breadList);
    },
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    tagClick(item, index) {
      this.tagClo = index
      this.leftPath = null
      // console.log(item)
      this.$router.push(item)
    },
    removeTag(tag) {
      this.path.splice(tag, 1)
      let lastRouter = this.path.slice(-1)
      let item = lastRouter[0].path
      this.$router.push(item)
    },
    // 点击二级菜单触发的函数
    routeChange(n) {
      // console.log(n)
      this.leftPath = n.url
      this.tagClo = null
      this.pathItem['name'] = n.menuName
    },
    // 动态添加tag的函数
    addTag(to) {
      // 只有pathItem中的name不为空的时候,才可以进行下列操作
      if (this.pathItem['name']) {
        // 为pathItem项目中的path属性进行赋值
        this.pathItem['path'] = to.fullPath
        this.path.push(this.pathItem)
        // 此处为存放tag数据进行去重
        var hash = {}
        this.path = this.path.reduce(function(arr, current) {
          hash[current.name]
            ? ''
            : (hash[current.name] = true && arr.push(current))
          return arr
        }, [])
        // console.log(this.path);
        // 添加完成之后,重新对pathItem进行赋值
        this.pathItem = {
          name: '首页',
          path: '/home'
        }
      }
    }
  },
  watch: {
    $route: function(to) {
      // console.log(to);
      // 动态添加tag
      this.addTag(to)
      this.getBreadcrumb()
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.compzzz /deep/ .el-select {
  background: transparent;
  width: 137px;
}
.compzzz /deep/ .el-input--suffix .el-input__inner {
  border: none;
  color: #fff;
}
.compzzz /deep/ .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #1d4b7c;
}
/deep/ .el-input {
  background: transparent;
}
/deep/ .el-input__inner {
  background: transparent;
}
/deep/ .el-header /deep/ .el-select:hover .el-input__inner {
  color: #fff;
}
.el-header {
  background: #3b72a8;
  height: 50px !important;
  box-shadow: 0 3px 6px 0 #eef0f5;
  padding-left: 0;
}
.activTag {
  background-color: #104f90 !important;
  color: #fff !important;
}
.el-aside::-webkit-scrollbar {
  display: none;
}
.el-tag {
  background-color: #f5f7fa;
  border-color: #e1e4eb;
  color: #66686c;
  cursor: pointer;
}
.el-tag:hover {
  background: #ffffff;
}
.el-main {
  background: #edeff2;
  padding-top: 0em;
}
.el-aside {
  width: auto !important;
  max-width: 208px;
  background: #edeff2;
}
/deep/ .el-menu--collapse {
  width: 88px;
}
.sideleft {
  height: 100%;
  /deep/ .el-menu {
    background: #222633;
    height: 100%;
  }
  /deep/ .is-opened /deep/ .el-submenu__title,
  /deep/ .is-opened /deep/ .el-submenu__title:hover {
    // background: #edeff2 !important;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }
  /deep/ .el-submenu__title,
  .el-menu-item {
    color: #7a7e8c;
    padding-right: 4rem;
    height: 40px;
    line-height: 40px;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    min-width: 208px;
  }
  /deep/ .el-submenu__title:hover {
    border-bottom-left-radius: 50px;
    border-top-left-radius: 50px;
    background-color: #edeff2;
  }
  /deep/ .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0;
    border-bottom-left-radius: 50px;
    border-top-left-radius: 50px;
    background-color: #edeff2;
  }
  /deep/ [class*=' el-icon-'],
  [class^='el-icon-'] {
    color: #636364;
  }
  .menu-toggle {
    padding: 0 20px;
  }
}
// headstyle
.headstyle {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
}
// header 左上角
.header-left-ac {
  width: 5.65rem !important;
}
.header-left {
  width: 13.3rem;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #1f2c44;
  color: #ffffff;
  img {
    position: relative;
    top: 8px;
    height: 25px;
  }
  label {
    font-weight: 700;
    font-family: HiraKakuProN-W6;
    font-size: 16px;
    letter-spacing: -0.5px;
    text-align: center;
  }
}

.el-header {
  z .compzzz {
    display: flex;
    width: 115px;
  }
  .icon {
    color: #ffffff;
    padding: 0 11px;
    height: 38px;
    margin: 6px 0;
    line-height: 38px;
    border-radius: 2px;
  }
  .icon:hover,
  .compzzz:hover {
    background-color: #1d4b7c;
  }
  .activ {
    width: calc(100% - 88px) !important;
  }
  // header 头像
  .imgBox {
    display: flex;
    justify-content: space-between;
    color: #ffffff;
    width: calc(100% - 208px);
    /deep/ .el-breadcrumb__inner {
      color: #ffffff;
      line-height: 50px;
    }
    .ava {
      padding: 10px;
      img {
        height: 28px;
        width: 28px;
        line-height: 28px;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        color: #fff;
        overflow: hidden;
      }
    }
  }
  // 搜索框
  .searchBox {
    margin-right: 1rem;
    position: relative;
    i {
      position: absolute;
      z-index: 990;
      top: 1.1rem;
      left: 0.5rem;
    }
    /deep/ .el-input__inner {
      height: 28px !important;
      line-height: 28px !important;
      border-radius: 50px;
      border-color: #2e6195;
      padding-left: 30px;
      background: #366798;
      color: #fff;
    }
  }
  /deep/ .el-dropdown {
    color: #fff;
    padding-right: 12px;
  }
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    color: rgb(14, 105, 93);
  }
}
</style>
