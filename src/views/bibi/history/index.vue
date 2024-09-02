<template>
  <div class="user">
    <el-row :gutter="20">
      <el-col :span="10" :xs="24" style="margin-bottom: 5px">
        <div class="grid-content bg-purple">
          <h3>总交易人数 {{ sumData.todayTradeCount }}</h3>

        </div>
      </el-col>
      <el-col :span="10" :xs="24" style="margin-bottom: 5px">
        <div class="grid-content bg-purple">
          <h3>总手续费 {{ sumData.sumFee }}</h3>
        </div>
      </el-col>

    </el-row>
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime" type="datetime"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime" type="datetime" placeholder="结束时间">
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
      <el-table-column prop="member" label="用户" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="pairsName" label="交易对" min-width="80" align="center">
      </el-table-column>

      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center"> -->
      </el-table-column>

      <el-table-column prop="entrustType" label="类型" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p v-if="scop.row.entrustType == 'SELL'">
            出售
          </p>
          <p v-if="scop.row.entrustType == 'BUY'">
            购买
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="priceType" label="价格类型" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p v-if="scop.row.priceType == 'CUSTOM_PRICE'">
            限价
          </p>
          <p v-if="scop.row.priceType == 'MARKET_PRICE'">
            市价
          </p>
        </template>
      </el-table-column>
<el-table-column prop="matchFee" label="委托手续费" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="surplusCount" label="剩余数量" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
<el-table-column prop="count" label="委托数量" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="委托时间" min-width="70" align="center" show-overflow-tooltip>
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
          startTime: "",
          endTime: "",
          type: "GROUP",
        },
        startTime: "",
        endTime: "",
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
        this.listQuery.member = window.localStorage.getItem("userId");
        this.$http
          .get("/admin/sysAdmin/getEntrustHistoryList", this.listQuery)
          .then((res) => {
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
    padding: 20px 30px;
    min-height: 36px;
    border-left: 5px solid green;
    height: 100px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
