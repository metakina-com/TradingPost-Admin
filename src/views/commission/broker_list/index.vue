<template>
  <div class="user">
    <!-- <el-row :gutter="20">
      <el-col :span="12" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>我的佣金</h3>
          <h4>{{ commissionInfo.sumBalance }}</h4>
        </div></el-col
      >
      <el-col :span="12" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>手续费总金额</h3>
          <h4>{{ commissionInfo.sumFee }}</h4>
        </div></el-col
      >
    </el-row> -->
    <!-- 上级邮箱搜索 -->
    <div class="filter-container" style="padding-bottom: 30px">
      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px">上级邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQueryMax.fromMail" style="width: 140px" class="filter-item" />

     <el-date-picker v-model="startTime" type="datetime" placeholder="开始时间">
      </el-date-picker>
      <el-date-picker v-model="endTime" type="datetime" placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterMax">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset1">重置</el-button> -->
      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >用户类型</span
      >
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option
          v-for="(item, index) in appealType"
          :key="index"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select> -->

      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <!-- 下级邮箱搜索 -->
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱搜索</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <span class="demonstration" style="margin: 0px 10px 0px 10px">来源邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.fromMail" style="width: 140px" class="filter-item" />
      <el-date-picker v-model="startTime" type="datetime" placeholder="开始时间">
      </el-date-picker>
      <el-date-picker v-model="endTime" type="datetime" placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >用户类型</span
      >
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option
          v-for="(item, index) in appealType"
          :key="index"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select> -->

      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>



    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center">
      </el-table-column> -->
      <!-- <el-table-column prop="uuid" label="UUID" min-width="70" align="center">
      </el-table-column> -->
      <el-table-column prop="mail" label="返佣邮箱" min-width="70" align="center">
      </el-table-column>
      <!-- 来源邮箱 -->
      <!--  <el-table-column prop="fromMail" label="来源邮箱" min-width="70" align="center">
      </el-table-column>
 -->


      <el-table-column prop="fromMail" label="来源邮箱" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="power" label="返佣比例" min-width="70" align="center">
      </el-table-column>

      <!-- <el-table-column
        prop="type"
        label="用户类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column prop="pairsName" label="币种" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="balance" label="返佣金额" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column
        prop="balance"
        label="余额"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <!--
      <el-table-column prop="tradeMatchFee" label="团队交易金额" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeFee" label="团队手续费" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column> -->


      <el-table-column prop="remark" label="业务" min-width="70" align="center" show-overflow-tooltip></el-table-column>

      <el-table-column prop="state" label="状态" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p style="color: red;" v-if="scop.row.state == 'CREATE'">
            未发放
          </p>
          <p style="color: green;" v-if="scop.row.state == 'FINAL'">
            已发放
          </p>

        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button
            type="primary"
            @click="appealClick(row)"
            :disabled="row.row.status == 0 ? false : true"
          >
            {{ row.row.status == 0 ? "申诉处理" : "已完成" }}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

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
          fromMail: "",
          startTime: "",
          endTime: "",
          type: "",
        },
        //上级搜索
        // listQueryMax: {
        //   pageNum: 1,
        //   pageSize: 10,
        //   fromMail: "",
        //   startTime: "",
        //   endTime: "",
        //   type: "",
        // },
        startTime: "",
        endTime: "",
        list: null,
        total: 0,
        listLoading: true,

        commissionInfo: "", //
        commInfoList: [], // 佣金明细
      };
    },
    created() {
      setTimeout(() => {
        this.listLoading = false;
      }, 3000);
      this.getList();
      // this.getAppeal();
      // this.getCommInfoList();
    },
    methods: {
      //上级搜索
      // getListMax() {
      //   this.listLoading = true;
      //   this.listQuery.member = window.localStorage.getItem("userId");
      //   this.$http
      //     .get("/admin/sysAdmin/getContractCommInfo", this.listQueryMax)
      //     .then((res) => {
      //       this.list = res.result.records;
      //       console.log(this.list)
      //       if (this.list.length > 0) {
      //         this.list.forEach((element) => {
      //           element.createTime = this.getDatetime(element.createTime);
      //         });
      //       }
      //       this.total = res.result.total;
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // },

      getList() {
        this.listLoading = true;
        this.listQuery.member = window.localStorage.getItem("userId");
        this.$http
          .get("/admin/sysAdmin/getContractCommInfo", this.listQuery)
          .then((res) => {
            this.list = res.result.records;
            console.log(this.list)
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
      // 搜索
      handleFilter() {
        setTimeout(() => {
          this.listLoading = false;
        }, 3000);
        this.listQuery.pageNum = 1;
        this.getList();
      },

      handleFilterMax() {
        setTimeout(() => {
          this.listLoading = false;
        }, 3000);
        this.listQuery.pageNum = 1;
        this.getListMax();
      },

      // 重置
      reset() {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = 10;
        this.listQuery.mail = "";
        this.listQuery.fromMail = '';

        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
        this.listQuery.type = "";

        this.getList();
      },
      //  reset1() {
      //   this.listQuery.pageNum = 1;
      //   this.listQuery.pageSize = 10;

      //   this.listQuery.fromMail = '';

      //   this.listQuery.startTime = "";
      //   this.listQuery.endTime = "";
      //   this.listQuery.type = "";

      //   this.getList();
      // },
      //获取佣金明细
      // getCommInfoList() {
      //   this.listQuery.member = window.localStorage.getItem("userId");
      //   this.$http
      //     .get("/admin/sysAdmin/getYesCommInfoSum", this.listQuery)
      //     .then((res) => {
      //       console.log(res, "返佣明细");
      //       this.commInfoList = res.result.records;
      //       this.total = res.result.total;
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // },

      // 添加
      addmarketClick() {},

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

  .filter-container {
    display: flex;
    align-items: center;
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
    height: 150px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
