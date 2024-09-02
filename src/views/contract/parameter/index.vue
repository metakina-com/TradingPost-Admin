<template>
  <div class="user">
    <h3>合约参数配置</h3>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="pairsName" label="交易对" min-width="90" align="center">
      </el-table-column>

      <!-- <el-table-column prop="contractMul" label="杠杆倍数" min-width="50" align="center" /> -->


      <el-table-column
        prop="proportion"
        label="保证金比例"
        min-width="50"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="ensure" label="维持保证金率" min-width="50" align="center" show-overflow-tooltip  />
      <el-table-column  prop="maxCount" label="最大可开"  min-width="70"  align="center" show-overflow-tooltip />
       <el-table-column  prop="minCount" label="最小可开" min-width="70" align="center" show-overflow-tooltip />

      <el-table-column prop="ensure" label="维持保证金率" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="makerFee" label="市价平仓手续费" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="takerFee" label="市价开仓手续费" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="forceFee" label="强平手续费" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="tradeFee" label="交易手续费" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="smakerFee" label="限价开仓手续费" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="upOpenHd" label="开多滑点" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="downOpenHd" label="开空滑点" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="upCloseHd" label="平多滑点" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="downCloseHd" label="平空滑点" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="createTime" label="修改时间" min-width="70" align="center" show-overflow-tooltip ></el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button
            type="primary"
            size="mini"
            @click="modifyClick(row)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="paramterModal" width="550px">
      <el-form :data="modifyData"  label-position="left" size="small" label-width="130px" title="" style="width: 400px; margin-left:50px;">
        <el-form-item label="交易对" prop="pairsName" >
          <el-input v-model="modifyData.pairsName" :disabled="true"/>
          <!-- <span style="color:red" v-show="showError == true">* 管理员账号必须以admin_开头</span> -->
        </el-form-item>
        <!-- <el-form-item label="杠杆倍数" prop="contractMul" >
          <el-input v-model="modifyData.contractMul	" :disabled="false" class="filter-item" />
        </el-form-item> -->
         <el-form-item label="保证金占比" prop="proportion" >
          <el-input v-model="modifyData.proportion	" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="最大可开" prop="maxCount" >
          <el-input v-model="modifyData.maxCount" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="最小可开" prop="minCount" >
          <el-input v-model="modifyData.minCount"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="限价平仓手续费" prop="makerFee" >
          <el-input v-model="modifyData.makerFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="市价开仓手续费" prop="takerFee" >
          <el-input v-model="modifyData.takerFee"  :disabled="false" class="filter-item" />
        </el-form-item>

        <el-form-item label="强平手续费" prop="forceFee" >
          <el-input v-model="modifyData.forceFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="交易手续费" prop="tradeFee" >
          <el-input v-model="modifyData.tradeFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="维持保证金率" prop="ensure" >
          <el-input v-model="modifyData.ensure"  :disabled="false" class="filter-item" />
        </el-form-item>


        <el-form-item label="限价开仓手续费" prop="smakerFee" >
          <el-input v-model="modifyData.smakerFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="限价平仓手续费" prop="stakerFee" >
          <el-input v-model="modifyData.stakerFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="开多滑点" prop="upOpenHd" >
          <el-input v-model="modifyData.upOpenHd"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="平多滑点" prop="upCloseHd" >
          <el-input v-model="modifyData.upCloseHd"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="开空滑点" prop="downOpenHd" >
          <el-input v-model="modifyData.downOpenHd"  :disabled="false" class="filter-item" />
        </el-form-item>
         <el-form-item label="平空滑点" prop="downCloseHd" >
          <el-input v-model="modifyData.downCloseHd"  :disabled="false" class="filter-item" />
        </el-form-item>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paramterModal = false">
          关闭
        </el-button>
         <el-button type="primary" @click="submit(modifyData)">
          确定
        </el-button>
      </div>
	  </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
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
        pageSize: 20,
        mail: "",
        startTime: "",
        endTime: "",
        currency: "USDT",
      },
      sumData: "", //
      startTime: "",
      endTime: "",
      list: null,
      total: 0,
      listLoading: true,
      status: [
        { label: "成功", index: 1 },
        { label: "失败", index: 2 },
      ],
      contractParamter: "", // 合约参数配置
      userType: {}, //
      appeal: false,
      modifyData: {},
      paramterModal: false, //
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    // this.getCommInfoList();
    this.getAssetsSum();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 获取佣金汇总
      // this.listQuery.member = ;
      // console.log(this.listQuery, "请求参数");
      this.$http
        .get("/admin/sysAdmin/getContractConfig", {
          member: window.localStorage.getItem("userId"),
        })
        .then((res) => {
          // console.log(res, "参数配置");
          this.list = res.result;
          if (this.list.length > 0) {
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
          }
          this.total = this.list.length;

         function compare(propertyName) {
           return function(object1, object2) {
             var value1 = object1[propertyName];
             var value2 = object2[propertyName];
             if (value2 < value1) {
               return 1;
             } else if (value2 > value1) {
               return -1;
             } else {
               return 0;
             }
           }
         };
         this.list.sort(compare("createTime"))

        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAssetsSum() {
      this.$http
        .get("/admin/sysAdmin/getMainInfo", {
          member: window.localStorage.getItem("userId"),
        })
        .then((res) => {
          this.sumData = res.result;
          window.localStorage.setItem("memberInfo", JSON.stringify(res.result));
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取合约配置
    getContractConfig(ID) {
      this.$http
        .get("/admin/sysAdmin/getOneContractConfig", {
          member: window.localStorage.getItem("userId"),
        })
        .then((res) => {
          this.sumData = res.result;
          window.localStorage.setItem("memberInfo", JSON.stringify(res.result));
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submit() {
      // console.log(this.modifyData, "设置合约参数");
      this.$http
        .post1("/admin/sysAdmin/setContractConfig", this.modifyData)
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.paramterModal = false;
          this.getList();
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
      this.listQuery.type = "GROUP";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.listQuery.mail = "";
      this.getList();
    },
    // 获取用户资产列表
    // getCommInfoList() {
    //   this.listQuery.member = window.localStorage.getItem("userId");
    //   this.$http
    //     .get("/admin/sysAdmin/getBalanceList", this.listQuery)
    //     .then((res) => {
    //       this.list = res.result.records;
    //       this.total = res.result.total;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    modifyClick(row) {
      // console.log(row.row);
      this.modifyData = row.row;
      // this.getContractConfig(this.modifyData.id);
      this.paramterModal = true;
    },
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
