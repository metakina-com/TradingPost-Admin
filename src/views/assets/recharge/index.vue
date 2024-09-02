<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <el-input placeholder="币种" v-model.trim="listQuery.currency" style="width: 140px" class="filter-item"  />
      <!-- <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >用户类型</span
      >
      <el-select
        size=""
        v-model="listQuery.type"
        placeholder="请选择"
        style="width: 130px"
      >

      </el-select> -->
      <!-- <el-select v-model="listQuery.exOrRe" placeholder="充提类型"  style="width:130px">
        <el-option
          v-for="item in recExType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
      <el-date-picker style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime"
        type="datetime" placeholder="开始时间">
      </el-date-picker>
      <el-date-picker style="width: 150px" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime"
        type="datetime" placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="mail" label="邮箱" min-width="70" align="center">
      </el-table-column>
    
      <el-table-column prop="amount" label="充值数量" min-width="70" align="center"/>
      <el-table-column prop="currency" label="币种" min-width="70" align="center"/>

      <el-table-column label="充值截图" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <img :src="row.row.url" style="width: 150px;" alt="">
        </template>
      </el-table-column>
      
      <el-table-column prop="createTime" label="时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="70" align="center">
        <template slot-scope="row">
          <p v-if="row.row.state == 'CREATE'">待审核</p>
          <p style="color: green;" v-if="row.row.state == 'PASS'">审核通过</p>
          <p style="color: red;" v-if="row.row.state == 'REJECT'">驳回</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <el-button v-if="row.row.state == 'CREATE'" size="mini" type="primary" @click="modify(row)">
            待审核
          </el-button>
          
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        min-width="90"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button size="mini" type="primary" @click="modify(row)">
            修改
          </el-button>

        </template>
      </el-table-column> -->
    </el-table>

     <!-- 修改信息 -->
     <el-dialog :visible.sync="modifyShow" :close-on-click-modal="true">
      <el-form :data="modifyData" label-position="right" label-width="90px" style="width: 480px; ">
        <el-form-item label="充币数量">
          <el-input v-model="modifyData.amount" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="钱包地址">
          <el-input v-model="modifyData.wallet" :disabled="true" />
        </el-form-item> -->
        <el-form-item label="币种">
          <el-input v-model="modifyData.currency" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="modifyData.state" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核密码">
          <el-input v-model="modifyData.pass" />
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
import { getDatetime } from "@/api/user";
import Pagination from "@/components/Pagination";
import ItemVue from "@/layout/components/Sidebar/Item.vue";
export default {
  name: "",
  components: {
    Pagination,
  },
  data() {
    return {
      
      REmap: [],
      EXmap: [],
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
      modifyUserShow: false,
      modifyShow: false,
      modifyData: {
        userId: "",
      },
      sumData: "", //
      userType: [
        {
          label: "散户",
          value: "GROUP",
        },
        {
          label: "合伙人",
          value: "WEL",
        },
      ],
      options: [{ value: "PASS", label: "通过",  }, { value: "REJECT", label: "驳回", }, ],

      memberInfo: "", //
      Exlist: [],
     
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    // this.getSum();
    this.memberInfo = window.localStorage.getItem("memberInfo");
    console.log(this.memberInfo, "member");
  },
  methods: {
    
    getList() {
      this.listLoading = true;
      // 获取充提币
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getRechargeImgs", this.listQuery)
        .then((res) => {
          this.list = res.result.records || [];
          this.list.forEach((element) => {
            element.createTime = this.getDatetime(element.createTime);
          });
          this.total = res.result.total;

          function compare(element) {
            return function (object1, object2) {
              var value1 = object1[element];
              var value2 = object2[element];
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
    modify(row){
      this.modifyData = row.row;
      this.modifyData.state = '';
      this.modifyShow = true;
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
    // 重置
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 10;
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.listQuery.mail = "";
      this.getList();
    },
    // 添加
    addmarketClick() { },

    modifyConfirm() {
      this.$http
        .post(`/admin/sysAdmin/setRechargeImg`, this.modifyData)
        .then((res) => {
          if(res.status == 'SUCCEED'){
            this.$message({
            message: "操作成功",
            type: "success",
          });
          this.modifyShow = false;
          this.getList();
          }else{
            this.$message({
            message: res.errorMessage,
            type: "error",
          });
          }
        })
        .catch((err) => {
          // console.log(err);
        });
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
    // 删除
    del(row) { },
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
  padding: 30px;
  min-height: 36px;
  border-left: 5px solid green;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.REjilu span {
  padding: 5px;
}

.Exjilu span {
  padding: 5px;
}
</style>
