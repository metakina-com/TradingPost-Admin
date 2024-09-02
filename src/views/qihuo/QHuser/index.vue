<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 200px" class="filter-item" />
      <!-- 二改新增 -->
     <el-select v-model="listQuery.biaoji" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="shaixuan">筛选</el-button> -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <!-- <el-table-column prop="uuid" label="用户ID" min-width="70" align="center">
      </el-table-column> -->
      <el-table-column prop="mail" label="邮箱" min-width="70" align="center"></el-table-column>
     
      <!-- <el-table-column prop="power" label="返金比例" min-width="70" align="center" /> -->
      
      <el-table-column prop="isAdmin" label="指定输赢" min-width="110" align="center">
        <template slot-scope="row">
          <el-tag type="danger" v-if="row.row.mircoResult == 'SJ'">正常</el-tag>
          <el-tag type="success" v-if="row.row.mircoResult == 'WIN'">必赢</el-tag>
          <el-tag type="warning" v-if="row.row.mircoResult == 'LOSS'">必输</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="注册时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="180" class-name="small-padding fixed-width">
        <template slot-scope="row">
        
          <el-button size="mini" type="primary" @click="modify(row)">
            指定输赢
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="modifyShow">
      <el-form :data="modifyData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="modifyData.mail" :disabled="true" />
        </el-form-item>
        <el-form-item label="指定输赢模式" prop="result">
          <el-select v-model="modifyData.result" placeholder="请选择">
            <el-option key="WIN" label="赢" value="WIN"> </el-option>
            <el-option key="LOSS" label="输" value="LOSS"> </el-option>
            <el-option key="SJ" label="随机" value="SJ"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作密码" prop="pass">
          <el-input v-model="modifyData.pass" type="text" />
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false">
          关闭
        </el-button>
        <el-button type="primary" @click="setMemberHd(modifyData)">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="markShow">
      <el-form :data="markData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="markData.mail" :disabled="true" />
        </el-form-item>
        <el-form-item label="标记">
          <el-select v-model="markData.mark" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false">
          关闭
        </el-button>
        <el-button type="primary" @click="setMemberBiaoJ(markData)">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改信息 -->

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
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
        type: "GROUP", // GROUP WEL
        startTime: "",
        endTime: "",
        // 新增二改
        biaoji:"",
      },

      list: null,
      total: 0,
      listLoading: true,
      modifyShow: false,
      modifyData: {
        userId: "",
        result:'',
        pass:'',
      },
      markShow: false,
      markData: {},
      sumData: {
        sumExBalance: "",
        sumReBalance: "",
        sumTodayExBalance: "",
        sumTodayReBalance: "",
      }, //
      userType: [
        {
          label: "散户",
          value: "GROUP",
        },
        {
          label: "合伙人",
          value: "WEL",
        },
        {
          label: "全部",
          value: "",
        },
      ],
      options: [
        {
          value: "刷",
          label: "刷",
        },
        {
          value: "大",
          label: "大",
        },
        {
          value: "异",
          label: "异",
        },
        {
          value: "禁",
          label: "禁",
        },
        {
          value: "出",
          label: "出",
        },
        {
          value: "封",
          label: "封",
        },
        {
          value: "测",
          label: "测",
        },
      ],
      memberInfo: "", //
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    // this.getSum();
    // this.memberInfo = window.localStorage.getItem("memberInfo");
    // console.log(this.memberInfo, "member");
  },
  methods: {

    getList() {
      this.listLoading = true;
      // 获取用户管理
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getMembers", this.listQuery)
        .then((res) => {
          this.list = res.result.members.records;
          if (this.list.length > 0) {
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
          }
          this.total = res.result.members.total;
          this.sumData.sumExBalance = res.result.sumExBalance[0];
          this.sumData.sumReBalance = res.result.sumReBalance[0];
          this.sumData.sumTodayExBalance = res.result.sumTodayExBalance[0];
          this.sumData.sumTodayReBalance = res.result.sumTodayReBalance[0];

          function compare(propertyName) {
            return function (object1, object2) {
              var value1 = object1[propertyName];
              var value2 = object2[propertyName];
              if (value2 > value1) {
                return 1;
              } else if (value2 < value1) {
                return -1;
              } else {
                return 0;
              }
            };
          }
          this.list.sort(compare("createTime"));
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
    markSubmit(row) {
      this.markData.mail = row.row.mail;
      this.markData.id = row.row.id;
      this.markShow = true;
    },
    setMemberBiaoJ(markData) {
      let data = {};
      data.member = this.markData.id;
      data.biaoji = this.markData.mark;
      this.$http.post("/admin/sysAdmin/setMemberBiaoJi", data).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.markShow = false;
        this.getList();
      });
    },
    submit(item, type) {
      // console.log(item.row.id, "///");
      if (type == "SET") {
        this.$confirm("确认设置为代理？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.setMemberAdmin(item.row.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.$confirm("确认取消其代理？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.cancelMemberAdmin(item.row.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    // 设置合伙人为代理
    setMemberAdmin(id) {
      // console.log(id, "设置代理");
      let data = {};
      data.sonMember = id;
      this.$http.post("/admin/sysAdmin/setMemberAdmin", data).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.getList();
      });
    },
    // 取消设置合伙人为代理
    cancelMemberAdmin(id) {
      // console.log("取消代理");
      let data = {};
      data.sonMember = id;
      this.$http
        .post("/admin/sysAdmin/setMemberAdminFalse", data)
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
    setMemberHd() {
      let data = {
        member:this.modifyData.id,
        result:this.modifyData.result,
        pass:this.modifyData.pass
      }
      this.$http
        .post("/admin/sysAdmin/setMemberMicro", data)
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
    // 搜索
    handleFilter() {
      // console.log(this.listQuery, "listQuery");
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
      this.listQuery.biaoji = ''
      this.getList();
    },

    modify(row) {
      // console.log(row.row);
      this.modifyData.id = row.row.id;
      this.modifyData.mail =row.row.mail;
      this.modifyData.result = '';
      this.modifyShow = true;
    },

    // 添加
    addmarketClick() {},

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
  padding: 10px 30px;
  min-height: 36px;
  border-left: 5px solid green;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
