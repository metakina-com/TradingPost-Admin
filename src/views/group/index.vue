<template>
  <div class="user">
    <!-- <el-row :gutter="20">
      <el-col :span="24" :xs="24" style="margin-bottom: 5px"
        ><div class="bg-purple" style="padding: 10px">
          <h3><span>欢迎回来</span> {{ data.mail }}</h3>
          <h5>我的返佣比例 {{ data.power }}</h5>
          <h5>
            我的邀请链接
            {{
              data.quickMark
                ? data.quickMark.substring(0, 6) +
                  "...." +
                  data.quickMark.substring(
                    data.quickMark.length - 5,
                    data.quickMark.length
                  )
                : "--"
            }}
            <el-button
              @click="copy"
              size="mini"
              class="copyBtn"
              icon="el-icon-document-copy "
              circle
              :data-clipboard-text="data.quickMark"
            ></el-button>
          </h5></div
      ></el-col>
    </el-row> -->
    <el-row :gutter="20">
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>
            注册总人数 {{ data.sumMemberCount ? data.sumMemberCount : 0 }}
          </h3>
          <h5>
            今日注册人数 {{ data.todayMemberCount ? data.todayMemberCount : 0 }}
          </h5>
          <h5>
            昨日注册人数
            {{ data.yesTodayMemberCount ? data.yesTodayMemberCount : 0 }}
          </h5>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>今日手续费 {{ data.todaySumFee ? data.todaySumFee : 0 }}</h3>
          <h5>
            昨日总手续费 {{ data.yesTodaySumFee ? data.yesTodaySumFee : 0 }}
          </h5>
        </div></el-col
      >
      <el-col :span="8" :xs="24" style="margin-bottom: 5px"
        ><div class="grid-content bg-purple">
          <h3>
            今日交易人数 {{ data.todayTradeCount ? data.todayTradeCount : 0 }}
          </h3>
          <h5>
            昨日交易人数 {{ data.yesTradeCount ? data.yesTradeCount : 0 }}
          </h5>
        </div></el-col
      >
    </el-row>
    <div>
      <el-row>
        <el-col :span="24" :xs="24"
          ><div class="bg-purple content">
            <h3>用户总资产折合 {{ data.sumBalance }}</h3>
            <h5>总入金折合 {{ data.sumRechargeBalance }}</h5>
            <h5>总出金折合 {{ data.sumExBalance }}</h5>
            <!-- <h5>总入金人数 {{ data.sumRechargeCount }}</h5> -->
            <h5></h5></div
        ></el-col>
        <!-- <el-col :span="8" :xs="24"
          ><div class="bg-purple content">
            <h2></h2>
            <h5>今日入金折合 {{ data.sumTodayReBalance }}</h5>
            <h5>今日入金人数 {{ data.sumTodayReCount }}</h5>
            <h5>昨日入金折合 {{ data.sumYeReBalance }}</h5>
            <h5>昨日入金人数 {{ data.sumYeReCount }}</h5>
          </div></el-col
        > -->
        <!-- <el-col :span="8" :xs="24"
          ><div class="bg-purple content">
            <h2></h2>
            <h5>今日出金折合 {{ data.sumTodayExBalance }}</h5>
            <h5>今日出金人数 {{ data.sumTodayExCount }}</h5>
            <h5>昨日出金折合 {{ data.sumYesExBalance }}</h5>
            <h5>昨日出金人数 {{ data.sumYesExCount }}</h5>
          </div></el-col
        > -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { getDatetime } from "@/api/user";
import Pagination from "@/components/Pagination";
import Clipboard from "clipboard";
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
        type: "",
      },
      list: null,
      total: 0,
      data: "",
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
      //
      this.$http
        .get("/admin/sysAdmin/getMainInfo", {
          member: window.localStorage.getItem("userId"),
        })
        .then((res) => {
          // console.log(res.result);
          this.data = res.result;
          Object.keys(this.data).forEach((key) => {
            if (this.data[key].toString().indexOf("0E-8") != -1) {
              this.data[key] = new Number(this.data[key]);
            }
          });

          window.localStorage.setItem("memberInfo", JSON.stringify(res.result));
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    copy() {
      var clipboard = new Clipboard(".copyBtn");

      clipboard.on("success", (e) => {
        // 清除选中状态
        e.clearSelection();
        clipboard.destroy();
        this.$message({
          message: "复制成功",
          type: "success",
        });
        // clipboard.destroy();
      });
      // 4.为其指定操作失败回调函数
      clipboard.on("error", (e) => {
        clipboard.destroy();
        this.$message({
          message: "复制失败，请刷新重试",
          type: "error",
        });
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
      this.getList();
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
.el-row {
  margin-bottom: 20px;
  border-radius: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.content {
  padding: 20px;
  height: 200px;
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
  min-height: 206px;
  border-left: 5px solid green;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
