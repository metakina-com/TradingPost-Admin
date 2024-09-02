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
    <div class="filter-container" style="padding-bottom: 30px">
      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px">用户ID</span>
      <el-input placeholder="用户ID" v-model.trim="listQuery.uuid" style="width: 140px" class="filter-item" /> -->
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >用户类型</span
      >
      <el-select size="" v-model="listQuery.type" placeholder="请选择"  style="width:130px">
        <el-option
          v-for="item in userType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
      <!-- <el-select v-model="listQuery.exOrRe" placeholder="充提类型"  style="width:130px">
        <el-option
          v-for="item in recExType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
      <el-date-picker style="width:150px" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime"
        type="datetime" placeholder="开始时间">
      </el-date-picker>
      <el-date-picker style="width:150px" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime" type="datetime"
        placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="mail" label="邮箱" min-width="70" align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="aliayName"
        label="姓名"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="fee"
        label="手续费"
        min-width="70"
        align="center"
      >
      </el-table-column> -->

      <!-- <el-table-column
        prop="mail"
        label="邮箱"
        min-width="70"
        align="center"
      ></el-table-column> -->

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
      <el-table-column prop="fee" label="划转数量" min-width="70" align="center"></el-table-column>
      <!-- <el-table-column prop="balance" label="账户余额" min-width="70" align="center"></el-table-column> -->
      <el-table-column prop="currency" label="币种" min-width="70" align="center"></el-table-column>
      <el-table-column prop="type" label="划转类型" min-width="70" align="center">
        <template slot-scope="row">
          <p v-if="row.row.type == 'BALANCE_MOVE_TOKEN'">币币账户划转到U本位合约账户</p>
          <p v-if="row.row.type == 'BALANCE_MOVE_CAPITAL'">币币账户划转到资金账户</p>
          <p v-if="row.row.type == 'FB_MOVE_CAPITAL'">法币账户到资金账户</p>
          <p v-if="row.row.type == 'TOKEN_MOVE_CAPITAL'">U本位合约账户到资金账户</p>
          <p v-if="row.row.type == 'CAPITAL_MOVE_BALANCE'">资金账户划转到币币账户</p>
          <p v-if="row.row.type == 'CAPITAL_MOVE_TOKEN'">U本位账户划转到U本位合约账户</p>
          <p v-if="row.row.type == 'BALANCE_MOVE_CURRENCY'">币币账户划转到币本位U本位合约账户</p>
          <p v-if="row.row.type == 'FB_MOVE_CURRENCY'">法币账户划转到币本位合约账户</p>
          <p v-if="row.row.type == 'TOKEN_MOVE_CURRENCY'">U本位合约账户划转到币本位合约账户</p>
          <p v-if="row.row.type == 'CURRENCY_MOVE_BALANCE'">币本位合约账户划转到币币账户</p>
          <p v-if="row.row.type == 'CURRENCY_MOVE_FB'">币本位账户划转到法币账户</p>
          <p v-if="row.row.type == 'CURRENCY_MOVE_TOKEN'">币本位合约账户划转到U本位合约账户</p>
          <p v-if="row.row.type == 'CAPITAL_MOVE_CURRENCY'">资金账户划转到币本位合约账户</p>
          <p v-if="row.row.type == 'BALANCE_MOVE_ASSETS'">币币账户划转到充提账户</p>
          <p v-if="row.row.type == 'BALANCE_MOVE_FB'">币币账户划转到法币账户</p>
          <p v-if="row.row.type == 'TOKEN_MOVE_BALANCE'">U本位合约账户划转到币币账户</p>
          <p v-if="row.row.type == 'TOKEN_MOVE_FB'">U本位合约账户划转到法币账户</p>
          <p v-if="row.row.type == 'TOKRN_MOVE_ASSETS'">U本位合约账户划转到充提账户</p>
          <p v-if="row.row.type == 'FB_MOVE_BALANCE'">法币账户划转到币币账户</p>
          <p v-if="row.row.type == 'FB_MOVE_TOKEN'">法币账户划转到U本位合约账户</p>
          <p v-if="row.row.type == 'FB_MOVE_ASSETS'">法币账户划转到充提账户</p>
          <p v-if="row.row.type == 'ASSETS_MOVE_BALANCE'">充提账户划转到币币账户</p>
          <p v-if="row.row.type == 'ASSETS_MOVE_FB'">充提账户划转到法币账户</p>
          <p v-if="row.row.type == 'ASSETS_MOVE_TOKEN'">充提账户划转到U本位合约账户</p>
          <p v-if="row.row.type == 'CURRENCY_MOVE_CAPITAL'">币本位账户划转到资金账户</p>
          <p v-if="row.row.type == 'CAPITAL_MOVE_FB'">资金账户划转到法币</p>
          <p v-if="row.row.type == 'BALANCE_MOVE_FOLLOW'">资金账户划转到跟单账户</p>
          <p v-if="row.row.type == 'FOLLOW_MOVE_BALANCE'">跟单账户划转到资金账户</p>
        </template>
      </el-table-column>


      <el-table-column prop="createTime" label="时间" min-width="70" align="center" show-overflow-tooltip>
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
      <el-form :data="modifyData" label-position="left" label-width="170px" style="width: 400px; margin-left: 50px">
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

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  import {
    getDatetime
  } from "@/api/user";
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
          exOrRe: "",
          // uuid: "",
        },
        list: null,
        total: 0,
        listLoading: true,
        modifyUserShow: false,
        modifyData: {
          userId: "",
        },
        sumData: "", //
        userType: [{
            label: "散户",
            value: "GROUP"
          },
          {
            label: "合伙人",
            value: "WEL"
          },
        ],
        recExType: [{
            label: "充币",
            value: "EX"
          },
          {
            label: "提币",
            value: "RE"
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
      this.getSum();
      this.memberInfo = window.localStorage.getItem("memberInfo");
      // console.log(this.memberInfo, "member");
    },
    methods: {
      getList() {
        this.listLoading = true;
        // 获取充提币
        this.listQuery.member = window.localStorage.getItem("userId");
        this.$http
          .get("/admin/sysAdmin/getTransferList", this.listQuery)
          .then((res) => {
            console.log(res.result.records, "划转记录");
            this.list = res.result.records || [];
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
              console.log(element.createTime)
            });
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
        // console.log(this.listQuery);
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
        this.listQuery.uuid = "";
        this.listQuery.mail = "";
        this.listQuery.exOrRe = "";
        this.getList();
      },
      // 添加
      addmarketClick() {},

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
            // console.log(err);
          });
      },
      getDatetime(timestamp) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
          (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1) + "-";
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
