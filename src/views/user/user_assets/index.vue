<template>
	<div class="user">
		<div class="filter-container" style="padding-bottom: 30px" :model="formQian">
			<el-input placeholder="邮箱" v-model.trim="listQuery.mail" :value="Value" style="width: 240px"
				class="filter-item" />
			<!-- 总资产 -->
			<div id="">
				<el-input placeholder="资产" :value="VALUE" style="width: 240px" class="filter-item" />
			</div>

			<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
			<el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>

			<el-button class="filter-item" type="primary" icon="" @click="addRecharge = true">补充资金</el-button>
			<!-- <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >用户类型</span
      >
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option
          v-for="(item, index) in appealType"
          :key="index"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select> -->

			<!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
		</div>
		<el-table :data="formQian" border tooltip-effect="dark" style="width: 100%">
			<el-table-column type="index" label="序号" width="50" align="center">
			</el-table-column>
			<el-table-column prop="mail" label="邮箱" min-width="70" align="center"/>
			<el-table-column prop="currency" label="币种" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="balance" label="币币可用" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="blockedBalance" label="币币冻结" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="fbBalance" label="法币可用" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="fbBlockedBalance" label="法币冻结" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="tokenBalance" label="U本位可用" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="tokenBlockedBalance" label="U本位冻结" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="capitalBalance" label="资金可用" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="capitalBlockedBalance" label="资金冻结" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="currencyBalance" label="币本位可用" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="currencyBlockedBalance" label="币本位冻结" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="followBalance" label="跟单可用" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="followBlockedBalance" label="跟单冻结" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="tokenProfitBalance" label="合约收益" min-width="70" align="center">
			</el-table-column>
			<el-table-column prop="followProfitBalance" label="跟单收益" min-width="70" align="center">
			</el-table-column>

			<el-table-column label="操作" align="center" min-width="100" class-name="small-padding fixed-width">
				<template slot-scope="row">
					<el-button type="primary" @click="revise(row)">
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 补充资金 -->
		<el-dialog :visible.sync="addRecharge" :fullscreen="false">
			<el-form ref="form" :model="modifyData" label-width="80px">
				<el-form-item label="邮箱" prop="mail">
					<el-input v-model="modifyData.mail" min="0" />
				</el-form-item>
				<el-form-item label="币种" prop="balance">
					<el-input v-model="modifyData.currency" min="0" />
				</el-form-item>
				<el-form-item label="金额" prop="balance">
					<el-input v-model="modifyData.balance" min="0" />
				</el-form-item>
				<el-form-item label="密码" prop="pass">
					<el-input placeholder="请输入密码" v-model="modifyData.pass" show-password></el-input>
				</el-form-item>
				<el-form-item label="显示记录">
					<el-select v-model="modifyData.isBc" placeholder="是否显示记录">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addRecharge = false">
					关闭
				</el-button>
				<el-button type="primary" @click="alerts()">
					确定
				</el-button>
			</div>
		</el-dialog>
		<!-- 编辑资产 -->
		<el-dialog :visible.sync="editAssetsShow" :fullscreen="false">
			<el-form ref="form" :model="editAssetsData" label-width="120px">
				<el-form-item label="邮箱" prop="mail">
					<el-input v-model="editAssetsData.mail" :disabled="true" min="0" />
				</el-form-item>
				<el-form-item label="币种" prop="mail">
					<el-input v-model="editAssetsData.currency" :disabled="true" min="0" />
				</el-form-item>
				<el-form-item label="币币可用" prop="balance">
					<el-input v-model="editAssetsData.balance" min="0" />
				</el-form-item>
				<el-form-item label="币币冻结" prop="blockedBalance">
					<el-input v-model="editAssetsData.blockedBalance" min="0" />
				</el-form-item>
				
				<el-form-item label="法币可用" prop="fbBalance">
					<el-input v-model="editAssetsData.fbBalance" min="0" />
				</el-form-item>
				<el-form-item label="法币冻结" prop="fbBalance">
					<el-input v-model="editAssetsData.fbBlockedBalance" min="0" />
				</el-form-item>

				
				<el-form-item label="U本位可用" prop="tokenBalance">
					<el-input v-model="editAssetsData.tokenBalance" min="0" />
				</el-form-item>
				<el-form-item label="U本位冻结" prop="tokenBlockedBalance">
					<el-input v-model="editAssetsData.tokenBlockedBalance" min="0" />
				</el-form-item>
				
				<el-form-item label="币本位可用" prop="currencyBalance">
					<el-input v-model="editAssetsData.currencyBalance" min="0" />
				</el-form-item>
				<el-form-item label="币本位冻结" prop="currencyBlockedBalance">
					<el-input v-model="editAssetsData.currencyBlockedBalance" min="0" />
				</el-form-item>

				
				<el-form-item label="跟单可用" prop="followBalance">
					<el-input v-model="editAssetsData.followBalance" min="0" />
				</el-form-item>
				<el-form-item label="跟单冻结" prop="followBlockedBalance">
					<el-input v-model="editAssetsData.followBlockedBalance" min="0" />
				</el-form-item>
				
				<el-form-item label="资金可用" prop="capitalBalance">
					<el-input v-model="editAssetsData.capitalBalance" min="0" />
				</el-form-item>
				<el-form-item label="资金冻结" prop="capitalBlockedBalance">
					<el-input v-model="editAssetsData.capitalBlockedBalance" min="0" />
				</el-form-item>
				<!-- <el-form-item label="法币可用" prop="fbBalance">
					<el-input v-model="editAssetsData.fbBalance" min="0" />
				</el-form-item> -->
				<el-form-item label="密码" prop="pass">
					<el-input placeholder="请输入操作密码" v-model="editAssetsData.pass" show-password></el-input>
				</el-form-item>
				<!-- <el-form-item label="显示记录">
					<el-select v-model="editAssetsData.isBc" placeholder="是否显示记录">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editAssetsShow = false">
					关闭
				</el-button>
				<el-button type="primary" @click="editConfirm()">
					确定
				</el-button>
			</div>
		</el-dialog>

		<pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
			@pagination="getList" />
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
			options: [{
				label: "是",
				value: "TRUE",
			},
			{
				label: "否",
				value: "FALSE",
			},
			],
			listQuery: {
				pageNum: 1,
				pageSize: 10,
				mail: "",
				startTime: "",
				endTime: "",
				currency: "USDT",
			},
			editAssetsData:{
				currency:'',
				balance:'',
				blockedBalance:'',
				fbBalance:'',
				fbBlockedBalance:'',
				tokenBalance:'',
				tokenBlockedBalance:'',
				currencyBalance:'',
				currencyBlockedBalance:'',
				followBalance:'',
				followBlockedBalance:'',
				capitalBalance:'',
				capitalBlockedBalance:'',
				pass:'',
			},
			editAssetsShow:false,

			modifyData: {
				
			},
			sumData: "", //
			startTime: "",
			endTime: "",
			list: null,
			total: 0,
			listLoading: true,
			status: [{
				label: "成功",
				index: 1,
			},
			{
				label: "失败",
				index: 2,
			},
			],
			addRecharge: false,

			commissionInfo: "", //
			userType: {}, //
			appeal: false,
			//用户总资产、个人用户资产
			Value: "",
			VALUE: "",
			formQian: null,
			formQianTOo: "",

			reviseShow:false,
		};
	},
	created() {
		setTimeout(() => {
			this.listLoading = false;
		}, 3000);
		this.getList();
		this.getAssetsSum();
		// 进入查询总资产
		// this.getTangible();
	},
	// mounted(){
	//   this.getTangible();
	// }
	methods: {
		getCommInfoList() {
			this.listLoading = true;
			// 获取佣金汇总
			// this.listQuery.member = ;
			// console.log(this.listQuery, "请求参数");
			this.$http
				.get("/admin/sysAdmin/getCommInfoSum", {
					member: window.localStorage.getItem("userId"),
				})
				.then((res) => {
					this.commissionInfo = res.result;
				})
				.catch((err) => {
					// console.log(err);
				});
		},
		// addRecharge() {
		// 	this.addRecharge = true
		// },
		alerts() {
			console.log(this.modifyData);
			// return
			this.$http
				.post("/admin/sysAdmin/addRecharge", this.modifyData)
				.then((res) => {
					if (res.status == 'SUCCEED') {
						this.$message({
							message: "操作成功",
							type: "success",
						});
						this.addRecharge = false
					} else {
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
		revise(row){
			this.editAssetsData = row.row;
			this.editAssetsShow = true;
		},
		editConfirm(){
			this.$http.post1(`/admin/sysAdmin/setBalance?pass=${this.editAssetsData.pass}`,this.editAssetsData).then(res=>{
				if(res.status == 'SUCCEED'){
					this.$message({
						message: "操作成功",
						type: "success",
					});
					this.getList();
					this.editAssetsShow = false
				}else{
					this.$message({
						message: res.errorMessage,
						type: "error",
					});
				}
			})
		},
		getAssetsSum() {
			this.$http
				.get("/admin/sysAdmin/getMainInfo", {
					member: window.localStorage.getItem("userId"),
				})
				.then((res) => {
					this.sumData = res.result;
					window.localStorage.setItem("memberInfo", JSON.stringify(res.result));
				})
				.catch((err) => {
					// console.log(err);
				});
		},
		// 搜索
		handleFilter() {
			setTimeout(() => {
				this.listLoading = false;
			}, 3000);
			this.listQuery.pageNum = 1;
			this.getList();

			//单个账户资产
			// this.getTangible();
		},
		// 重置
		reset() {
			this.listQuery.pageNum = 1;
			this.listQuery.pageSize = 10;
			this.listQuery.type = "GROUP";
			this.listQuery.startTime = "";
			this.listQuery.endTime = "";
			this.listQuery.mail = "";
			this.getList();
		},
		// //页面加载用户总资产
		// getTangible() {
		//   this.listQuery.member = window.localStorage.getItem("userId");
		//   this.$http
		//     .get("/admin/sysAdmin/getBalanceList", this.listQuery, )
		//     .then((res) => {
		//       console.log(res.result.records)
		//       this.formQian = res.result.records;
		//       this.formQianTOo = res.result.totalAssets
		//       console.log(this.formQian)
		//       if (this.Value == "" || this.Value == null || this.Value == undefined) {
		//         this.VALUE = this.formQianTOo
		//       } else {
		//         this.VALUE = this.formQian[0].tokenBalance
		//       }
		//       this.total = res.result.total;

		//       function compare(propertyName) {
		//         return function(object1, object2) {
		//           var value1 = object1[propertyName];
		//           var value2 = object2[propertyName];
		//           if (value2 > value1) {
		//             return 1;
		//           } else if (value2 < value1) {
		//             return -1;
		//           } else {
		//             return 0;
		//           }
		//         }
		//       };
		//       this.formQian.sort(compare("capitalBalance"))

		//     })
		//     .catch((err) => {
		//       // console.log(err);
		//     });
		// },

		// 获取用户资产列表
		getList() {
			this.listQuery.member = window.localStorage.getItem("userId");
			this.$http
				.get("/admin/sysAdmin/getBalanceList", this.listQuery)
				.then((res) => {
					// console.log(res.result.balances.records)
					// this.list = res.result.records;
					// console.log(this.list)
					this.formQian = res.result.balances.records;
					this.formQianTOo = res.result.totalAssets;
					// console.log(this.formQianTOo)
					if (
						this.Value == "" ||
						this.Value == null ||
						this.Value == undefined
					) {
						this.VALUE = this.formQianTOo;
					} else {
						this.VALUE = this.formQian[0].tokenBalance;
					}

					this.total = res.result.balances.total;

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
					this.list.sort(compare("capitalBalance"));
				})
				.catch((err) => {
					// console.log(err);
				});
		},

		// 添加
		addmarketClick() { },

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
