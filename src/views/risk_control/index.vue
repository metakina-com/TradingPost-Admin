<template>
  <div class="user">
    <div style="padding-bottom: 30px">用户列表</div>
    <el-row :gutter="20">
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>总注册人数</h3>
          <h5>{{sumData.sumMemberCount}}</h5>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>昨日注册人数</h3>
          <h5>{{sumData.yesTodayMemberCount}}</h5>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>今天注册人数</h3>
          <h5>{{sumData.todayMemberCount}}</h5>
        </div></el-col
      >
    </el-row>
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >邮箱</span
      >
      <el-input
        placeholder="邮箱"
        v-model.trim="listQuery.mail"
        style="width: 140px"
        class="filter-item"
      />
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option
          v-for="item in userType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

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
      <!-- <el-table-column
        prop="phone"
        label="手机号"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
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
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        mail: "",
        type: "GROUP", // GROUP WEL
        startTime: "",
        endTime: "",
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
        { label: "全部", value: "" },
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
    // this.memberInfo = window.localStorage.getItem("memberInfo");
    // console.log(this.memberInfo, "member");
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 获取用户管理
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getMembers", this.listQuery)
        .then((res) => {
          this.list = res.result.records;
          if (this.list.length > 0) {
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
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
        .get("/admin//sysAdmin/getMainInfo", {
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
    // 搜索
    handleFilter() {
      console.log(this.listQuery, "listQuery");
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
      this.listQuery.userNo = "";
      this.getList();
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
  padding: 30px;
  min-height: 36px;
  border-left: 5px solid green;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
