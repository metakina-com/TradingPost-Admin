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
      <el-table-column prop="pairsName" label="交易对" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="type" label="方向" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p v-if="scop.row.type == 'UP'">
            看涨
          </p>
          <p v-if="scop.row.type == 'DOWN'">
            看跌
          </p>
          
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="mainCur"
        label="币种"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->


      <el-table-column prop="count" label="张数" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- 新增 -->
      <el-table-column prop="state" label="状态" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p v-if="scop.row.state == 'WAITCLOSE'">
            等待交割
          </p>
          <p v-if="scop.row.state == 'DOWN'">
            看跌
          </p>
          
        </template>
      </el-table-column>

      <el-table-column prop="openPrice" label="购买价格" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="openTime" label="购买时间" min-width="130" align="center" show-overflow-tooltip>
      </el-table-column>
      
      <el-table-column prop="closeTime" label="交割时间" min-width="130" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <el-button type="primary" @click="modify(row)" size="mini" style="margin-bottom: 10px;">
            止盈止损
          </el-button>
          <br/>
          <el-button type="primary" @click="forcedPC(row)" size="mini">
            强制平仓
          </el-button>
        </template>
      </el-table-column>
     
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
    <el-dialog :visible.sync="modifyShow">
      <h3 style="text-align: center;">止盈止损</h3>
      <div>
        <h3>止盈</h3>
        <div v-if="modifyData.stopWinSets.length">
          <div v-for="(item,index) in modifyData.stopWinSets" :key="index">
            <span style="margin-right:30px">数量： {{item.split('-')[0]}}</span>
            <span>价格： {{item.split('-')[1]}}</span>
          </div>
        </div>
        <div v-else>
          未设置止盈
        </div>
        <h3>止损</h3>
        <div v-if="modifyData.stopLossSets.length">
          <div v-for="(item,index) in modifyData.stopLossSets" :key="index">
            <span style="margin-right:30px">数量： {{item.split('-')[0]}}</span>
            <span>价格： {{item.split('-')[1]}}</span>
          </div>
        </div>
        <div v-else>
          未设置止损
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false">
          关闭
        </el-button>

      </div>
    </el-dialog>

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
      modifyData: {
        stopWinSets: [],
        stopLossSets: [],
      },
      modifyShow: false,
      startTime: "",
      endTime: "",
      list: null,
      total: 0,
      listLoading: true,
      //合约资金---手续费
      // listFee: null,
      // list1: null,
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 获取当前交割订单
      this.$http
        .get("/admin/sysAdmin/getMicContractNows", this.listQuery)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.list = res.result.records;
            console.log(this.list);
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
            this.total = res.result.total;
          }
        })
        
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
    modify(row) {
      this.modifyData = row.row;
      this.modifyShow = true;
    },
    // 重置
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 10;
      this.listQuery.mail = "";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
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
