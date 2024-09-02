<template>
  <div class="user">
    <el-form
      :rules="rules"
      ref="agentForms"
      :model="modifyData"
      label-width="80px"
    >
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="modifyData.qq" placeholder="请输入联系QQ" />
      </el-form-item>
      <el-form-item label="邮箱" prop="mail">
        <el-input v-model="modifyData.mail" placeholder="请输入联系邮箱" />
      </el-form-item>
      <el-button
        ttype="primary"
        style="margin-left: 80px"
        @click="toSubmit()"
        >确认</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      modifyData: {
        qq: "",
        mail: "",
      },
      rules: {
        qq: [{required: true, message: "请输入联系QQ", trigger: "change" }],
        mail: [{ required: true, message: "请输入联系邮箱", trigger: "change" }],
      },
    };
  },
  created() {
    this.getlist()
  },
  methods: {
    toSubmit() {
      const el = this.$refs["agentForms"];
      el.validate((valid, fields) => {
        if (valid) {
          this.$http
            .post("/admin/sysAdmin/setCustomerServiceInfo", this.modifyData)
            .then((res) => {
				if(res && res.status == "SUCCEED"){
					 this.$message({
							message: "操作成功",
							type: "success",
						});
                  setTimeout(() => {
                        window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                    }, 600);
				}else{
					this.$message.error(res.errorMessage)
				}
             
            })
            .catch((err) => {
            });
        } else {
        }
      });
    },
    // 查询
    getlist() {
      this.$http
        .get("/admin/sysAdmin/getCustomerServiceInfo")
        .then((res) => {
		  this.modifyData.mail= res.result.CustomerServiceMail
		  this.modifyData.qq=res.result.CustomerServiceQQ
          console.log("查询成功---", this.modifyData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped="scoped">
.user {
  width: 95%;
  margin: 50px auto;
}
</style>
