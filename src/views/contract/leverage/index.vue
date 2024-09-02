<template>
    <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
    <div class="tabel-conter">
        <div class="row-item">
          <div class="input-item">
                <el-select  v-model="listQuery.pairName"  placeholder="请选择交易对名称">
                    <el-option  v-for="item in options" :key="item"   :label="item" :value="item">
                    </el-option>
                </el-select>
          </div>
            <el-button  type="primary"   @click="handleFilter" >搜索</el-button> 
            <el-button  plain   @click="reset" >重置</el-button> 
  
          </div>
        <div class="row-item">
          <el-button  type="primary" plain icon="el-icon-plus"  @click="addLsit "  >添加</el-button > 
        </div>
      <el-table :data="list" border tooltip-effect="dark"  style="width: 100%">
        <el-table-column prop="pairsName" label="交易对名称"  align="center" />

        <el-table-column prop="lever" label="杠杆倍数" align="center" >
          <template slot-scope="row">
            <span v-if="row.row.lever == ''"></span>
            <span v-else>{{ row.row.lever }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="leverDesc" label="杠杆倍数描述"  align="center" />
       
        <el-table-column
          label="操作"
          align="center"
          min-width="100"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="row">
              <el-button type="primary" size="mini" @click="edit(row.row)">
              编辑</el-button>
            
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
      <el-dialog :visible.sync="addModal" width="600px" :title="modeType" @close="colseDialog('form')">
        <el-form   :model="form" ref="form" :rules="rules"    label-position="right" size="small"  label-width="130px" >
            <el-form-item label="交易对名称" prop="pairsName">
                <el-select  v-model="form.pairsName"  placeholder="请输入关键词">
                    <el-option  v-for="item in options" :key="item"   :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="杠杆倍数:" prop="lever">
                 <el-input v-model="form.lever" />
            </el-form-item>
            <el-form-item  label="杠杆倍数描述:" prop="leverDesc">
                 <el-input v-model="form.leverDesc" />
            </el-form-item>
          
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
    </div>
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
          pairName: "",
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
          lever:'',
          leverDesc:'',
          pairsName:''
        
        }, // 添加数据
        modeType : '',
        modifyData: {},
        multipleSelection:[],
        paramterModal: false, //
        yearModal:false,//天数与年利率弹出框
        yearList:[],
        rules: {
            leverDesc: [
              { required: true, message: '请输入杠杆描述', trigger: 'blur' },
            ],
            lever: [
              { required: true, message: '请输入杠杆倍数', trigger: 'change' }
            ],
            pairsName: [
              { required: true, message: '请选择交易对', trigger: 'change' }
            ],
          }
  
        
      };
    },
    created() {
      setTimeout(() => {
        this.listLoading = false;
      }, 3000);
      this.getList();
      this.getOptainList()
    },
    methods: {
   
    
      
      
      getList() {
        this.listLoading = true;
        (this.listQuery.member = window.localStorage.getItem("userId")),
          // 杠杆配置列表
          this.$http
            .get("/admin/sysAdmin/levelList", this.listQuery)
            .then((res) => {
                console.log('杠杆配置列表--------',res);
              this.list = res.result.records;
              this.total = res.result.total;
            })
            .catch((err) => {
              console.log(err);
            });
      },
      getOptainList() {
          this.options=[]
          // 交易对列表
          this.$http
            .get("/admin/sysAdmin/pairNameList", )
            .then((res) => {
                console.log('交易对列表------',res);
                if(res.status== "SUCCEED"){
                    this.options = res.result;
                }
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
        this.form.id='',
          this.form.lever='',
          this.form.leverDesc='',
          this.form.pairsName=''
     
        this.addModal=false
        // location.reload()
      },
      checkTime(e){
        console.log('时间----',e);
      },
      addLsit () {
        //  this.$refs['form'].resetFields();
        //  this.$nextTick(()=>{
        //   this.$refs['form'].resetFields()
        // })
   
          this.form.id='',
          this.form.lever='',
          this.form.leverDesc='',
          this.form.pairsName=''
     
        this.modeType='新增杠杆'
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
       this.modeType='编辑杠杆'
       this.addModal = true;
      },
      submitDialog(formName) {
          if(this.modeType == '新增杠杆'){
              delete this.form.id;//删除id属性
          }
         
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('提交---',this.form);
            this.$http
              .post1("/admin/sysAdmin/inOrUpLevel", this.form)
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

  
      // 搜索
      handleFilter() {
        setTimeout(() => {
          this.listLoading = false;
        }, 3000);
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = 20;
        this.getList();
      },
      // 重置
      reset() {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = 20;
        this.listQuery.pairName = "";
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
  .user {
  width: 95%;
  margin: 50px auto;
}
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
  