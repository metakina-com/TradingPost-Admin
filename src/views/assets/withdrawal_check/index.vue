<template>
  <div class="user">
    <div  
    style="min-height:100vh"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="filter-container" style="padding-bottom: 30px">
      <el-input placeholder="邮箱" v-model.trim="listQuery.mail" style="width: 140px" class="filter-item" />
      <el-input placeholder="币种" v-model.trim="listQuery.currency" style="width: 140px" class="filter-item" />
      <el-date-picker style="width:150px" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.startTime"
        type="datetime" placeholder="开始时间">
      </el-date-picker>
      <el-date-picker style="width:150px" value-format="yyyy-MM-dd HH:mm:ss" v-model="listQuery.endTime" type="datetime"
        placeholder="结束时间">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin-right: 5px;" @click="reset">重置
      </el-button>
      <!--    <el-button class="filter-item" type="primary" icon="el-icon-close-notification" @click="close">关闭提示音</el-button> -->

      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
      <!-- <audio preload="auto|metadata|none" controls="controls" loop="loop" id='MessageAudio'>
        <source src="../../../assets/14122.wav" />
      </audio> -->
      <!-- <Music /> -->
    </div>




    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <!-- <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column> -->
      <!-- <el-table-column prop="uuid" label="用户ID" min-width="70" align="center"> -->
      <!-- </el-table-column> -->
      <!-- <el-table-column
        prop="aliayName"
        label="姓名"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
      <!-- <el-table-column
        prop="fatherMember"
        label="邀请人"
        min-width="70"
        align="center"
      >
      </el-table-column> -->
      <el-table-column prop="member" label="邮箱" min-width="100" align="center"/>
      <el-table-column prop="wallet" label="钱包地址" min-width="120" align="center" show-overflow-tooltip />

      <el-table-column prop="wallet" label="资金去向" min-width="120" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column prop="" label="账户" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column> -->

      <!-- <el-table-column
        prop="putStatus"
        label="用户类型"
        min-width="70"
        align="center"
      > -->
      <!-- <template slot-scope="row">
          <p v-if="row.row.putStatus == true">允许</p>
          <p v-else>禁止</p>
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column prop="currency" label="币种" min-width="70" align="center">

      </el-table-column>
      <el-table-column prop="amount" label="金额" min-width="70" align="center">
        <template slot-scope="row">
          <p v-if="row.row.amount">{{ row.row.amount }}</p>
          <p v-else>{{ row.row.balance }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="handlingFee" label="手续费" min-width="70" align="center">

      </el-table-column>

      <el-table-column prop="state" label="状态" min-width="70" align="center">
        <template slot-scope="row">
          <p v-if="row.row.state == 'CREATE'">待审核</p>
          <p style="color: green;" v-if="row.row.state == 'PASS'">正在校验</p>
          <p style="color: green;" v-if="row.row.state == 'SUCCESS'">审核通过</p>
          <p style="color: red;" v-if="row.row.state == 'REJECT'">驳回</p>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>
       <el-table-column prop="remark" label="补录" min-width="70" align="center" show-overflow-tooltip>
        <template slot-scope="row">
               <el-button v-if="row.row.hex == ''" size="mini"  @click="toRecording(row)">去补录{{row.row.hex}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" min-width="70" align="center" show-overflow-tooltip>
      </el-table-column>




      <!-- <el-table-column prop="sumReBalance" label="总充币" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="exCoinBalance" label="总提币" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="sumProfit" label="总收益" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="sumFee" label="总手续费" min-width="70" align="center">
      </el-table-column> -->


      <el-table-column label="操作" align="center" fixed="right" min-width="120" class-name="small-padding fixed-width">
        <template slot-scope="row">
          <!-- -->
          <el-button v-if="row.row.state == 'CREATE'" size="mini" type="primary" @click="modify(row)">
            待审核
          </el-button>
          <el-button size="mini" type="primary" @click="setRemark(row)">
            设置备注
          </el-button>
          <!-- <el-button v-else-if="row.row.state == 'PASS'" size="mini" type="success" @click="modify(row)">
            审核通过
          </el-button>
          <el-button v-else size="mini" type="info" >
            审核驳回
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>


    <!-- 修改信息 -->
    <el-dialog :visible.sync="modifyShow" :close-on-click-modal="true"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :data="modifyData" label-position="right" label-width="90px" style="width: 480px; ">
        <el-form-item label="提币数量">
          <el-input v-model="modifyData.balance" :disabled="true" />
        </el-form-item>
        <el-form-item label="钱包地址">
          <el-input v-model="modifyData.wallet" :disabled="true" />
        </el-form-item>
        <el-form-item label="币种">
          <el-input v-model="modifyData.currency" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="modifyData.state" placeholder="请选择">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
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

    <el-dialog :visible.sync="setRemarkShow" :close-on-click-modal="true" >
      <el-form :data="setRemarkData" label-position="right" label-width="90px" style="width: 480px; ">
        <el-form-item label="备注信息">
          <el-input v-model="setRemarkData.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRemarkShow = false"> 取消 </el-button>
        <el-button type="primary" @click="setRemarkConfirm"> 确认 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="recordShow" :close-on-click-modal="true" title="补录">
      <el-form :data="recordData" label-position="right" label-width="90px" style="width: 480px; ">
        <el-form-item label="hash">
          <el-input v-model="recordData.hash" />
        </el-form-item>
         <el-form-item label="密码">
          <el-input v-model="recordData.pass" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recordShow = false"> 取消 </el-button>
        <el-button type="primary" @click="setrecordConfirm"> 确认 </el-button>
      </div>
    </el-dialog>



    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
        </div>
  </div>
</template>

<script>
import store from '../../../store';
import {
  getDatetime
} from "@/api/user";
import Pagination from "@/components/Pagination";
import {
  compile
} from "path-to-regexp";
import Music from "@/components/music"
// import {TLAddres,TLabi,TlController_contracts} from '@/utils/web3'
import { USDTabi, USDTController } from "@/api/web3.js";
import Web3 from "web3";
export default {
  name: "",
  components: {
    Pagination,
    Music,
  },
  data() {
    return {
      chainType:'',//链类型-拉起对应的钱包
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        mail: "",
        uuid: "", //
        exOrRe: "EX",
        type: "GROUP", // GROUP WEL
        startTime: "",
        endTime: "",
      },
      list: null,
      total: 0,
      listLoading: true,
      modifyShow: false,
      modifyData: {
        id: "",
        pass: "",
        state: "",
        hash:""
      },
      modifyData1: {
        sumFee: "",
        // pass: "",
        // state: "",
      },

      options: [{
        value: "PASS",
        label: "通过",
      },
      {
        value: "REJECT",
        label: "驳回",
      },
      ],
      sumData: "", //
      userType: [{
        label: "散户",
        value: "GROUP",
      },
      {
        label: "合伙人",
        value: "WEL",
      },
      ],
      recExType: [{
        label: "充币",
        value: "RE",
      },
      {
        label: "提币",
        value: "EX",
      },
      ],
      memberInfo: "", //
      timer: null,
      payload: true,
      setRemarkShow: false,
      setRemarkData: {
        remark: ''
      },
      recordShow: false,
      recordData: {
        hash: '',
        pass:'',
        id:'',
      },
      loading:false,
      withdrawWallet:'',//提币地址
      tronWeb:null,
      hash:'',
      mataUser:'',//小狐狸登录识别
    };
  },
  created() {
    // console.log(this.$store.state.name, 11111111111111)
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    this.getSum();
    this.setController()
    this.memberInfo = window.localStorage.getItem("memberInfo");
    // console.log(this.memberInfo, "member");
  },
  mounted() {
    this.timer = setInterval(() => {
      this.music();
    }, 5000);
  },
  // beforeDestroy() {
  //   clearInterval(this.timer);
  // },
  methods: {
      //创建合约 、、支付UDST
      setController() {
      let thisweb3 = new Web3(
        Web3.givenProvider ||
          new Web3.providers.HttpProvider(
            "https://mainnet.infura.io/v3/a33fcf3b6b0546d28dffb41f2da7498a"
          )
      );
      this.USDeth_contract = new thisweb3.eth.Contract(
        USDTabi, //币合约的ABI
        USDTController
      ); //合约币的地址
      //let value ='1000000000000000000000';
      },
    music() {
      this.listLoading = true;
      // 声音提示
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getReadWithdrawalData", this.listQuery)
        .then((res) => {
          console.log(res.result);

          if (res.result.texsum > 0) {
            // setTimeout(() => {
            var MessageAudio = document.getElementById("MessageAudio");
            //     // console.log(MessageAudio)
            MessageAudio.play(); // 播放
            // }, 10);
          } else {
            MessageAudio.pause();
            MessageAudio.currentTime = 0; // 停止
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    close() {
      this.$store.commit('SET_NUM', this.payload)
      // this.$store.commit('SET_NUM', this.payload);
      console.log(this.$store.state.name, 112111)

    },

    getList() {
      this.listLoading = true;
      // 获取用户管理
      this.listQuery.member = window.localStorage.getItem("userId");
      this.$http
        .get("/admin/sysAdmin/getReExList", this.listQuery)
        .then((res) => {
          // this.list = res.result.listex.records || [];
          this.list = res.result.records || [];

          // console.log(this.list[0].createTime)
          if (this.list.length > 0) {
            this.list.forEach((element) => {
              element.createTime = this.getDatetime(element.createTime);
            });
          }
          // this.total = res.result.listex.total;
          this.total = res.result.total;
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
    setRemark(row) {
      this.setRemarkData.id = row.row.id;
      this.setRemarkData.remark = row.row.remark;
      this.setRemarkShow = true;
    },
    setRemarkConfirm() {
      // if(!this.setRemarkData.remark){
      //   this.$message({
      //         message: "请填写备注",
      //         type: "error",
      //       });
      //   return;
      // }
      this.$http
        .post("/admin/sysAdmin/setExtractCoinRm", this.setRemarkData)
        .then((res) => {
          if (res.status == 'SUCCEED') {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.setRemarkShow = false;
            this.getList();
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });

    },
    // 搜索
    handleFilter() {
      console.log(this.listQuery, "");
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
      this.listQuery.type = "GROUP";
      this.listQuery.mail = "";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.getList();
    },
    // 添加
    addmarketClick() { },

    
    //补录
     setrecordConfirm(){
      if(this.recordData.hax !='' && this.recordData.pass !=''){
           this.$http.post("/admin/sysAdmin/setExtractCoinHash", this.recordData)
            .then((res) => {
              if (res.status == 'SUCCEED') {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.recordShow=false
                this.getList();
              } else {
                this.$message({
                  message: res.errorMessage,
                  type: "error",
                });

              }
            })
            .catch((err) => {
              console.log(err);
            });
      }else{
        this.$message.error('请填写相关信息')
      }
      
    },
    toRecording(row){
      console.log('补录---',row.row);
       this.recordData.id=row.row.id
       this.recordData.hash=row.row.hex
        this.recordData.pass=''
        this.recordShow=true
    },
    
    //审核
    modify(row) {
      console.log('审核---',row.row);
      this.chainType=row.row.chain
      console.log('当前链----',this.chainType);
      this.withdrawWallet=row.row.wallet//转账需要此地址参数
      this.modifyData.id = row.row.id;
      this.modifyData.balance = row.row.balance - row.row.handlingFee;
      this.modifyData.wallet = row.row.wallet;
      this.modifyData.currency = row.row.currency;

      this.modifyShow = true;
    },

    setExtractCoin() {
      this.$http
        .post("/admin/sysAdmin/setExtractCoin", this.modifyData)
        .then((res) => {
          if (res.status == 'SUCCEED') {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.modifyShow = false;
            this.getList();
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });

          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
   

    modifyConfirm() {
      if (this.modifyData.pass == "") {
        this.$message({
          message: "请输入审核密码",
          type: "error",
        });
        return;
      }
      // console.log('通过提交-最终传的参数---',this.modifyData);
      if(this.modifyData.state=='PASS'){
        console.log('chainType---',this.chainType);
        if(this.chainType =='TRC20'){
             this.triggerSmartContract()
        }
        if(this.chainType =='BEP20'){
              this.triggerSmartMake()
        }
        if(this.chainType =='ERC20'){
              this.triggerSmartMakeERC()
        }
      }
      if(this.modifyData.state=='REJECT'){
        this.setExtractCoin();
      }
    },


 
async  triggerSmartContract() {
    console.log('波场TRC20');
    this.loading=true
     const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";//正式合约地址
    let address = this.withdrawWallet
    let money = this.modifyData.balance
    console.log('金额*&*&*&*&*&*&*&*&',money);
    try {
        let contract = await window.tronWeb.contract().at(trc20ContractAddress);
        console.log('contract_+_+_+_+_+_+_+_+_+_',contract);

        let result = await contract.transfer(address,money ).send({
                feeLimit: 40000000
            }).then(output => {
                this.loading=false
                console.log('- 成功++++++++++++++Output:', output, '\n');
                this.modifyData.hash=output
                //成功后调取后端接口
                this.setExtractCoin()
              }).catch(err=>{
                this.$message.error(err.message)
                this.loading=false
                console.log('失败++++++++++++++++',err);
            })
        console.log('%%%%%%%%%%%%%%%%%%result: ', result);
    } catch(error) {
        this.loading=false
        console.error("#####################contract error",error)
    }
},

async triggerSmartMake() {
  console.log('小狐狸BRC20');

	var Web3 = require('web3');
				const web3 = new Web3(window.ethereum);
				 let that = this;
        /*  */
				if (that.mataUser == '') {
					if (typeof window.ethereum === 'undefined') {} else {
						ethereum.enable().catch(function(reason) {
						}).then(async function(accounts) {
							const add = ethereum.enable().then(res => {})
							const account = accounts[0];
              that.mataUser = account;
              console.log('USER已存储-------',that.mataUser);
              sessionStorage.setItem("mataUser", account);
              

						})
					}
				} else {
          let address = that.withdrawWallet
          let money = that.modifyData.balance
          try {
            that.buyRes =''
              let adr = that.number2string(money * 1000000000000000000);
              buyRes = await this.USDeth_contract.methods
                .transfer(address, adr)
                .send({
                  from: this.mataUser,
                });
                this.modifyData.hash=buyRes
                console.log('成功-----',buyRes);
                    //成功后调取后端接口
                this.setExtractCoin()
            
          } catch (error) {
            this.listLoading = false;
            console.log(error);
          }
				}

     
},
async triggerSmartMakeERC() {
  console.log('小狐狸ERC20');
  // this.withdrawWallet=row.row.wallet//转账需要此地址参数
  //     this.modifyData.id = row.row.id;
  //     this.modifyData.balance = row.row.balance - row.row.handlingFee;
  //     this.modifyData.wallet = row.row.wallet;
  //     this.modifyData.currency = row.row.currency;

	var Web3 = require('web3');
				const web3 = new Web3(window.ethereum);
				 let that = this;
        /*  */
				if (that.mataUser == '') {
					if (typeof window.ethereum === 'undefined') {} else {
						ethereum.enable().catch(function(reason) {
						}).then(async function(accounts) {
							const add = ethereum.enable().then(res => {})
							const account = accounts[0];
              that.mataUser = account;
              console.log('USER已存储-------',that.mataUser);
              sessionStorage.setItem("mataUser", account);
              

						})
					}
				} else {
          let address = that.withdrawWallet
          let money = that.modifyData.balance
          try {
            that.buyRes =''
              let adr = that.number2string(money * 1000000000000000000);
              buyRes = await this.USDeth_contract.methods
                .transfer(address, adr)
                .send({
                  from: this.mataUser,
                });
                this.modifyData.hash=buyRes
                console.log('成功-----',buyRes);
                    //成功后调取后端接口
                this.setExtractCoin()
            
          } catch (error) {
            this.listLoading = false;
            console.log(error);
          }
				}

     
},

  
 async sendtrx(){
     this.loading=true
         let enterAccount = window.localStorage.getItem("userId");
    //   console.log('this.withdrawWallet',this.withdrawWallet);
       console.log('当前账户地址---',enterAccount); 

        this.tronWeb =  window.tronWeb;
        const privateKey = "..."; 
        // var fromAddress = this.withdrawWallet; //address _from
        // var toAddress = enterAccount; //address _to
        // var amount =this.modifyData.balance
        var fromAddress = "TM2TmqauSEiRf16CyFgzHV2BVxBejY9iyR"; //address _from
        var toAddress = enterAccount; //address _to
       var amount = 10000000; //amount，单位为sun
        //创建一个未签名的TRX转账交易
        const tradeobj = await tronWeb.transactionBuilder.sendTrx(
              toAddress,
              amount,
              fromAddress
        );
        console.log('tradeobj--###########TRX转账交易',tradeobj);
        //签名
        // const signedtxn = await tronWeb.trx.sign(
        //       tradeobj,
        //       privateKey
        // );
         try {
            let signedtxn = await await tronWeb.trx.sign(tradeobj, privateKey );
             console.log('签名成功--',signedtxn);
                this.loading=false
              try {
                  let output =  await tronWeb.trx.sendRawTransaction( signedtxn )
                  console.log('- 广播成功-------:', output, '\n');
                  this.loading=false
              } catch (error) {
                  this.loading=false
                  console.log('广播失败-----',error);
              }
           
          } catch (error) {
            console.log('签名失败-----',error);
            this.loading=false
                
          }
        console.log('signedtxn--##########');
        //广播
        // const receipt = await tronWeb.trx.sendRawTransaction(
        //       signedtxn
        // ).then(output => {
        //   console.log('- Output-------:', output, '\n');
        //   return output;
        // });
  },

  number2string(num) {
      num = String(num);
      var eSplit = num.split("e");
      var e = +(eSplit[1] || 0);
      var pad = "0".repeat(500);
      var numSplit = eSplit[0].split(".");
      var str;
      var numSplit1 = numSplit[1] || "";
      if (e < 0) {
        str = "0." + (pad + numSplit[0]).slice(e) + numSplit1;
      } else {
        str =
          numSplit[0] +
          (numSplit1 + pad).slice(0, e) +
          "." +
          numSplit1.slice(e);
      }
      return (
        str
          .replace(/\.?0*$/, "")
          .replace(/^0*/, "")
          .replace(/^\./, "0.") || "0"
      );
    },
  //调用合约的方法
  // async transactionContract(){
  //     //调用方式2
  //     const parameter = [{type:'address',value:'TN9RRaXkCFtTXRso2GdTZxSxxwufzxLQPP'}];
  //     var tx  = await this.tronWeb.transactionBuilder.triggerSmartContract(
  //       "TSbJGFA8UyYGTuXBRbYB2GJeh2CY1X5F4d",
  //       "registrationExt(address)",
  //       {},
  //       parameter,
  //       this.walletAddress
  //     );
  //     var signedTx = await this.tronWeb.trx.sign(tx.transaction);
  //     var broastTx = await this.tronWeb.trx.sendRawTransaction(signedTx);
  //     console.log(broastTx)
  // },

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

.filter-container {
  display: flex;
  // justify-content: center;
  align-items: center;
}
</style>
