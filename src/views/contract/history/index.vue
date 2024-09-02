<template>
  <div class="user">
    <el-row :gutter="24" >
     <el-col :span="12" :xs="24" style="margin-bottom: 5px">
        <div class="grid-content bg-purple">
          <h3>总盈亏 {{ sumData1.sunProfit || "--" }}</h3>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" style="margin-bottom: 5px">
        <div class="grid-content bg-purple">
          <h3>总手续费 {{ sumData1.sunFee || "--" }}</h3>
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
     <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleDownload">导出</el-button> -->

      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px"handleDownload
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
      <el-table-column prop="openPrice" label="开仓价" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>


      <el-table-column prop="closePrice" label="平仓价" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="openCount" label="开仓数量" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="matchCount" label="平仓数量" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="fee" label="手续费" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>

      <!-- <el-table-column
        prop=""
        label="委托类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ><template slot-scope="scop">
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
      </el-table-column> -->

     <!-- <el-table-column prop="openCount" label="委托张数" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="openPrice" label="委托价" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column> -->

      <!-- <el-table-column
        prop=""
        label="委托价值"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      <template slot-scope="scop">
          <p >
            {{scop.row.openPrice * scop.row.openCount}}
          </p>

        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="levelNum" label="杠杆倍数" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column prop="matchType" label="方式" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="scop">
          <p v-if="scop.row.matchType == 'KCSJ'"> 市价开仓 </p>
          <p v-if="scop.row.matchType == 'SD'"> 手动平仓 </p>
          <p v-if="scop.row.matchType == 'CANCEL'"> 已撤销 </p>
          <p v-if="scop.row.matchType == 'BC'"> 爆仓 </p>
          <p v-if="scop.row.matchType == 'ZY'"> 止盈平仓 </p>
          <p v-if="scop.row.matchType == 'ZS'"> 止损平仓 </p>
          <p v-if="scop.row.matchType == 'ZSJ'"> 委托进持仓 </p>
          <p v-if="scop.row.matchType == 'PC'"> 平仓 </p>
          <p v-if="scop.row.matchType == 'KCXJ'"> 限价开仓 </p>
          <p v-if="scop.row.matchType == 'CANCEl_STOP_WIN'"> 撤销止盈</p>
          <p v-if="scop.row.matchType == 'CANCEl_STOP_LOSS'"> 撤销止损</p>


        </template>
      </el-table-column>
      <el-table-column prop="profit" label="收益" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="委托时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <el-button type="primary" size="mini" @click="detail(row)">
            资金明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />

    <el-dialog :visible.sync="modifyShow" width="1000px">
      <div v-for="(item,index)  in balanceList" :key="index">
        <h5>{{item}}</h5>
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
      startTime: "",
      endTime: "",
      modifyShow: false, //
      modifyData: {}, //
      balanceList: [], //
      list: null,
      total: 0,
      listLoading: true,
      status: [
        {
          label: "成功",
          index: 1,
        },
        {
          label: "失败",
          index: 2,
        },
      ],
      sumData: "", //
      sumData1:"",
      show: false,
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
        .get("/admin/sysAdmin/getContractHistory", this.listQuery)
        .then((res) => {

 // console.log(res.result.sunFee)
          this.sumData1 = res.result
          // console.log(this.sumData1)
          this.list = res.result.contractOrders.records;
          this.list.forEach((element) => {
            element.createTime = this.getDatetime(element.createTime);
          });
          this.total = res.result.contractOrders.total;


          // this.list = res.result.records;
          // this.list.forEach((element) => {
          //   element.createTime = this.getDatetime(element.createTime);
          // });
          // this.total = res.result.total;
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
     handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [ '邮箱',"交易对" ,"方向","开仓价","平仓价","开仓数量","平仓数量","手续费","收益"]
        const filterVal = [ 'mail',"pairsName" ,"tradeType","openPrice","closePrice","openCount","matchCount","fee","profit"]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '历史记录'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
            return this.list.map(v => filterVal.map(j => v[j]))
          },
     // formatJson(filterVal) {
     //      return this.list.map(v => filterVal.map(j => {
     //        if (j === 'timestamp') {
     //          return parseTime(v[j])
     //        } else {
     //          return v[j]
     //        }
     //      }))
     //    },


    // 搜索
    handleFilter() {
      setTimeout(() => {
        this.listLoading = false;
      }, 3000);
      this.listQuery.pageNum = 1;
      this.getList();
      // this.show = true;
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
      this.show = false;
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
