<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <!-- <span class="demonstration" style="margin: 0px 10px">交易对名称</span> -->
      <!-- <el-input
        placeholder="交易对名称"
        v-model.trim="listQuery.mail"
        style="width: 200px;margin-right: 10px;"
        class="filter-item"
      /> -->
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >搜索</el-button
      > -->
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="reset"
        >重置</el-button
      > -->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="addStepHD"
        >添加</el-button
      >
    </div>
 
    <el-table :data="list" border tooltip-effect="dark"   style="width: 100%">
      <el-table-column prop="pairName" label="交易对名称" align="center" width="180"/>
      <el-table-column prop="startNum" label="最小数量"  align="center" width="120" />
      <el-table-column prop="endNum" label="最大数量"  align="center" width="120"/>
      <el-table-column prop="price" label="基础价格"  align="center" width="120"/> 
      <el-table-column prop="startPrice" label="最低价格"  align="center" width="120"/> 
      <el-table-column prop="endPrice" label="最高价格"  align="center" width="120"/>
      <el-table-column prop="quStartPrice" label="浮动最低价格"  align="center" width="120"/> 
      <el-table-column prop="quEndPrice" label="浮动最高价格"  align="center" width="120"/>
      <el-table-column prop="maxCount" label="最大开仓数"  align="center" width="120"/> 

       <el-table-column prop="" label="是否开启机器人"  align="center"   width="120">
        <template slot-scope="row">
          <span v-if="row.row.isOpen =='OPEN'">已开启</span>
          <span v-if="row.row.isOpen =='CLOSE'">已关闭</span>
        </template>
     </el-table-column>
      <el-table-column prop="" label="交易对类型"  align="center"   width="120">
        <template slot-scope="row">
          <span v-if="row.row.type =='Main'">主币</span>
          <span v-if="row.row.type =='Project'">项目币</span>
        </template>
     </el-table-column>
     <el-table-column prop="" label="支持交易"  align="center"   width="120">
        <template slot-scope="row">
          <span v-if="row.row.supportTrade =='All'">都支持</span>
          <span v-if="row.row.supportTrade =='Stop'">币币</span>
          <span v-if="row.row.supportTrade =='Contract'">合约</span>
        </template>
     </el-table-column>
      <!-- <el-table-column prop="contractMul" label="合约乘数"  align="center" /> -->
      <el-table-column prop="willPrice" label="预设价格"  align="center" width="180"/> 
      <el-table-column prop="willTime" label="预设时间"  align="center" width="180"/>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
            <el-button type="primary" size="mini" @click="edit(row.row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="delate(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="addModal" width="900px">
      <el-form
        :model="addData"
        :ref="addData"
        label-position="right"
        size="small"
        label-width="130px"
        title=""
      >
      <el-row :gutter="20">
        <el-col :span="12"> 
            <el-form-item label="交易对名称:"  prop="pairName" :rules="[ { required: true, message: '交易对名称不能为空', trigger: 'blur' },]">
                    <el-input v-model="addData.pairName"  :disabled="modeType =='修改'?true:false" >
                    <template slot="append">/USDT</template></el-input>
                </el-form-item>
        </el-col>
                <el-col :span="12"> 
                <el-form-item label="基础价格:"   prop="price" :rules="[  { required: true, message: '基础价格不能为空', trigger: 'blur' }, ]" >
                <el-input v-model="addData.price" />
                </el-form-item>
            </el-col>
     </el-row>
    
     <el-row :gutter="20">
        <el-col :span="12"> 
            <el-form-item  label="最低价格:" prop="startPrice" :rules="[  { required: true, message: '最低价格不能为空', trigger: 'blur' }, ]">
          <el-input v-model="addData.startPrice" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
            <el-form-item  label="最高价格:"  prop="endPrice" :rules="[  { required: true, message: '最高价格不能为空', trigger: 'blur' }, ]"  >
            <el-input v-model="addData.endPrice" />
            </el-form-item>
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
            <el-form-item   label="浮动最低价格:" prop="quEndPrice" :rules="[  { required: true, message: '浮动最低价格不能为空', trigger: 'blur' },  ]" >
                <el-input v-model="addData.quStartPrice" />
            </el-form-item> 
       </el-col>
        <el-col :span="12">
            <el-form-item   label="浮动最高价格:" prop="quEndPrice" :rules="[  { required: true, message: '浮动最高价格不能为空', trigger: 'blur' },  ]" >
                <el-input v-model="addData.quEndPrice" />
            </el-form-item> 
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="最小数量:"  prop="startNum" :rules="[ { required: true, message: '最小数量不能为空', trigger: 'blur' },]">
          <el-input v-model="addData.startNum" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
            <el-form-item label="最大数量:"  prop="endNum" :rules="[{ required: true, message: '最大数量不能为空', trigger: 'blur' }, ]">
                 <el-input v-model="addData.endNum" />
            </el-form-item>
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="交易对类型:"  prop="type" :rules="[ { required: true, message: '请选择交易对类型', trigger: 'change' },]">
          <el-select v-model="addData.type" placeholder="请选择交易对类型 " style="width: 260px;">
                    <el-option label="主币" value="Main"></el-option>
                    <el-option label="项目币" value="Project"></el-option>
                  </el-select>
        </el-form-item>
       </el-col>
        <el-col :span="12">
          <el-form-item label="支持交易:"  prop="supportTrade" :rules="[ { required: true, message: '请选择支持交易', trigger: 'change' },]">
                 <el-select v-model="addData.supportTrade" placeholder="请选择支持交易 " style="width: 260px;">
                    <el-option label="都支持" value="All"></el-option>
                    <el-option label="币币" value="Stop"></el-option>
                    <el-option label="合约" value="Contract"></el-option>
                  </el-select>
        </el-form-item>
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="预设价格:"  prop="willPrice" :rules="[ { required: true, message: '预设价格不能为空', trigger: 'blur' },]">
          <el-input v-model="addData.willPrice" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
            <el-form-item label="预设时间:"  prop="willTime" :rules="[{ required: true, message: '预设时间不能为空', trigger: 'blur' }, ]">
                <el-date-picker
                    v-model="addData.willTime"	
                    :picker-options="pickerOption"		
                    type="datetime"	
                    size="small"	
                    style="width: 290px;"
                    value-format="yyyy-MM-dd HH:mm:ss"	
                    placeholder="选择日期时间"
                    />
            </el-form-item>
         
        </el-col>
     </el-row>
     <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="最大开仓数:"  prop="maxCount" :rules="[ { required: true, message: '最大开仓数不能为空', trigger: 'blur' },]">
          <el-input v-model="addData.maxCount" />
        </el-form-item>
       </el-col>
       <el-col :span="12">
        <el-form-item label="是否开启机器人:"  prop="isOpen" :rules="[ { required: true, message: '请选择是否开启机器人', trigger: 'blur' },]">
          <el-select v-model="addData.isOpen" placeholder="请选择是否开启机器人 " style="width: 260px;">
                    <el-option label="开启" value="OPEN"></el-option>
                    <el-option label="关闭" value="CLOSE"></el-option>
                  </el-select>
        </el-form-item>
      </el-col>
       
        <!-- <el-col :span="12">
            <el-form-item label="合约乘数:"  prop="contractMul" :rules="[{ required: true, message: '合约乘数不能为空', trigger: 'blur' }, ]">
                 <el-input v-model="addData.contractMul" />
            </el-form-item>
        </el-col> -->
     </el-row>
     <!-- isRecharge（0-否，1-是），
      tronContract-tron链合约地址
      ，bscContract-bsc链合于地址
    isRecharge
    tronContract
    bscContract
    -->
     <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="是否支持充提币:"  prop="isRecharge" :rules="[ { required: true, message: '请选择是否支持充提币', trigger: 'change' },]">
          <el-select v-model="addData.isRecharge" placeholder="请选择是否支持充提币 " style="width: 260px;">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
        </el-form-item>
       </el-col>
       
     </el-row>
     <div v-if="addData.isRecharge == '1'">
      <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="tron合约地址:"  prop="tronContract" >
          <el-input v-model="addData.tronContract" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
          <el-form-item label="tron精度:"  prop="tronPrecision" >
            <el-input v-model="addData.tronPrecision"  type="number" />
        </el-form-item>
        </el-col>
     </el-row>
     </div>
     <div v-if="addData.isRecharge == '1'">
      <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="bcs合约地址:"  prop="bscContract" >
          <el-input v-model="addData.bscContract" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
          <el-form-item label="bcs精度:"  prop="bscPrecision" >
            <el-input v-model="addData.bscPrecision" type="number" />
        </el-form-item>
        </el-col>
     </el-row>
     </div>

     <div v-if="addData.isRecharge == '1'">
      <!-- ethContract，ethPrecision -->
      <el-row :gutter="20">
        <el-col :span="12"> 
         <el-form-item label="eth合约地址:"  prop="ethContract" >
          <el-input v-model="addData.ethContract" />
        </el-form-item>
       </el-col>
        <el-col :span="12">
          <el-form-item label="eth精度:"  prop="ethPrecision" >
              <el-input v-model="addData.ethPrecision" type="number" />
          </el-form-item>
        </el-col>
     </el-row>
     </div>
     
     
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="addModal=false"> 关闭 </el-button>
        <el-button type="primary" @click="setMemberHdJt(addData)">
          确定
        </el-button>
      </div>
    </el-dialog>

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
        pageSize: 20,
        mail: "",
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
      addData: {
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
        type:'',
        supportTrade:'',
        isOpen:'OPEN',
        isRecharge:'',
        tronContract:'',
        bscContract:'',
        tronPrecision:'',
        bscPrecision:'',
        ethContract:'',
        ethPrecision:''
      }, // 添加数据
      modeType : '',
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
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    getList() {
      this.listLoading = true;
      (this.listQuery.member = window.localStorage.getItem("userId")),
        // 机器人配置列表
        this.$http
          .get("/admin/sysAdmin/getRobotList", this.listQuery)
          .then((res) => {
            this.list = res.result.records;
            // if (this.list.length > 0) {
            //   this.list.forEach((element) => {
            //     element.createTime = this.getDatetime(element.createTime);
            //   });
            // }
            this.total = res.result.total;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    
    addStepHD() {
      setTimeout(() => {
       
        this.addData.pairName='', // 交易对名称
        this.addData.startNum='',
        this.addData.endNum='',
        this.addData.price='',
        this.addData.startPrice='',
        this.addData.endPrice='',
        this.addData.quStartPrice='',
        this.addData.quEndPrice='',
        this.addData.maxCount='',
        this.addData.contractMul='',
        this.addData.willPrice='',
        this.addData.willTime='',
        this.addData.type='',
        this.addData.supportTrade='',
        this.addData.isOpen='OPEN',
        this.addData.isRecharge='',
        this.addData.tronContract='',
        this.addData.bscContract='',
        this.addData.tronPrecision='',
        this.addData.bscPrecision='',
        this.addData.ethContract='',
        this.addData.ethPrecision=''
      }, 20);
      this.modeType='新增'
      this.addModal = true;
    },
    edit(row){
        console.log('点击编辑-----',row);
    //  setTimeout(() => {
    //    this.addData.pairName='', 
    //    this.addData.startNum='',
    //    this.addData.endNum='',
    //    this.addData.startPrice='',
    //    this.addData.endPrice=''
    //  }, 1000);
//    let a =  row.pairName.substr(0,-4);
       row.pairName= row.pairName.split("/")[0];
    console.log('名称---', row.pairName);
    console.log('编辑------',row);
    
     for (let attr in row) {
        if (row[attr] == null) {
          row[attr] = "";
        }
      }
      const listAssign = ((arrA, arrB) => Object.keys(arrA).forEach(key => { arrA[key] = arrB[key] || arrA[key]}));
      listAssign(this.addData, row) //把row中的value对应到form中
      console.log('uuuurow编辑---',this.addData);
     this.modeType='修改'
     this.addModal = true;
    },
    setMemberHdJt(addData) {
        if(this.modeType == '新增'){
            delete this.addData.id;//删除id属性
            if( this.addData.pairName.includes('/USDT') || this.addData.pairName.includes('/usdt') || this.addData.pairName.includes('/')){
                this.$message.warning('请输入正确的交易对名称')
                return
            }
          
        }
       
      this.$refs[addData].validate((valid) => {
        if (valid) {
          console.log('modeType---',this.modeType);
           this.addData.pairName=this.addData.pairName +'/USDT'
          console.log('传参',this.addData);
          this.$http
            .post1("/admin/sysAdmin/inOrUpRobot ", this.addData)
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
      console.log(addData);
    },
    // 删除
    delate(row) {
      console.log(row.row);
      this.$confirm("此操作将永久该条配置, 是否继续?", "提示", {
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
        .get("/admin/sysAdmin/deleteRobot", data)
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
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.listQuery.pageNum = 1;
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
.user {
  width: 95%;
  margin: 50px auto;
}
.header-tabel{
    background: #99a9bf;
}
.el-tabel th.el-tabel_cell{
    background-color: transparent;
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
