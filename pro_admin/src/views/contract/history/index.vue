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
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <div class="">
          <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
          <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
        </div>
      </el-col>
      <el-col :span="10" :xs="24">
        <div class=""></div>
        <div class="">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime" type="datetime"
            placeholder="开始时间">
          </el-date-picker>
        </div>
        <div class="">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime" type="datetime"
            placeholder="结束时间">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="6" :xs="24">
        <div class="">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="filter-container" style="padding-bottom: 30px">
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
      <el-table-column prop="fatherMail" label="邀请人" min-width="70" align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="createTime"
        label="用户类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column prop="pairsName" label="交易对" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeType" label="方向" min-width="70" align="center" show-overflow-tooltip>

        <template slot-scope="scop">
          <p v-if="scop.row.tradeType == 'OPEN_UP'">
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
          </p>
        </template>
      </el-table-column>

      <el-table-column prop="matchType" label="方式" min-width="70" align="center" show-overflow-tooltip>
       <template slot-scope="scop">
          <p v-if="scop.row.matchType == 'SD'">
            手动平仓
          </p>
          <p v-if="scop.row.matchType == 'PC'">
            平仓
          </p>
          <p v-if="scop.row.matchType == 'BC'">
            爆仓 </p>
          <p v-if="scop.row.matchType == 'ZY'"> 止盈 </p>
          <p v-if="scop.row.matchType == 'ZS'"> 止损 </p>
          <span v-if="scop.row.matchType == 'ZSJ'">委托进持仓</span>
          <span v-if="scop.row.matchType == 'KCSJ'">市价开仓</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="委托时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeType" label="委托类型" min-width="70" align="center" show-overflow-tooltip><template
          slot-scope="scop">
          <p v-if="scop.row.tradeType == 'OPEN_UP'">
            开多
          </p>
          <p v-if="scop.row.tradeType == 'OPEN_DOWN'">
            开空
          </p>
          <p v-if="scop.row.tradeType == 'CLOSE_DOWN'">
            平空
          </p>
          <p v-if="scop.row.tradeType == 'CLOSE_UP'">
            平多
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="openCount" label="委托张数" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="openPrice" label="委托价" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="" label="委托价值" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p>
            {{ scop.row.openPrice * scop.row.openCount }}
          </p>

        </template>
      </el-table-column>
      <el-table-column prop="levelNum" label="杠杆倍数" min-width="70" align="center" show-overflow-tooltip>
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
        startTime: "",
        endTime: "",
        type: "GROUP",
      },
      startTime: "",
      endTime: "",
      list: null,
      total: 0,
      listLoading: true,
      status: [
        { label: "成功", index: 1 },
        { label: "失败", index: 2 },
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
        .get("/admin/adminMember/getContractHistory", this.listQuery)
        .then((res) => {
          this.list = res.result.contractOrders.records;
          this.total = res.result.contractOrders.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSum() {
      this.listLoading = true;
      this.$http
        .get("/admin/adminMember/getMainInfo", {
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
    addmarketClick() { },

    // 删除
    del(row) { },
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
