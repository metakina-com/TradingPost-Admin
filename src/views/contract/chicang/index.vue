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
      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center"> -->
      <!-- <el-table-column prop="fatherMail" label="邀请人" min-width="70" align="center">
      </el-table-column> -->
      <!-- 合约资金 -->
      <!--   <el-table-column prop="fatherMail" label="合约资金" min-width="70" align="center">
      </el-table-column> -->

      <!-- <el-table-column prop="status" label="姓名" min-width="70" align="center">
        <template slot-scope="scop">
          <p v-if="scop.row.status == 0">待审核</p>
          <p v-if="scop.row.status == 1">成功</p>
          <p v-if="scop.row.status == 2">失败</p>
        </template>
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
      <el-table-column prop="createTime" label="方向" min-width="70" align="center" show-overflow-tooltip>
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
      <!-- <el-table-column
        prop="mainCur"
        label="币种"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->

      <el-table-column prop="isContractHands" label="开仓张数" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="leverNum" label="杠杆倍数" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unProfitLoss" label="未实现盈亏" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column prop="tokenBalance" label="合约可用资金" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column prop="profitLoss" label="已实现盈亏" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="yield" label="收益率" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>


      <!-- <el-table-column
        prop="createTime"
        label="强平价"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column prop="margin" label="保证金" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>

      <!-- 新增 -->
      <el-table-column prop="tokenBalance" label="合约可用资金" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="row">
          <span type="primary" @click="modify(row)" size="mini">
            {{ row.row.balanceOrderList[0].tokenBalance }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="开仓价格" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="takeFee" label="手续费" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="createTime" label="开仓时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column
        prop="createTime"
        label="冻结数量"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column> -->
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
          <div v-for="(item, index) in modifyData.stopWinSets">
            <span style="margin-right:30px">数量： {{ item.split('-')[0] }}</span>
            <span>价格： {{ item.split('-')[1] }}</span>
          </div>
        </div>
        <div v-else>
          未设置止盈
        </div>
        <h3>止损</h3>
        <div v-if="modifyData.stopLossSets.length">
          <div v-for="(item, index) in modifyData.stopLossSets">
            <span style="margin-right:30px">数量： {{ item.split('-')[0] }}</span>
            <span>价格： {{ item.split('-')[1] }}</span>
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
      modifyData: {
        stopWinSets: [],
        stopLossSets: [],
      },
      modifyShow: false,
      startTime: "",
      endTime: "",
      list: null,
      list1: null,
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
      // 获取合约持仓
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getCreateOrders", this.listQuery)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.list = res.result.records;

            // this.list1 = res.result.records.balanceOrderList

            // console.log(this.list1);
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
            this.total = res.result.total;
          }

          // this.$http.get("/admin/sysAdmin/getContractHistory", this.listQuery)
          //   .then((res) => {
          //     this.listFee = res.result.records

          //     //关键代码
          //     this.list1 = this.listFee.map((item, index) => {
          //       return {
          //         ...item,
          //         ...this.list[index]
          //       };
          //     });
          //     console.log(this.list1)
          //     // this.dialogTableVisible = true;

          //   })
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    forcedPC(row) {
      let data = {
        id: row.row.id,
      }
      this.$prompt('请输入操作密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType:'password'
      }).then(({ value }) => {
        data.pass = value;
        if(data.pass){
          this.$http.post('/admin/sysAdmin/closeOrder', data).then(res => {
            if (res.status == 'SUCCEED') {
              this.$message({
                message: res.errorMessage,
                type: "error",
              });
              this.getList();
            } else {
              this.$message({
                message: res.errorMessage,
                type: "error",
              });
            }
          })
        }
      }).catch(err => {
        this.$message({
          message: '取消操作',
          type: "error",
        });
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
      this.listQuery.type = "GROUP";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.getList();
    },

    // 添加
    addmarketClick() { },

    // 删除
    del(row) { },

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
