<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <i class="iconfont icon-logo-011"></i>
      </div>
      <div class="right">
        <el-link href="#" target="_blank">帮助</el-link>
        <span class="line"></span>
        <el-link href="#" target="_blank">联系我们</el-link>
      </div>
    </div>
    <div class="main">
      <!-- 港口数字化 -->
      <img src="./../../assets/icon/title.svg" alt class="title" />
      <!-- 背景栏杆 -->
      <div class="langan"></div>
      <!-- 人物 -->
      <div class="person"></div>
      <!-- 表单 -->
      <div class="login_box">
        <el-form
          :model="form"
          :rules="loginFormRules"
          ref="loginFormRef"
          label-width="0"
          class="form_box"
        >
          <!-- 用户名 -->
          <el-form-item prop="accNo">
            <el-input prefix-icon="el-icon-user" v-model="form.accNo" placeholder="用户名"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="accPwd">
            <el-input
              type="password"
              prefix-icon="el-icon-unlock"
              v-model="form.accPwd"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="onSubmit">登录</el-button>
          </el-form-item>
          <div class="accPwd_col">
            <el-checkbox v-model="form.checked" @change="handerRemember">记住密码</el-checkbox>
            <el-link href="#" target="_blank">忘记密码？</el-link>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer">Copyright © 2020 江苏省港口集团</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      // 表单数据
      form: {
        accNo: '', //用户名
        accPwd: '', //密码
        checked: false //记住密码
      },
      //验证规则
      loginFormRules: {
        accNo: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        accPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRemember()
  },
  methods: {
    onSubmit() {
      this.$refs['loginFormRef'].validate(async valid => {
        if (!valid) return
        //登录请求
        let accNo = this.form.accNo
        let accPwd = this.$md5(this.form.accPwd)
        let form = { accNo, accPwd }

        const res = await this.$http.post(
          `/psys-master-service/api/external/login`,
          form
        )

        if (res.data.code === '0000') {
          this.$message.success('登录成功！')

          let token = res.headers.token
          console.log(res)
          let userName = res.data.data.data.userName
          let companyName = res.data.data.data.companyName
          // let companyCode = res.data.data.data.companyCode
          // let deptCode = res.data.data.data.deptCode
          window.sessionStorage.setItem('token', token)
          window.sessionStorage.setItem('userName', userName)
          window.sessionStorage.setItem('companyName', companyName)

          window.sessionStorage.setItem(
            'compCode',
            res.data.data.data.companyCode
          )
          console.log(res)
          this.$router.push({ path: '/homePage' })
        } else {
          this.$message.error('登录失败！')
        }
      })
    },
    //记住密码
    handerRemember() {
      if (this.form.checked) {
        if (this.form.accNo == '' || this.form.accPwd == '') {
          this.$message.error('请输入账户名和密码')
          return (this.form.checked = false)
        }
        window.sessionStorage.setItem('accNo', this.form.accNo)
        window.sessionStorage.setItem('accPwd', this.form.accPwd)
      } else {
        window.sessionStorage.removeItem('accNo')
        window.sessionStorage.removeItem('accPwd')
        this.form.checked = false
      }
    },
    //获取本地记住密码数据
    getRemember() {
      let accNo = window.sessionStorage.getItem('accNo')
      let accPwd = window.sessionStorage.getItem('accPwd')
      if (accNo == null || accPwd == null) {
        return (this.form.checked = false)
      } else {
        this.form.accNo = accNo
        this.form.accPwd = accPwd
        this.form.checked = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../node_modules/animate.css/animate.css';
// 头部

.header {
  width: 100%;
  height: 50px;
  background: #ffffff;
  box-shadow: 0 1px 3px 0 #bcc3d6;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    font-size: 20px;
    color: #1581f0;
    letter-spacing: -0.62px;
  }
  .right {
    cursor: pointer;
    font-size: 14px;
    color: #606266;
    .line {
      border: 1px solid #e1e4eb;
      margin: 0 15px;
    }
  }
}
// 中间
.main {
  width: 100%;
  height: calc(100vh - 100px);
  background: url('../../assets/img/bg.png') no-repeat center;
  background-size: 100% 100%;
  position: relative;
  .title {
    position: absolute;
    top: 20%;
    left: 20%;
    animation: zoomIn 4s ease-in;
  }
  .title:hover {
    animation: zoomIn 4s;
  }
  // 登录表单
  .login_box {
    position: absolute;
    top: 20%;
    left: 60%;
    width: 28.75rem;
    height: 20rem;
    padding: 0 32px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e1e4eb;
    border-radius: 4px;
    border-radius: 4px;
    .form_box {
      font-size: 14px;
      margin-top: 45px;

      .accPwd_col {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  // 栏杆
  .langan {
    width: 100%;
    height: 150px;
    position: absolute;
    bottom: 0;
    background: url('../../assets/img/bg2.png') no-repeat center;
    background-size: 100% 100%;
  }
  // 人物
  .person {
    position: absolute;
    left: 10%;
    bottom: 0;
    width: 20%;
    height: 40%;
    background: url('../../assets/img/bg1.png') no-repeat center;
    background-size: 100% 100%;
    animation: bounceInLeft 4s ease-in;
  }
}

//尾部
.footer {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  box-shadow: 0 1px 3px 0 #bcc3d6;
  font-size: 14px;
  color: #606266;
  letter-spacing: 0;
  text-align: center;
}
</style>
