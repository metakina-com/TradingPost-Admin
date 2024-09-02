<template>
  <div class="user">
    <!--
    <el-row :gutter="20">
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
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <el-date-picker v-model="startTime" type="datetime" placeholder="开始时间">
      </el-date-picker>
      <el-date-picker v-model="endTime" type="datetime" placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
    </div>
    <!-- <div>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-bottom"
        @click="sendCommInfoSubmit"
        >佣金发放</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-document-remove"
        @click="modifyShow = true"
        >设置黑白名单</el-button
      >
    </div> -->

    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center">
      </el-table-column> -->
      <el-table-column prop="eail" label="邮箱" min-width="70" align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="fromMail"
        label="邀请人"
        min-width="70"
        align="center"
      >
      </el-table-column> -->

      <!-- <el-table-column
        prop="type"
        label="用户类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <!-- <el-table-column
        prop="pairsName"
        label="币种"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->

      <!-- <el-table-column
        prop="history.fee"
        label="个人手续费"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column prop="feeHistory.balance" label="昨日发放返佣" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="rakeBackPo.sumBalance" label="今日预发放返佣" min-width="90" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column
        prop="tradeMatchFee"
        label="团队交易金额"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <!-- <el-table-column
        prop="tradeFee"
        label="团队手续费"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="tradeProfitFee"
        label="团队贡献反金"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column> -->
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

    <!-- 修改信息 -->
    <el-dialog :visible.sync="modifyShow" :close-on-click-modal="true">
      <el-form :data="modifyData" label-position="right" label-width="90px" style="width: 480px">
        <el-form-item label="邮箱">
          <el-input v-model="modifyData.mail" aria-required="true" />
        </el-form-item>
        <!-- <el-form-item label="powerState">
          <el-input v-model="modifyData.powerState" />
        </el-form-item> -->
        <!-- <el-form-item label="币种">
          <el-input v-model="modifyData.currency" :disabled="true" />
        </el-form-item> -->
        <el-form-item label="黑白名单">
          <el-select v-model="modifyData.powerState" placeholder="请选择">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyShow = false"> 取消 </el-button>
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
  import Pagination from "@/components/Pagination"
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
          type: "",
        },
        setWhiteShow: false, // 设置白名单
        modifyShow: false,
        startTime: "",
        endTime: "",
        list: null,
        total: 0,
        listLoading: true,
        options: [{
            label: "白名单",
            value: "TRUE"
          },
          {
            label: "黑名单",
            value: "FALSE"
          },
        ],
        modifyData: {
          mail: "",
          powerState: ""
        }, //
        commissionInfo: "", //
        commInfoList: [], // 佣金明细
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

        this.listQuery.member = window.localStorage.getItem("userId");
        this.$http
          .get("/admin/sysAdmin/rebateComparison", this.listQuery)
          .then((res) => {
            // console.log(res.result.listComparison[0].feeHistory.balance)
            this.list = res.result.listComparison;
            this.total = res.result.total;
            // this.list.filter(item=>item.feeHistory.balance)
            // let arr = [];
            // this.list.map((item,index)=>{
            //   console.log(item.feeHistory.balance,index)
            // })
            this.list.sort((a,b)=>{
              // console.log(a.eail,b.eail,12132)
              return b.feeHistory.balance-a.feeHistory.balance});
            // console.log(this.list)


            // this.list.sort(this.compare())
            // console.log(this.list, 12132123)

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
        this.listQuery.type = "";

        this.getList();
      },
      //
      modifyConfirm() {
        this.setBlockWhite();
      },
      sendCommInfoSubmit() {
        this.$confirm("确认发放佣金", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            this.sendCommInfo();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      },
      sendCommInfo() {
        console.log("发放返佣");
        let data = {};
        data.pass = "PASS";
        this.$http
          .post("/admin/sysAdmin/sendContractCommInfo", data)
          .then((res) => {
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

      setBlockWhite() {
        let data = {};
        data.mail = this.modifyData.mail;
        data.powerState = this.modifyData.powerState;
        this.$http.post("/admin/sysAdmin/setBlackWhitelist", data).then((res) => {
          if (res.status == "SUCCEED") {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.modifyShow = false;
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.getList();
        });
      },

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
