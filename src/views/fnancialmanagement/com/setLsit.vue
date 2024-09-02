<template>
  <div class="tabel-conter">
      <div class="row-item">
        <div class="input-item">
            <el-select v-model="listQuery.userType" placeholder="请选择用户类型 " style="width: 260px;">
              <el-option label="新用户" value="New"></el-option>
              <el-option label="全体用户" value="All"></el-option>
            </el-select>
        </div>
        <div class="input-item">
          <el-select v-model="listQuery.tokens" placeholder="请选择理财币种 " style="width: 260px;">
                    <el-option label="ETH" value="ETH"></el-option>
                    <el-option label="BTC" value="BTC"></el-option>
                    <el-option label="USDT" value="USDT"></el-option>
                  </el-select>
        </div>
          <el-button  type="primary"   @click="handleFilter" >搜索</el-button> 
          <el-button  plain   @click="resetForm" >重置</el-button> 

        </div>
      <div class="row-item">
        <el-button  type="primary" plain icon="el-icon-plus"  @click="addLsit "  >添加</el-button > 
        <!-- <el-button   type="danger" plain icon="el-icon-delete" @click="deleteList" >删除</el-button>  -->
      </div>
    <el-table :data="list" border tooltip-effect="dark"  style="width: 100%">
      <!-- @selection-change="handleSelectionChange">
      <el-table-column type="selection"  width="55">
      </el-table-column> -->
      <el-table-column prop="userType" label="用户类型" align="center" >
        <template slot-scope="row">
          <span v-if="row.row.userType == 'New'">新用户</span>
          <span v-else>全体用户</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称"  align="center" />
      <el-table-column prop="tokens" label="理财币种"  align="center" />
      <el-table-column prop="totalQuota" label="总额度"  align="center" /> 
      <el-table-column prop="buyQuota" label="个人额度"  align="center" /> 
      <el-table-column prop="" label="天数与年利率"  align="center" >
        <template slot-scope="row">
          <span @click="toCHECK(row)" style="cursor: pointer;">查看全部</span>
        </template>
     </el-table-column>
      <el-table-column prop="startTime" label="理财开始时间"  align="center" /> 
      <el-table-column prop="endTime" label="理财结束时间"  align="center" /> 

      <el-table-column prop="createTime" label="添加时间"  align="center" />
      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
            <el-button type="primary" size="mini" @click="edit(row.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="delate(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="yearModal" width="800px" title="天数与年利率" @close="yearModal=false">
        <div>
          <el-table :data="yearList"  border tooltip-effect="dark"  style="width: 100%">
              <el-table-column prop="userType" label="天数" align="center" >
                <template slot-scope="row">
                  <span v-if="row.row.days == '0'">活期</span>
                  <span v-else>{{ row.row.days }} 天</span>
                </template>
              </el-table-column>
              <el-table-column prop="yearRate" label="利率"  align="center" />
            </el-table>
        </div>
    </el-dialog>

     <!--新增或编辑 modeType  -->
    <el-dialog :visible.sync="addModal" width="1200px" :title="modeType" @close="colseDialog('form')">
      <el-form   :model="form" ref="form" :rules="rules"    label-position="right" size="small"  label-width="130px" >
        <el-row :gutter="20">
          <el-col :span="12">
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="form.userType"  placeholder="请选择用户类型 ">
              <el-option label="新用户" value="New"></el-option>
              <el-option label="全体用户" value="All"></el-option>
            </el-select>
          </el-form-item>
          
        </el-col>
          <el-col :span="12">
            <el-form-item  label="理财项目名称:" prop="projectName">
          <el-input v-model="form.projectName" />
        </el-form-item></el-col>
     </el-row>
      <el-row :gutter="20">
        <el-col :span="12"> 
                <el-form-item label="理财代币" prop="tokens">
                  <el-select v-model="form.tokens" @change="tokensChang" placeholder="请选择理财代币">
                    <el-option label="ETH" value="ETH"></el-option>
                    <el-option label="BTC" value="BTC"></el-option>
                    <el-option label="USDT" value="USDT"></el-option>
                  </el-select>
                </el-form-item>
        </el-col>
                <el-col :span="12"> 
                  <el-form-item label="奖励代币" prop="rewardTokens">
                    <el-select v-model="form.rewardTokens" disabled placeholder="请选择奖励代币">
                      <el-option label="ETH" value="ETH"></el-option>
                      <el-option label="BTC" value="BTC"></el-option>
                      <el-option label="USDT" value="USDT"></el-option>
                    </el-select>
                  </el-form-item>
            </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
          <el-form-item   label="开始时间:" prop="startTime"  >
            <el-date-picker  value-format="yyyy-MM-dd HH:mm:ss" v-model="form.startTime"
            type="datetime" placeholder="开始时间">
          </el-date-picker>
          </el-form-item>
       </el-col>
        <el-col :span="12">
          <el-form-item   label="结束时间:" prop="endTime"  >
            <el-date-picker  value-format="yyyy-MM-dd HH:mm:ss" v-model="form.endTime"
            type="datetime" placeholder="结束时间">
          </el-date-picker>
          </el-form-item>
         
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
            <el-form-item   label="本期理财总额度:" prop="totalQuota"  >
                <el-input v-model="form.totalQuota" />
            </el-form-item> 
       </el-col>
        <el-col :span="12">
            <el-form-item   label="前端销售进度:" prop="saleSpeed"  >
                <el-input v-model="form.saleSpeed" />
            </el-form-item> 
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="个人购买额度:"  prop="buyQuota" >
          <el-input v-model="form.buyQuota" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
            <el-form-item label="个人买起额度:"  prop="lowQuota" >
                 <el-input v-model="form.lowQuota" />
            </el-form-item>
        </el-col>
     </el-row>
     <el-row :gutter="20">
       <el-col :span="6">
        <el-form-item  v-for="(domain, index) in form.termList"
            :label="'天数'"  :key="domain.key"   :prop="'termList.' + index + '.days'"
            :rules="{ required: true, message: '请输入添加， 0 代表活期', trigger: 'blur' }"
          >
          <!-- <el-input v-model="domain.value"></el-input> -->
          
                    <el-select v-model="domain.days" placeholder="请选择">
                      <el-option label="活期" value="0"></el-option>
                      <el-option label="30天" value="30"></el-option>
                      <el-option label="60天" value="60"></el-option>
                      <el-option label="90天" value="90"></el-option>
                      <el-option label="365天" value="365"></el-option>
                    </el-select>
        </el-form-item>
      </el-col>
       <el-col :span="6">
        <el-form-item
            v-for="(domain, index) in form.termList"
            :label="'年利率' "
            :key="domain.key"
            :prop="'termList.' + index + '.yearRate'"
            :rules="{
              required: true, message: '1~100%', trigger: 'blur'
            }"
          >
            <el-input v-model="domain.yearRate"></el-input>
          </el-form-item>
      </el-col>
      <el-col :span="1">
        <div  v-for="(domain, index) in form.termList" :key="domain.key">
          <div class="addBtn" @click="addDomain" v-if="index == 0">添加</div>
          <div class="delBtn" v-if="index != 0" @click.prevent="removeDomain(domain)">删除</div>
        </div>
      </el-col>
       
     </el-row>
     
     
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="colseDialog('form')"> 关闭 </el-button>
        <el-button type="primary" @click="submitDialog('form')">
          确定
        </el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageSize"
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
        pageSize: 1,
        pageSize: 20,
        userType: "",
        tokens:""
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
        projectName:'',
        userType:'', 
        tokens:'',
        rewardTokens:'',
        totalQuota:'',
        saleSpeed:'',
        buyQuota:'',
        lowQuota:'',
        startTime:'',
        endTime:'',
        termList: [{
            days: '',
            yearRate:'',
          }],
      }, // 添加数据
      modeType : '',
      modifyData: {},
      multipleSelection:[],
      paramterModal: false, //
      yearModal:false,//天数与年利率弹出框
      yearList:[],
      rules: {
        projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          userType: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          tokens: [
            { required: true, message: '请选择理财币种', trigger: 'change' }
          ],
          rewardTokens: [
            { required: true, message: '请选择奖励代币', trigger: 'change' }
          ],
          totalQuota: [
            { required: true, message: '请输入总额度', trigger: 'change' }
          ],
          saleSpeed: [
            { required: true, message: '请输入前端销售进度', trigger: 'change' }
          ],
          buyQuota: [
            { required: true, message: '请输入购买额度', trigger: 'change' }
          ],
          lowQuota: [
            { required: true, message: '请输入个人买起额度', trigger: 'change' }
          ],
          // startTime: [
          //   { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
          // ],
          // endTime: [
          //   { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
          // ],
          
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
    deleteList(){},
    tokensChang(e){
      console.log('eeeeeeeeeee',e);
      this.form.rewardTokens=e

    },
    removeDomain(item) {
        var index = this.form.termList.indexOf(item)
        if (index !== -1) {
          this.form.termList.splice(index, 1)
        }
      },
      addDomain() {
        this.form.termList.push({
          value: '',
          catch:'',
          key: Date.now()
        });
      },
    resetForm() {
        this.listQuery.pageSize= 1,
        this.listQuery.pageSize= 20,
        this.listQuery.userType= "",
        this.listQuery.tokens="",
        this.getList();
      },
      //多选
      handleSelectionChange(arr) {
        console.log('多选参数----',arr);
        var newArr=arr.map((v)=> v.id);
      　console.log(newArr)  // 结果为 【1，2，3】
        var newArr2=arr.map((v)=> v.id).join();
        console.log(newArr2)  // 结果为 1,2,3
         // this.multipleSelection = val;
      },
      toCHECK(row){
        this.yearList=[]
        console.log('查看全部',row.row.termList);
        this.yearList =row.row.termList,
        this.yearModal=true
      },
    getList() {
      this.listLoading = true;
      (this.listQuery.member = window.localStorage.getItem("userId")),
        // 理财列表
        this.$http
          .get("/admin/finanAdmin/configList", this.listQuery)
          .then((res) => {
            this.list = res.result.records;
            this.total = res.result.total;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    colseDialog(formName){
      // this.$refs[formName].resetFields();
      this.$nextTick(()=>{
        this.$refs['form'].resetFields()
      })
      this.addModal=false
      location.reload()
    },
    checkTime(e){
      console.log('时间----',e);
    },
    addLsit () {
      //  this.$refs['form'].resetFields();
      //  this.$nextTick(()=>{
      //   this.$refs['form'].resetFields()
      // })
      this.modeType='新增理财'
      this.addModal = true;
    },
    edit(row){
      console.log('点击编辑-----',row);
     for (let attr in row) {
        if (row[attr] == null) {
          row[attr] = "";
        }
      }
      const listAssign = ((arrA, arrB) => Object.keys(arrA).forEach(key => { arrA[key] = arrB[key] || arrA[key]}));
      listAssign(this.form, row) //把row中的value对应到form中
      console.log('uuuurow编辑---',this.form);
     this.modeType='编辑理财'
     this.addModal = true;
    },
    submitDialog(formName) {
        if(this.modeType == '新增理财'){
            delete this.form.id;//删除id属性
            // if( this.form.pairName.includes('/USDT') || this.form.pairName.includes('/usdt') || this.form.pairName.includes('/')){
            //     this.$message.warning('请输入正确的交易对名称')
            //     return
            // }
        }
       
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('提交---',this.form);
          this.$http
            .post1("/admin/finanAdmin/inOrUpFinancing ", this.form)
            .then((res) => {
                console.log('发送---',res);
                if (res.status == 'SUCCEED') {
                    this.$message({
                        message: "操作成功",
                        type: "success",
                    });
                    setTimeout(() => {
				      location.reload();
					  this.getList();
                      this.addModal = false;
				   }, 300);
                   
                }else{
                    this.$message.error(res.errorMessage)
                }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除
    delate(row) {
      console.log(row.row);
      this.$confirm("此操作将永久该条理财产品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delMemberHd(row.row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除
    delMemberHd(id) {
      let data = {
        id,
      };
      this.$http
        .get("/admin/finanAdmin/deleteFinancing", data)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          setTimeout(() => {
            this.getList();
          }, 500);
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
    // 重置
    reset() {
      this.listQuery.pageSize = 1;
      this.listQuery.pageSize = 10;
      this.listQuery.mail = "";

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
