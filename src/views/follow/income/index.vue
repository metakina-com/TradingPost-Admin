<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px"
            >邮箱</span
          >
          <el-input
            placeholder="邮箱"
            v-model.trim="listQuery.mail"
            style="width: 140px"
            class="filter-item"
          />
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="开始时间"
          >
          </el-date-picker>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.endTime"
            type="datetime"
            placeholder="结束时间"
          >
          </el-date-picker>
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
          <span class="demonstration" style="margin: 0px 10px 0px 10px"
                >收益</span
              >
              <el-input
              :value="Value"
                placeholder="总收益"
                style="width: 140px"
                class="filter-item"
              />
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
      <el-table-column
        prop="mail"
        label="邮箱"
        min-width="70"
        align="center"
      >
      </el-table-column>

      <!-- <el-table-column prop="type" label="姓名" min-width="70" align="center"> -->
      </el-table-column>
      <el-table-column
        prop="fromMail"
        label="来源"
        min-width="70"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="balance"
        label="收益"
        min-width="70"
        align="center"
        show-overflow-tooltip
      />
      <!-- <el-table-column prop="type" label="类型" min-width="80" align="center" show-overflow-tooltip  >
        <template slot-scope="scop">
            <p v-if="scop.row.type == 'TEACH'"> 交易员 </p>
            <p v-if="scop.row.type == 'SD'"> 手动平仓 </p>
            <p v-if="scop.row.type == 'CANCEL'"> 已撤销 </p>
            <p v-if="scop.row.type == 'BC'"> 爆仓 </p>
            <p v-if="scop.row.type == 'ZY'"> 止盈平仓 </p>
            <p v-if="scop.row.type == 'ZS'"> 止损平仓 </p>
            <p v-if="scop.row.type == 'ZSJ'"> 委托进持仓 </p>
          </template>
      </el-table-column> -->


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

      <el-table-column
        prop="createTime"
        label="时间"
        min-width="70"
        align="center"
        show-overflow-tooltip
      />

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
      status: [
        { label: "成功", index: 1 },
        { label: "失败", index: 2 },
      ],
      sumData: "", //
      Value:"",
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
        .get("/admin/sysAdmin/getTeachProfitHistory", this.listQuery)
        .then((res) => {
          this.list = res.result.result.records;
          this.list.forEach((element) => {
            element.createTime = this.getDatetime(element.createTime);
          });
          this.total = res.result.result.total;
          this.Value = res.result.sumBalance;
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
