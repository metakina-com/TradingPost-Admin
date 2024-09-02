<template>
  <div class="user">
    <el-row :gutter="20">
      <el-col :span="8" :xs="24"
        ><div class="">
          <span class="demonstration" style="margin: 0px 10px 0px 10px"
            >邮箱</span
          >
          <el-input
            placeholder="邮箱"
            v-model.trim="listQuery.mail"
            style="width: 140px"
            class="filter-item"
          /></div
      ></el-col>
      <el-col :span="10" :xs="24"
        ><div class=""></div>
        <div class="">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="开始时间"
          >
          </el-date-picker>
        </div>
        <div class="">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.endTime"
            type="datetime"
            placeholder="结束时间"
          >
          </el-date-picker></div
      ></el-col>
      <el-col :span="6" :xs="24"
        ><div class="">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >搜索</el-button
          >
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="reset"
            >重置</el-button
          >
        </div></el-col
      >
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
      <el-table-column
        prop="fatherMail"
        label="邀请人"
        min-width="70"
        align="center"
      >
      </el-table-column>
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
      <el-table-column
        prop="pairsName"
        label="交易对"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="方向"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
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
        </template></el-table-column>
      <el-table-column
        prop="mainCur"
        label="币种"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="matchTime"
        label="开仓时间"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="isContractHands"
        label="开仓张数"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="avePrice"
        label="开仓均价"
        min-width="70"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="leverNum"
        label="杠杆倍数"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column
        prop="createTime"
        label="方式"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="createTime"
        label="强平价"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column
        prop="margin"
        label="保证金"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column
        prop="createTime"
        label="冻结数量"
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
      // 获取佣金汇总
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getCreateOrders", this.listQuery)
        .then((res) => {
          if (res.status == "SUCCEED") {
            this.list = res.result.records;
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
            this.list.forEach((element) => {
              element.matchTime = this.getDatetime(element.matchTime);
            });

            this.total = res.result.total;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 搜索
    handleFilter() {
      console.log(this.listQuery);
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
      this.listQuery.type = "GROUP";
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
