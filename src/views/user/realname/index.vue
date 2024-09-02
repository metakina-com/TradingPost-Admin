<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 200px" class="filter-item" />
      <!-- 二改新增 -->
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="shaixuan">筛选</el-button> -->
      <el-select v-model="listQuery.state" placeholder="请选择">
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <!-- <el-table-column prop="uuid" label="用户ID" min-width="70" align="center">
      </el-table-column> -->
      <el-table-column prop="mail" label="邮箱" min-width="70" align="center"></el-table-column>
      <el-table-column prop="uname" label="姓名" min-width="70" align="center"></el-table-column>
      <el-table-column prop="cardNo" label="证件号" min-width="70" align="center"></el-table-column>
      <!-- <el-table-column prop="sumReBalance" label="邮箱" min-width="70" align="center"></el-table-column> -->
      <el-table-column prop="positiveLink" label="身份证正面" min-width="150" align="center">
        <template slot-scope="row">
          <img :src="row.row.positiveLink" style="width: 150px;" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="sideLink" label="身份证反面" min-width="150" align="center">
        <template slot-scope="row">
          <img :src="row.row.sideLink" style="width: 150px;" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="handLink" label="手持身份证" min-width="150" align="center">
        <template slot-scope="row">
          <img :src="row.row.handLink" style="width: 150px;" alt="">
        </template>
      </el-table-column>
      
      <el-table-column prop="createTime" label="注册时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="180" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <el-button size="mini" v-if="row.row.cardState == 'WAIT'" type="primary" @click="modify(row)">
            待审核
          </el-button>
          <el-button size="mini" v-if="row.row.cardState == '' || row.row.cardState == null" type="primary">
            未实名
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="modifyShow">
      <el-form :data="modifyData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="modifyData.mail" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核">
          <el-select v-model="modifyData.state" placeholder="请选择">
            <el-option v-for="(item,index) in auditOptions" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false">
          关闭
        </el-button>
        <el-button type="primary" @click="auditRealname">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改信息 -->

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { getDatetime } from "@/api/user";
import Pagination from "@/components/Pagination";
export default {
  name: "",
  components: {
    Pagination,
  },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        mail: "",
        type: "GROUP", // GROUP WEL
        startTime: "",
        endTime: "",
        // 新增二改
        state:"WAIT",
      },

      list: null,
      total: 0,
      listLoading: true,
      modifyShow: false,
      modifyData: {
        state:''
      },
      markShow: false,
      markData: {},
      sumData: {
        sumExBalance: "",
        sumReBalance: "",
        sumTodayExBalance: "",
        sumTodayReBalance: "",
      }, //
      userType: [
        {
          label: "散户",
          value: "GROUP",
        },
        {
          label: "合伙人",
          value: "WEL",
        },
        {
          label: "全部",
          value: "",
        },
      ],
      searchOptions:[
         {
          value: "WAIT",
          label: "待审核",
        },
        {
          value: "PASS",
          label: "审核通过",
        },
      ],
      auditOptions: [
        {
          value: "PASS",
          label: "审核通过",
        },
        {
          value: "REFUSE",
          label: "审核驳回",
        },
      ],
      memberInfo: "", //
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    // this.getSum();
    // this.memberInfo = window.localStorage.getItem("memberInfo");
    // console.log(this.memberInfo, "member");
  },
  methods: {

    getList() {
      this.listLoading = true;
      // 获取用户管理
      this.$http
        .get("/admin/sysAdmin/getMembers", this.listQuery)
        .then((res) => {
          this.list = res.result.members.records;
          if (this.list.length > 0) {
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
          }
          this.total = res.result.members.total;
          this.sumData.sumExBalance = res.result.sumExBalance[0];
          this.sumData.sumReBalance = res.result.sumReBalance[0];
          this.sumData.sumTodayExBalance = res.result.sumTodayExBalance[0];
          this.sumData.sumTodayReBalance = res.result.sumTodayReBalance[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSum() {
      this.listLoading = true;

      this.$http
        .get("/admin/sysAdmin/getMainInfo", {
          member: window.localStorage.getItem("userId"),
        })
        .then((res) => {
          this.sumData = res.result;
          window.localStorage.setItem("memberInfo", res.result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    markSubmit(row) {
      this.markData.mail = row.row.mail;
      this.markData.id = row.row.id;
      this.markShow = true;
    },
    setMemberBiaoJ(markData) {
      let data = {};
      data.member = this.markData.id;
      data.biaoji = this.markData.mark;
      this.$http.post("/admin/sysAdmin/setMemberBiaoJi", data).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.markShow = false;
        this.getList();
      });
    },
    submit(item, type) {
      // console.log(item.row.id, "///");
      if (type == "SET") {
        this.$confirm("确认设置为代理？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.setMemberAdmin(item.row.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.$confirm("确认取消其代理？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.cancelMemberAdmin(item.row.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    // 设置合伙人为代理
    setMemberAdmin(id) {
      // console.log(id, "设置代理");
      let data = {};
      data.member = window.localStorage.getItem("userId");
      data.sonMember = id;
      this.$http.post("/admin/sysAdmin/setMemberAdmin", data).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    // 取消设置合伙人为代理
    cancelMemberAdmin(id) {
      // console.log("取消代理");
      let data = {};
      data.member = window.localStorage.getItem("userId");
      data.sonMember = id;
      this.$http
        .post("/admin/sysAdmin/setMemberAdminFalse", data)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.$message({
              message: "操作成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.getList();
        });
    },
    auditRealname() {
      this.$http
        .post("/admin/sysAdmin/setMemberCardState", this.modifyData)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.modifyShow = false;
            this.getList()
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.getList();
        });
    },
    // 搜索
    handleFilter() {
      // console.log(this.listQuery, "listQuery");
      setTimeout(() => {
        this.listLoading = false;
      }, 3000);
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 10;
      this.listQuery.mail = "";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.listQuery.biaoji = ''
      this.getList();
    },

    modify(row) {
      // console.log(row.row);
      this.modifyData.mail = row.row.mail;
      this.modifyData.member = row.row.id;
      this.modifyShow = true;
    },

    // 添加
    addmarketClick() {},

    getDatetime(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m;
    },
    // 删除
    del(row) {},
  },
};
</script>

<style lang="scss" scoped>
.user {
  width: 95%;
  margin: 50px auto;
}

.el-row {
  margin-bottom: 20px;
  border-radius: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.content {
  padding: 20px;
}

.el-col {
  // border-radius: 24px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 10px;
  padding: 10px 30px;
  min-height: 36px;
  border-left: 5px solid green;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
