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
      <el-table-column prop="mail" label="邮箱" min-width="70" align="center">
      </el-table-column>

      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center"> -->
      </el-table-column>
      <el-table-column prop="name" label="带单昵称" min-width="90" align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="createTime"
        label="用户类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->

      <el-table-column prop="balance" label="账号资金" min-width="90" align="center" show-overflow-tooltip />
      <el-table-column prop="sumYield" label="总收益率%" min-width="90" align="center" show-overflow-tooltip />

      <el-table-column prop="sumProfit" label="总收益(USDT)" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="winningProbability" label="近三周交易胜率" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="orderCount" label="订单数量" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="days" label="交易天数" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column prop="matchType" label="方式" min-width="80" align="center" show-overflow-tooltip  >
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

      <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="row">

          <el-button type="success" size="mini" :disabled="true" v-if="row.row.state == 'PASS'">
            已通过
          </el-button>
          <el-button type="primary" size="mini" @click="checkTraders(row)" v-if="row.row.state == 'CREATE'">
            待审核
          </el-button>
          <el-button type="info" size="mini" v-if="row.row.state == 'REFUSE'">
            已拒绝
          </el-button>
          <el-button size="mini" type="primary" @click="modify(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />


    <el-dialog :visible.sync="checkModal">
      <el-form :data="checkModal" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="checkData.mail" :disabled="true" />
        </el-form-item>
        <el-form-item label="带单昵称" prop="mail">
          <el-input v-model="checkData.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核" prop="openDownHd">
          <el-select v-model="checkData.state" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkModal = false">
          关闭
        </el-button>
        <el-button type="primary" @click="checkSubmit(checkData)">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--交易员编辑  -->


    <el-dialog :visible.sync="modifyShow">
      <el-form :data="markData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="markData.mail" :disabled="true" />
        </el-form-item>
        <el-form-item label="交易员操作">
          <el-select v-model="markData.mark" placeholder="请选择">
            <el-option v-for="(item,index) in options1" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false">
          关闭
        </el-button>
        <el-button type="primary" @click="setMemberTradeState(markData)">
          确定
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
        markData: {}, //编辑
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          mail: "",
          startTime: "",
          endTime: "",
        },
        list: null,
        total: 0,
        listLoading: true,
        checkModal: false,
        checkData: {
          state: "",
          id: "",
        },
        options1: [ //操作交易员
          {
            value: "REFUSE",
            label: "禁止交易员操作",
          },
          {
            value: "PASS",
            label: "允许交易员操作",
          },
        ],
        options: [{
            value: "PASS",
            label: "通过",
          },
          {
            value: "REFUSE",
            label: "拒绝",
          },
        ],
        sumData: "", //
        modifyShow: false,
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
          .get("/admin/sysAdmin/getMemberTradeList", this.listQuery)
          .then((res) => {
            this.list = res.result.records;
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
            this.total = res.result.total;
          })
          .catch((err) => {
            // console.log(err);///
          });
      },
      checkTraders(row) {
        // console.log(row.row);
        this.checkData = row.row;
        this.checkModal = true;
      },
      checkSubmit(row) {
        let data = {};
        data.member = row.id;
        data.state = row.state;
        this.$http
          .post("/admin/sysAdmin/setMemberTradeState", data)
          .then((res) => {
            this.checkModal = false;
            if (res.status == "SUCCEED") {
              this.$message({
                message: "操作成功",
                type: "success",
              });
            } else {
              this.$message({
                message: res.errorMessage,
                type: "error",
              });
            }
            this.getList();
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
      //编辑
      modify(row) {
        this.markData.mail = row.row.mail;
        this.markData.id = row.row.id;
        // console.log(row.row);
        // this.modifyData = row.row;
        this.modifyShow = true;
      },
      setMemberTradeState(markData) {
        let data = {};
        data.member = this.markData.id;
        data.state = this.markData.mark;
        this.$http.post("/admin/sysAdmin/setMemberTradeState", data).then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.modifyShow = false;
          this.getList();
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
