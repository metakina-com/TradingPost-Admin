<template>
  <div class="user">
    <h3>参数配置</h3>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="pairsName" label="交易对" min-width="90" align="center">
      </el-table-column>

      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center"> -->
      </el-table-column>
      <el-table-column
        prop="contractMul"
        label="杠杆倍数"
        min-width="50"
        align="center"
      >
      </el-table-column>

      <!-- <el-table-column
        prop="isAdmin"
        label="用户类型"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column
        prop="proportion"
        label="保证金比例"
        min-width="50"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="maxCount"
        label="最大可开"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
       <el-table-column
        prop="minCount"
        label="最小可开"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="smakerFee"
        label="手续费"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="stakerFee"
        label="手续费"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="takerFee"
        label="手续费"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="tradeFee"
        label="手续费"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column
        prop="minCount"
        label="最小可开"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scop">
          <p>
            {{ scop.row.tokenBalance + scop.row.balance }}
          </p>
        </template>
      </el-table-column> -->

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

    <el-dialog :visible.sync="paramterModal" >
      <el-form :data="modifyData"  label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="交易对" prop="pairsName" >
          <el-input v-model="modifyData.pairsName" :disabled="true"/>
          <!-- <span style="color:red" v-show="showError == true">* 管理员账号必须以admin_开头</span> -->
        </el-form-item>
        <el-form-item label="杠杆倍数" prop="contractMul" >
          <el-input v-model="modifyData.contractMul	" :disabled="false" class="filter-item" />
        </el-form-item>
         <el-form-item label="保证金比例" prop="proportion" >
          <el-input v-model="modifyData.proportion	" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="最大可开" prop="maxCount" >
          <el-input v-model="modifyData.maxCount" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="最小可开" prop="minCount" >
          <el-input v-model="modifyData.minCount"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="手续费" prop="smakerFee" >
          <el-input v-model="modifyData.smakerFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="手续费" prop="stakerFee" >
          <el-input v-model="modifyData.stakerFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="手续费" prop="takerFee" >
          <el-input v-model="modifyData.takerFee"  :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="手续费" prop="tradeFee" >
          <el-input v-model="modifyData.tradeFee"  :disabled="false" class="filter-item" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paramterModal = false">
          关闭
        </el-button>
         <el-button type="primary" @click="addRole(modifyData)">
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
          console.log(res, "参数配置");
          this.list = res.result;
          this.total = this.list.length;
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
      console.log(row.row);
      this.modifyData = row.row;
      // this.getContractConfig(this.modifyData.id);
      this.paramterModal = true;
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
