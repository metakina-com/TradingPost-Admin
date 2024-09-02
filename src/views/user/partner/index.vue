<template>
  <div class="user">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>团队总人数</h3>
          <h4>{{ sumData.sumMemberCount }}</h4>
        </div></el-col
      >
      <el-col :span="6" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>团队总手续费</h3>
          <h4>{{ sumData.sumFee }}</h4>
        </div></el-col
      >
      <el-col :span="6" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>昨日注册人数</h3>
          <h4>{{ sumData.yesTodayMemberCount }}</h4>
        </div></el-col
      >
      <el-col :span="6" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>今日注册人数</h3>
          <h4>{{ sumData.todayMemberCount }}</h4>
        </div></el-col
      >
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24"
        ><div class="">
          <span class="demonstration" style="margin: 0px 10px 0px 10px"
            >邮箱</span
          >
          <el-input
            placeholder="邮箱"
            v-model.trim="listQuery.mail"
            style="width: 140px"
            class="filter-item"
          /></div
      ></el-col>
      <el-col :span="10" :xs="24"
        ><div class=""></div>
        <div class="">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="开始时间"
          >
          </el-date-picker>
        </div>
        <div class="">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.endTime"
            type="datetime"
            placeholder="结束时间"
          >
          </el-date-picker></div
      ></el-col>
      <el-col :span="6" :xs="24"
        ><div class="">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >搜索</el-button
          >
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="reset"
            >重置</el-button
          >
        </div></el-col
      >
    </el-row>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="uuid" label="用户ID" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="uname" label="姓名" min-width="70" align="center">
      </el-table-column>

      <el-table-column
        prop="phone"
        label="手机号"
        min-width="70"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="mail"
        label="邮箱"
        min-width="70"
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        prop="putStatus"
        label="用户类型"
        min-width="70"
        align="center"
      >
        <template slot-scope="row">
          <p v-if="row.row.putStatus == true">允许</p>
          <p v-else>禁止</p>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="power"
        label="返金比例"
        min-width="70"
        align="center"
      >
        <!-- <template slot-scope="row">
          <p v-if="row.row.pickStatus == true">允许</p>
          <p v-else>禁止</p>
        </template> -->
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="注册时间"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button size="mini" type="success" @click="submit(row, 'set')">
            设置代理
          </el-button>
          <el-button size="mini" type="primary" @click="submit(row, 'cancel')">
            取消代理
          </el-button>
          <el-button size="mini" type="primary" @click="modify(row)">
            设置返佣比例
          </el-button>
          <!-- <el-button size="mini" type="danger" @click="del(row)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改信息 -->
    <el-dialog :visible.sync="modifyUserShow" :close-on-click-modal="true">
      <el-form
        :data="modifyData"
        label-position="left"
        label-width="70px"
        style="width: 400px"
      >
        <el-form-item label="返佣比例">
          <el-input v-model="modifyData.power" />
        </el-form-item>

        <!-- <el-table-column prop="modifyData.putStatus" label="" min-width="50" align="center">
        </el-table-column> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyUserShow = false"> 取消 </el-button>
        <el-button type="primary" @click="modifyConfirm"> 确认 </el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
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
      dialogVisible: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        mail: "",
        startTime: "",
        endTime: "",
        member: "",
      },
      list: null,
      total: 0,
      listLoading: true,
      modifyUserShow: false,
      modifyData: {
        power: "", //
      },
      sumData: "",
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    this.getSum();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getMembers", this.listQuery)
        .then((res) => {
          this.list = res.result.records;
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].createTime = getDatetime(this.list[i].createTime);
          }
          this.total = res.result.total;
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
    submit(item, type) {
      // console.log(item.row.id, "///");
      if (type == "set") {
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
    // 设置合伙人返佣比例
    setMemberPower() {
      let data = {};
      data.member = window.localStorage.getItem("userId");
      data.sonMember = this.modifyData.id;
      data.power = this.modifyData.power;
      // console.log(JSON.stringify(data), "/请求参数");
      this.$http
        .post("/admin/sysAdmin/setMemberPower", data)
        .then((res) => {
          console.log(res);
          if (res.status == "SUCCEED") {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.modifyUserShow = false;
            this.getList();
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        });
    },
    // 搜索
    handleFilter() {
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
      this.listQuery.endTime = "";
      this.listQuery.startTime = "";
      this.listQuery.mail = "";
      this.getList();
    },
    // 添加
    addmarketClick() {},
    // 修改
    modify(row) {
      console.log(row.row, "row");
      this.modifyUserShow = true;
      this.modifyData = row.row;
      console.log(this.modifyData, "//modifyData");
    },

    modifyConfirm() {
      this.setMemberPower();
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
  padding: 30px;
  min-height: 36px;
  border-left: 5px solid green;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
