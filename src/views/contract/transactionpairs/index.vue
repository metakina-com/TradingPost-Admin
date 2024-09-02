<template>
    <div class="user">
      <h3>合约交易对配置</h3>
      <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
    
        <el-table-column prop="pairsName" label="交易对" min-width="90" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态"  align="center"   width="120">
            <template slot-scope="row">
            <span v-if="row.row.state =='NORMAL'">正常</span>
            <span v-if="row.row.state =='FROZEN'">冻结</span>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="币种类型"  align="center"   width="120">
            <template slot-scope="row">
            <span v-if="row.row.type =='MAIN_COIN'">主币</span>
            <span v-if="row.row.type =='PROJECT_COIN'">项目币</span>
            </template>
        </el-table-column>
      
        <el-table-column prop="" label="支持交易类型"  align="center"   width="120">
        <template slot-scope="row">
          <span v-if="row.row.tradeType =='ALL'">全部</span>
          <span v-if="row.row.tradeType =='SPOT'">币币</span>
          <span v-if="row.row.tradeType =='CONTRACT'">合约</span>
        </template>
      
     </el-table-column>
     <!-- <el-table-column prop="" label="是否开启人"  align="center"   width="120">
            <template slot-scope="row">
            <span v-if="row.row.isOpen =='OPEN'">已开启</span>
            <span v-if="row.row.isOpen =='CLOSE'">已关闭</span>
            </template>
        </el-table-column> -->
        
        <el-table-column prop="price" label="当前价格" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="tradeMin" label="最小交易数" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="tradeMax" label="最大交易数" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="mainFrom" label="所属链" min-width="70" align="center" show-overflow-tooltip ></el-table-column>
  
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
          </el-form-item>
          <el-form-item label="状态" prop="state" >
                <el-select v-model="modifyData.state" placeholder="请选择交易对类型 " style="width: 260px;">
                    <el-option label="正常" value="NORMAL"></el-option>
                    <el-option label="冻结" value="FROZEN"></el-option>
                </el-select>
          </el-form-item>
           <el-form-item label="币种类型" prop="type" >
            <el-select v-model="modifyData.type" placeholder="请选择交易对类型 " style="width: 260px;">
                    <el-option label="主币" value="MAIN_COIN"></el-option>
                    <el-option label="项目币" value="PROJECT_COIN"></el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="当前价格" prop="price" >
            <el-input v-model="modifyData.price" :disabled="false" class="filter-item" />
          </el-form-item>
          <el-form-item label="最小交易数" prop="tradeMin" >
            <el-input v-model="modifyData.tradeMin"  :disabled="false" class="filter-item" />
          </el-form-item>
          <el-form-item label="最大交易数" prop="tradeMax" >
            <el-input v-model="modifyData.tradeMax"  :disabled="false" class="filter-item" />
          </el-form-item>
          <el-form-item label="交易类型" prop="tradeType" >
            <el-select v-model="modifyData.tradeType" placeholder="请选择支持交易 " style="width: 260px;">
                    <el-option label="全部" value="ALL"></el-option>
                    <el-option label="币币" value="SPOT"></el-option>
                    <el-option label="合约" value="CONTRACT"></el-option>
                  </el-select>
          </el-form-item>
<!--   
          <el-form-item label="是否开启" prop="isOpen" >
            <el-select v-model="modifyData.isOpen" placeholder="请选择是否开启 " style="width: 260px;">
                    <el-option label="开启" value="OPEN"></el-option>
                    <el-option label="关闭" value="CLOSE"></el-option>
                  </el-select>
        </el-form-item> -->
          <el-form-item label="所属链" prop="mainFrom" >
            <el-select v-model="modifyData.mainFrom" placeholder="请选择所属链 " style="width: 260px;">
                    <el-option label="BSC" value="BSC"></el-option>
                    <el-option label="TRON" value="TRON"></el-option>
                  </el-select>
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
        :page.sync="listQuery.pageNo"
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
          pageNo: 1,
          pageSize: 20,
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
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.$http
          .get("/admin/sysAdmin/pairList", this.listQuery)
          .then((res) => {
            console.log(res, "合约交易对配置");
            if(res.status== "SUCCEED"){
                this.list = res.result.records;
            this.total = this.list.length;
            }
            
          })
          .catch((err) => {
            console.log(err);
          });
      },
      submit() {
        this.$http
          .post1("/admin/sysAdmin/updatePair", this.modifyData)
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
  
        this.listQuery.pageNo = 1;
        this.getList();
      },
      // 重置
      reset() {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = 10;
        this.getList();
      },
  
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
  