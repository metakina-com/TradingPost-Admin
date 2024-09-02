<template>
  <div class="user">
    <!-- <el-row :gutter="20">
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>总注册人数</h3>
          <h4>{{sumData.sumMemberCount}}</h4>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>昨日注册人数</h3>
          <h4>{{sumData.yesTodayMemberCount}}</h4>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>今天注册人数</h3>
          <h4>{{sumData.todayMemberCount}}</h4>
        </div></el-col
      >
    </el-row> -->
    <!-- <div class="filter-container" style="padding-bottom: 30px">
      <el-input
        placeholder="邮箱"
        v-model.trim="listQuery.mail"
        style="width: 140px"
        class="filter-item"
      />
      <el-input
        placeholder="币种"
        v-model.trim="listQuery.currency"
        style="width: 140px"
        class="filter-item"
      />
      <el-select v-model="listQuery.exOrRe" placeholder="请选择" style="width:130px">
        <el-option
          v-for="item in recExType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
          <el-date-picker style="width:150px"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="开始时间"
          >
          </el-date-picker>
          <el-date-picker style="width:150px"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.endTime"
            type="datetime"
            placeholder="结束时间"
          >
          </el-date-picker>
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
      > -->
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    <!-- </div> -->
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <!-- <el-table-column prop="uuid" label="用户ID" min-width="70" align="center"> -->
      </el-table-column>
      <!-- <el-table-column
        prop="aliayName"
        label="姓名"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="member"
        label="邮箱"
        min-width="70"
        align="center"
      ></el-table-column> -->
      <!-- <el-table-column
        prop="fatherMember"
        label="邀请人"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
      <el-table-column

        prop="fromAddress"
        label="钱包地址"
        min-width="70"
        align="center"
      >
     <template slot-scope="row">
          <p  v-if="row.row.address">{{row.row.fromAddress}}</p>
          <p v-else>{{row.row.fromAddress}}</p>
        </template>
      </el-table-column>
       <!-- <el-table-column
        v-if="wallet"
        prop="wallet"
        label="提币钱包地址"
        min-width="70"
        align="center"
      >
      </el-table-column> -->


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
        prop="coin"
        label="币种"
        min-width="70"
        align="center"
      >

      </el-table-column>
      <el-table-column
        prop="amount"
        label="金额"
        min-width="70"
        align="center"
      >
      <template slot-scope="row">
          <p v-if="row.row.amount">{{row.row.amount}}</p>
          <p v-else>{{row.row.balance}}</p>
        </template>
      </el-table-column>

      <el-table-column
        prop="symbol"
        label="状态"
        min-width="70"
        align="center"
      >
      <template slot-scope="row">

        <p style="color: green;" v-if="row.row.symbol == 'Normal'">正常</p>
        <!-- <p style="color: red;" v-if="row.row.symbol == 'REJECT'">驳回</p>
          <p style="color: green;" v-if="row.row.symbol == 'true'">审核通过</p>
          <p style="color: red;" v-if="row.row.symbol == 'false'">驳回</p> -->
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="时间"
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
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getDatetime } from "@/api/user";
import Pagination from "@/components/Pagination";
import { compile } from "path-to-regexp";
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
        uuid: "", //
        exOrRe: "RE",
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
      ],
      recExType: [
        { label: "充币", value: "RE" },
        { label: "提币", value: "EX" },
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
    // console.log(this.memberInfo, "member");
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 获取用户管理
      this.listQuery.member = window.localStorage.getItem("userId");
    
      this.$http
        .get("/admin/sysAdmin/getDepositHistory", this.listQuery)
        .then((res) => {
          console.log(res,'resres');
          this.list = res.result.records || [];
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
    // 搜索
    handleFilter() {
      // console.log(this.listQuery, "");
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
      this.listQuery.type = "GROUP";
      this.listQuery.mail = "";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.getList();
    },
    // 添加
    addmarketClick() {},

    modifyConfirm() {
      this.$http
        .post("/admin/updateUser", this.modifyData)
        .then((res) => {
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
