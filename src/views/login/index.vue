<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">BitBANK-管理后台</h3>
      </div>
      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="name"
          v-model="loginForm.name"
          placeholder="请输入账号"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          name="password"
          type="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />

        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          /> -->
          <!-- <el-button
            type="primary"
            :loading="codeLoading"
            :disabled="codeStatus"
            @click="codeClick"
            >{{ codeText }}</el-button
          > -->
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import http from "@/utils/http";
import { login } from "@/api/user";
import { getToken } from "@/utils/auth";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入正确的账号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        name: "",
        password: "",
      },
      loginRules: {
        name: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      codeLoading: false,
      redirect: undefined,
      codeText: "获取验证码", //
      codeStatus: false, // 获取验证码按钮状态
      count: 60,
      timer: null,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    codeClick() {
      // console.log("点击获取验证码");
      this.codeLoading = true;
      this.codeStatus = true;
      if (this.loginForm) {
        // let httpData = {};
        // httpData.mailbox = this.loginForm.mailbox;
        // this.$http
        //   .post("/admin/adminSms/sendMail", httpData)
        //   .then((res) => {
        //     if (res && res.status == "SUCCEED") {
        //       this.codeLoading = false;
        //       this.$message({
        //         message: "验证码发送成功",
        //         type: "success",
        //       });
        //       this.currentDownTime();
        //     } else {
        //       this.$message({
        //         message: res.errorMessage,
        //         type: "error",
        //       });
        //       this.codeStatus = false;
        //       this.codeLoading = false;
        //     }
        //     // console.log(res.result, "res");
        //     // this.list = res.data.data.content;
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     this.codeStatus = false;
        //     this.codeLoading = false;
        //   });
      } else {
        this.$message({
          message: "请输入正确的账号",
          type: "error",
        });
        this.codeStatus = false;
        this.codeLoading = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      // this.$nextTick(() => {
      //   // this.$refs.password.focus();
      // });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.name == "") {
            this.$message({
              message: "请输入账号",
              type: "error",
            });
            return;
          }
          if (this.loginForm.password == "") {
            this.$message({
              message: "请输入密码",
              type: "error",
            });
            return;
          }

          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });

          // return;
          // this.$post1("/admin/adminSms/adminLogin", this.loginForm).then(
          //   (res) => {
          //     console.log(res.result, "///");
          //     if (res.status == "SUCCEED") {
          //       // window.localStorage.setItem("userId", res.result.id);
          //       // window.localStorage.setItem("token", res.result.token);
          //       // this.$message({
          //       //   message: "登录成功",
          //       //   type: "success",
          //       // });
          //       // this.$router.push({ path: "/" });
          //     } else {
          //       this.$message({
          //         message: res.errorMessage,
          //         type: "error",
          //       });
          //     }
          //   }
          // );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    currentDownTime() {
      this.timer = setInterval(() => {
        this.codeStatus = true;
        if (this.count > 0) {
          this.count--;
          window.localStorage.setItem("codeTime", this.count);
          this.codeText = this.count + "重新获取";
        } else {
          this.codeText = "获取验证码";
          this.count == 60;
          this.codeStatus = false;
          this.codeLoading = false;
          clearInterval(this.timer);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
