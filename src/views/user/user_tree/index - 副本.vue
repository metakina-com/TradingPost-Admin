<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 240px" class="filter-item" />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="reset">重置</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <div style="margin-bottom: 10px;">
      <span>团队收益：</span>
      <!-- <span>{{this.listQuery.mail}}</span> -->
    </div>
    <el-row :gutter="20" style="padding: 0">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span>伞下总人数</span>
          <span>
            {{ sumData.sumMember || "--" }}
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span>伞下总持资金</span>
          <span>
            {{ sumData.sumBalance || "--" }}
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span>伞下总收益</span>
          <span>{{ sumData.sumProfit || "--" }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span>伞下总手续费</span>
          <span> {{ sumData.sumFee || "--" }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span>伞下总充值</span>
          <span>{{ sumData.sumRechargeBalance || "--" }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span>伞下总提现</span>
          <span>
            {{ sumData.sumExBalance || "--" }}
          </span>
        </div>
      </el-col>
    </el-row>

    <!-- <div style="margin-bottom: 10px;">
      <span>团队长详情：</span>
      <span>{{this.listQuery.mail}}</span>
    </div>
      <span>
            <span style="margin: 0 10px">伞下总人数：{{ sumData.sumMember || "--" }}</span>
            <span style="margin: 0 10px">总持资金： {{ sumData.sumBalance || "--" }}</span>
            <span style="margin: 0 10px">总收益： {{ sumData.sumProfit || "--" }}</span>
            <span style="margin: 0 10px">总书续费： {{ sumData.sumFee || "--" }}</span>
            <span style="margin: 0 10px">总充值： {{ sumData.sumRechargeBalance || "--" }}</span>
            <span style="margin: 0 10px">总提现： {{ sumData.sumExBalance || "--" }}</span>
          </span> -->


    <div style="margin:10px 0 5px 0;">
      <span>用户层级关系：</span>
    </div>
    <!-- :default-expand-all="true" -->
    <el-tree :data="data" :props="defaultProps" node-key="id" :expand-on-click-node="false"
      @node-click="handleNodeClick" :highlight-current="true"  >
      <div class="custom-tree-node" slot-scope="{ node, data }" style="width: 100%">
        <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          ">

          <span>
            <span style="margin: 0 10px">邮箱：{{ node.label }}</span>
            <span style="margin: 0 10px">总充值： {{ data.sumReBalance }}</span>
            <span style="margin: 0 10px">总提现： {{ data.exCoinBalance }}</span>
            <span style="margin: 0 10px">总收益： {{ data.sumProfit }}</span>
            <span style="margin: 0 10px">总手续费： {{ data.sumFee }}</span>
          </span>
          <el-button type="text" size="mini" @click="() => append(data)">
            {{chakanXiaji}}
          </el-button>
        </div>
      </div>
    </el-tree>

    <el-dialog :visible.sync="modifyShow">
      <el-form :data="modifyData" label-position="left" label-width="100px" style="width: 400px; margin-left: 50px">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="modifyData.mail" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="反金比例" prop="power">
          <el-input v-model="modifyData.power" :disabled="false"/>
        </el-form-item> -->
        <el-form-item label="开空滑点" prop="openDownHd">
          <el-input v-model="modifyData.openDownHd" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="开多滑点" prop="openUpHd">
          <el-input v-model="modifyData.openUpHd" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="平空滑点" prop="closeDownHd">
          <el-input v-model="modifyData.closeDownHd" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="平多滑点" prop="closeUpHd">
          <el-input v-model="modifyData.closeUpHd" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="开仓手续费" prop="takeFee">
          <el-input v-model="modifyData.takeFee" :disabled="false" class="filter-item" />
        </el-form-item>
        <el-form-item label="平仓手续费" prop="makerFee">
          <el-input v-model="modifyData.makerFee" :disabled="false" class="filter-item" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false"> 关闭 </el-button>
        <el-button type="primary" @click="setMemberHd(modifyData)">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改信息 -->
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
        chakanXiaji: "查看下级",
        listQuery: {
          mail: "",
        },
        list: null,
        total: 0,
        data: [],
        listLoading: true,
        modifyShow: false,
        modifyData: {
          userId: "",
        },
        defaultProps: {
          children: "children",
          label: "label",
        },
        sumData: {}, //
        userType: [{
            label: "散户",
            value: "GROUP"
          },
          {
            label: "合伙人",
            value: "WEL"
          },
          {
            label: "全部",
            value: ""
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
    },
    mounted() {
    },
    methods: {


      getList() {
        if (this.listQuery.mail == "") {
          return;
        }
        this.listLoading = true;
        // 获取用户管理
        this.listQuery.member = window.localStorage.getItem("userId");
        this.$http
          .get("/admin/sysAdmin/zkMembers", this.listQuery)
          .then((res) => {
            this.list = res.result.welMembers;
            // console.log(this.list[0].children)
            this.sumData = res.result;

            // var obj = {}
            // this.list[0].children.push(obj);
            // console.log(obj)


            Object.keys(this.sumData).forEach((key) => {
              if (this.sumData[key].toString().indexOf("0E-8") != -1) {
                this.sumData[key] = new Number(this.sumData[key]);
              }
            });

            this.data = [];
            this.data.children;
            this.list.forEach((item) => {
              var obj = {};
              obj.label = item.mail;
              obj.children = [];
              obj.exCoinBalance = item.exCoinBalance;
              obj.sumReBalance = item.sumReBalance;
              obj.sumProfit = item.sumProfit;
              obj.sumFee = item.sumFee;
              this.data.push(obj);
              console.log(obj)
            });


            if (this.list.length > 0) {
              this.list.forEach((element) => {
                element.createTime = this.getDatetime(element.createTime);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      append(data) {
        console.log(data);
        this.$http
          .get("/admin/sysAdmin/welMembers", {
            mail: data.label
          })
          .then((res) => {
            console.log(res.result.welMembers);
            if (res.result.welMembers) {
              data.children = [];
              res.result.welMembers.forEach((item) => {
                const newChild = {
                  id: item.id,
                  label: item.mail,
                  exCoinBalance: item.exCoinBalance,
                  sumReBalance: item.sumReBalance,
                  sumProfit: item.sumProfit,
                  sumFee: item.sumFee,
                  children: [],
                };
                if (!data.children) {
                  this.$set(data, "children", []);
                }
                data.children.push(newChild);
                console.log(data.children);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return;
      },

      handleNodeClick(data, node) {
        node.expanded = !node.expanded;
        // console.log(data);
        // console.log(data.label);
        // this.$http
        //   .get("/admin/sysAdmin/welMembers", { mail: data.label })
        //   .then((res) => {
        //     this.list = res.result;
        //     console.log(this.list);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
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
        this.listQuery.userNo = "";
        this.getList();
      },

      modify(row) {
        // console.log(row.row);
        this.modifyData = row.row;
        this.modifyShow = true;
      },

      // 添加
      addmarketClick() {},

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
    border-radius: 24px;
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
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 60px;
    border-left: 5px solid green;
  }

  .row-bg {
    padding: 0px 0;
    background-color: #f9fafc;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    // border-top: 1px solid #f5f5f5;
  }
</style>
