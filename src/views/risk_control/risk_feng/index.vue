<template>
  <div class="user">

    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime" type="datetime"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime" type="datetime" placeholder="结束时间">
      </el-date-picker>
      <el-input placeholder="时间间隔" v-model.trim="listQuery.intervalTime" style="width: 140px" class="filter-item" />
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
      <el-table-column prop="mail" label="邮箱" min-width="70" align="center">
      </el-table-column>

      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center"> -->
      </el-table-column>
      <!-- <el-table-column
        prop="fatherMail"
        label="邀请人"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="createTime"
        label="用户类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column prop="pairsName" label="交易对" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeType" label="方向" min-width="50" align="center" show-overflow-tooltip>

        <template slot-scope="scop">
          <!-- <p v-if="scop.row.tradeType == 'OPEN_UP'">
            多
          </p>
          <p v-if="scop.row.tradeType == 'OPEN_DOWN'">
            空
          </p>
          <p v-if="scop.row.tradeType == 'CLOSE_DOWN'">
            空
          </p>
          <p v-if="scop.row.tradeType == 'CLOSE_UP'">
            多
          </p> -->
          <p v-if="scop.row.tradeType == 'MARKET_PRICE'">
            市价
          </p>
          <p v-if="scop.row.tradeType == 'CUSTOM_PRICE'">
            限价
          </p>
          <p v-if="scop.row.tradeType == 'OPEN_UP'">
            开多
          </p>
          <p v-if="scop.row.tradeType == 'OPEN_DOWN'">
            开空
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="开仓价" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="matchPrice" label="平仓价" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contractHands" label="开仓数量" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="isContractHands" label="平仓数量" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="icon" label="剩余平仓数量" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="leverNum" label="杠杆倍数" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="takeFee" label="开仓手续费" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="makerFee" label="平仓手续费" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="margin" label="保证金" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unProfitLoss" label="未实现盈亏" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="profitLoss" label="已实现盈亏" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>


      <!-- <el-table-column prop="matchType" label="方式" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p v-if="scop.row.matchType == 'KCSJ'"> 市价开仓 </p>
          <p v-if="scop.row.matchType == 'SD'"> 手动平仓 </p>
          <p v-if="scop.row.matchType == 'CANCEL'"> 已撤销 </p>
          <p v-if="scop.row.matchType == 'BC'"> 爆仓 </p>
          <p v-if="scop.row.matchType == 'ZY'"> 止盈平仓 </p>
          <p v-if="scop.row.matchType == 'ZS'"> 止损平仓 </p>
          <p v-if="scop.row.matchType == 'ZSJ'"> 委托进持仓 </p>
        </template>
      </el-table-column> -->
      <el-table-column prop="yield" label="收益率" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="matchTime" label="平仓时间" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="开仓时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <el-button type="primary" size="mini" @click="detail(row)">
            资金明细
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
          startTime: "",
          endTime: "",
          // type: "GROUP",
          intervalTime: null,
        },
        startTime: "",
        endTime: "",
        modifyShow: false, //
        modifyData: {}, //
        balanceList: [], //
        list: null,
        total: 0,
        listLoading: true,
        status: [{
            label: "成功",
            index: 1
          },
          {
            label: "失败",
            index: 2
          },
        ],
        sumData: "", //
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
        // 获取佣金汇总
        // this.listQuery.member = window.localStorage.getItem("userId");
        this.$http
          .get("/admin/sysAdmin/getKpContractHistory", this.listQuery)
          .then((res) => {
            this.list = res.result.balanceList;
            this.list.forEach((element,index) => {
              element.createTime = this.getDatetime(element.createTime);
              
              var sum = element.contractHands - element.isContractHands;
              element["icon"] = sum;
            });

            this.list.forEach((element) => {
              element.matchTime = this.getDatetime(element.matchTime);
            });
            this.total = res.result.total;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      detail(row) {
        console.log(row.row.balanceList, "row");
        this.balanceList = row.row.balanceList;
        this.modifyShow = true;
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
        this.listQuery.type = "GROUP";
        this.getList();
      },
      // 添加
      addmarketClick() {},

      // 删除
      del(row) {},

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
