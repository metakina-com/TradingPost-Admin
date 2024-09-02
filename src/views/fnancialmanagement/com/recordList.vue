<template>
  <div class="tabel-conter">
      <div class="row-item">
        <div class="input-item">
          <el-input v-model="listQuery.address" placeholder="请输入钱包地址" style="width: 260px;"/>
        </div>
        <div class="input-item">
            <el-select v-model="listQuery.status" placeholder="全部状态" style="width: 260px;">
              <el-option label="持仓中" value="Hold"></el-option>
              <el-option label="已赎回" value="Ransom"></el-option>
            </el-select>
        </div>
        <div class="input-item">
          <!-- <el-select v-model="listQuery.type" placeholder="请选择理财类型 " style="width: 260px;">
              <el-option label="定期" value="0"></el-option>
              <el-option label="活期" value="1"></el-option>
            </el-select> -->
            <el-select v-model="listQuery.tokens" placeholder="请选择理财币种 " style="width: 260px;">
                    <el-option label="ETH" value="ETH"></el-option>
                    <el-option label="BTC" value="BTC"></el-option>
                    <el-option label="USDT" value="USDT"></el-option>
                  </el-select>
        </div>
        <!-- <div class="input-item">
          <el-date-picker style="width:260px"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.mail"
            type="datetime"
            placeholder="时间"
          >
          </el-date-picker>
        </div> -->
          <el-button  type="primary"   @click="handleFilter" >搜索</el-button> 
          <el-button  plain   @click="resetForm" >重置</el-button> 

        </div>
      <!-- <div class="row-item">
        <el-button  type="primary"   icon="el-icon-folder"   >导出</el-button > 
      </div> -->
    <el-table :data="list" border tooltip-effect="dark"  style="width: 100%" >
      <el-table-column prop="id" label="订单号" align="center" />
      <el-table-column prop="address" label="钱包地址"  align="center" />
      <el-table-column prop="projectName" label="项目名称"  align="center" />
      <el-table-column prop="tokens" label="理财币种"  align="center" /> 
      <el-table-column prop="financAmt" label="理财金额"  align="center" /> 
      <el-table-column prop="endPrice" label="天数与年利率"  align="center" >
        <template slot-scope="row">
          <span v-if="row.row.days == 0">活期{{ row.row.yearRate }}%</span>
          <span v-else>{{ row.row.days }}天 {{ row.row.yearRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="financStatus" label="理财状态"  align="center" >
        <template slot-scope="row">
          <span v-if="row.row.financStatus == 'Ransom'">已赎回</span>
          <span v-else>持仓中</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申购时间"  align="center" />
      <el-table-column prop="ransomTime" label="赎回时间"  align="center" />
      <el-table-column prop="totalInterest" label="总利息"  align="center" />
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageSize" :limit.sync="listQuery.pageSize"  @pagination="getList"/>
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
        pageSize: 1,
        pageSize: 20,
      },
      sumData: "", //
      startTime: "",
      endTime: "",
      list: null,
      total: 0,
      listLoading: true,
      options: [
        { label: "开仓市价", value: "OPENSJ" },
        { label: "开仓限价", value: "OPENXJ" },
        { label: "平仓市价", value: "CLOSESJ" },
        { label: "平仓限价", value: "CLOSEXJ" },
      ],
      pickerOption: {
            disabledDate: (time) => {
            let nowData = new Date()
            // nowData = new Date(nowData.setDate(nowData.getDate(-1))
            nowData = new Date(nowData.setDate(nowData.getDate()))
            return time < nowData
            }
      },
      contractParamter: "", // 合约参数配置
      userType: {}, //
      addModal: false, //
      form: {
        id:'',
        pairName:'', // 交易对名称
        startNum:'',
        endNum:'',
        price:'',
        startPrice:'',
        endPrice:'',
        quStartPrice:'',
        quEndPrice:'',
        maxCount:'',
        contractMul:'',
        willPrice:'',
        willTime:'',
        domains: [{
            value: '',
            catch:'',
          }],
      }, // 添加数据
      modeType : '',
      modifyData: {},
      multipleSelection:[],
      paramterModal: false, //
      rules: {
        pairName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }

      
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
  },
  methods: {
    resetForm() {
        this.listQuery.pageSize= 20,
        this.listQuery.address= "",
        this.listQuery.tokens="",
        this.listQuery.status=""
        this.getList();
      },
  
    getList() {
      this.listLoading = true;
      (this.listQuery.member = window.localStorage.getItem("userId")),
        // 理财记录列表
        this.$http
          .get("/admin/finanAdmin/recordList", this.listQuery)
          .then((res) => {
            this.list = res.result.records;
            this.total = res.result.total;
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
      this.listQuery.pageSize = 1;
      this.getList();
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
.tabel-conter {
  width: 100%;
  margin: 20px auto;
  .row-item{
    display: flex;
    margin-bottom: 20px;
    .input-item{
      margin-right: 10px;
    }
  }
}
.addBtn{
  cursor: pointer;
  color: #409eff;
  height: 32px;
  line-height: 32px;
  margin-bottom: 18px;
}
.delBtn{
  cursor: pointer;
  color: red;
  height: 32px;
  line-height: 32px;
  margin-bottom: 18px;
}
</style>
