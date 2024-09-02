<template>
  <div class="user">
    <el-row :gutter="20">
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h2>总注册人数</h2>
          <h5>0</h5>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h2>昨日注册人数</h2>
          <h5>0</h5>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h2>今天注册人数</h2>
          <h5>0</h5>
        </div></el-col
      >
    </el-row>
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >用户ID</span
      >
      <el-input
        placeholder="用户ID"
        v-model.trim="listQuery.userNo"
        style="width: 140px"
        class="filter-item"
      />

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
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="uuid" label="用户ID" min-width="70" align="center">
      </el-table-column>
      <el-table-column
        prop="aliayName"
        label="姓名"
        min-width="70"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="welMember"
        label="邀请人ID"
        min-width="70"
        align="center"
      >
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
      > -->
        <!-- <template slot-scope="row">
          <p v-if="row.row.putStatus == true">允许</p>
          <p v-else>禁止</p>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="power"
        label="反金比例"
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
      <!-- <el-table-column
        label="操作"
        align="center"
        min-width="90"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button size="mini" type="primary" @click="modify(row)">
            修改
          </el-button>
          
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 修改信息 -->
    <el-dialog :visible.sync="modifyUserShow" :close-on-click-modal="true">
      <el-form
        :data="modifyData"
        label-position="left"
        label-width="170px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名称">
          <el-input v-model="modifyData.userName" />
        </el-form-item>
        <el-form-item label="用户标识">
          <el-input v-model="modifyData.userNo" />
        </el-form-item>

        <el-form-item label="所属项目方">
          <el-input v-model="modifyData.userProjectCode" />
        </el-form-item>
        <el-form-item label="用户手机">
          <el-input v-model="modifyData.userPhone" />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="modifyData.userEmail" />
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
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
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
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        mail: "",
        type: "GROUP", // GROUP WEL
        startTime: "",
        endTime: "",
        userNo: "",
      },
      list: null,
      total: 0,
      listLoading: true,
      modifyUserShow: false,
      modifyData: {
        userId: "",
      },
      sumData: "", //
      userType: [
        { label: "散户", value: "GROUP" },
        { label: "合伙人", value: "WEL" },
      ],
      pickStatusOptions: [
        { label: "允许", value: true },
        { label: "禁止", value: false },
      ],
      memberInfo: "", //
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    this.getSum();
    this.memberInfo = window.localStorage.getItem("memberInfo");
    console.log(this.memberInfo, "member");
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 获取用户管理
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$get("/admin/adminMember/getMembers", this.listQuery)
        .then((res) => {
          console.log(res.result, "用户管理");

          this.list = res.result.records;
          this.list.forEach((element) => {
            element.createTime = this.getDatetime(element.createTime);
          });
          this.total = res.result.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSum() {
      this.listLoading = true;
      // 用户交易权限设置
      this.$get("/admin/adminMember/getMainInfo", {
        member: window.localStorage.getItem("userId"),
      })
        .then((res) => {
          console.log(res.result, "////////");
          this.sumData = res.result;
          window.localStorage.setItem("memberInfo", res.result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 搜索
    handleFilter() {
      setTimeout(() => {
        this.listLoading = false;
      }, 3000);
      this.listQuery.page = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.listQuery.page = 1;
      this.listQuery.size = 10;
      this.listQuery.userName = "";
      this.listQuery.userPhone = "";
      this.listQuery.userProjectCode = "";
      this.listQuery.userNo = "";
      this.getList();
    },
    // 添加
    addmarketClick() {},
    // 修改
    modify(row) {
      console.log(row.row, "row");
      this.modifyUserShow = true;
      this.getLoadUpdateUser(row.row.id);
    },
    getLoadUpdateUser(e) {
      this.$http
        .post("/admin/loadUpdateUser", { userId: e })
        .then((res) => {
          console.log(res, "loadUpdateUser");
          this.modifyData = res.data.data;
          this.modifyData.userId = e;
        })
        .catch((err) => {});
    },
    modifyConfirm() {
      this.$http
        .post("/admin/updateUser", this.modifyData)
        .then((res) => {
          console.log(res.data.data, "updateUser");
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.modifyUserShow = false;
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
  padding: 30px;
  min-height: 36px;
  border-left: 5px solid green;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
