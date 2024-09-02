<template>
	<div class="user">

		<el-button style="margin-right: 10px; margin-top: 10px; " type="primary" icon="el-icon-edit" @click="tianjia">
			添加公告</el-button>

		<el-dialog :visible.sync="dialogamend" :fullscreen="false">
			<el-form ref="form" :model="modifyData" label-width="80px">

				<el-form-item label="公告标题" prop="title">
					<el-input v-model="modifyData.title" min="0" />
				</el-form-item>
				<el-form-item label="链接地址" prop="titleEn">
					<el-input v-model="modifyData.linkUrl" min="0" />
				</el-form-item>
				<el-form-item label="公告内容" prop="titleEn">
					<!-- <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 4}" placeholder="请输入内容"
						v-model="modifyData.content">
					</el-input> -->
					<Quilleditor v-model="modifyData.content"></Quilleditor>
				</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogamend = false">
					关闭
				</el-button>
				<el-button type="primary" @click="amendList()">
					确定
				</el-button>
			</div>

		</el-dialog>
		<!-- 修改公告 -->
		<el-dialog :visible.sync="xiugaigongg" :fullscreen="false">
			<el-form ref="form" :model="modifyData" label-width="80px">

				<el-form-item label="公告标题" prop="title">
					<el-input v-model="modifyData.title" min="0" />
				</el-form-item>
				<el-form-item label="链接地址" prop="linkUrl">
					<el-input v-model="modifyData.linkUrl" min="0" />
				</el-form-item>
			<el-form-item label="公告内容" prop="titleEn">
				<!-- <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 4}" placeholder="请输入内容"
					v-model="modifyData.content">
				</el-input> -->
				<Quilleditor v-model="modifyData.content"></Quilleditor>
			</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="xiugaigongg = false">
					关闭
				</el-button>
				<el-button type="primary" @click="alerts()">
					确定
				</el-button>
			</div>

		</el-dialog>

		<el-table :data="list" border tooltip-effect="dark" style="width: 100%">
			<el-table-column prop="title" label="标题" min-width="100" align="center">
			</el-table-column>
			<el-table-column prop="content" label="公告" min-width="100" align="center">
				<template slot-scope='row'>
					<p v-html="row.row.content"></p>
				</template>
			</el-table-column>
			<el-table-column prop="linkUrl" label="链接地址" min-width="100" align="center">
			</el-table-column>
			<el-table-column prop="address" label="操作" min-width="70" align="center">
				<template slot-scope="row">
					<!-- <el-button type="primary" size="mini" @click="detail(row)">
            修改公告
          </el-button> -->
					<el-button type="danger" size="mini" @click="del(row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import Quilleditor from '@/components/quillEditor/quillEditor.vue'
	export default {
		components: {
			Quilleditor,
		},


		data() {
			return {
				xiugaigongg: false,
				dialogamend: false,
				list: null,

				modifyData: {
					title: '', //标题
					linkUrl: "", //链接
					content: '',

					noticeType: "OFFICIAL",
					global: "CHINESE_SIM"
				},

			}
		},
		created() {
			this.getlist()
		},
		methods: {
			detail(row) {
				this.modifyData = row.row
				let ID = row.row.id
				this.modifyData.id = ID
				this.xiugaigongg = true
			},
			alerts() {
				if (this.modifyData.content == "") {
					this.$message.error('请输入公告');
					return;
				}
				if (this.modifyData.title == "") {
					this.$message.error('请输入标题');
					return;
				}
				if (this.modifyData.linkUrl == "") {
					this.$message.error('请输入链接');
					return;
				}
				console.log(this.modifyData)
				this.modifyData.token = window.localStorage.getItem('token')
				this.modifyData.userId = window.localStorage.getItem('userId')
				this.$http
					.post1("/admin/sysAdmin/addNotice", this.modifyData)
					.then((res) => {
						this.$message({
							message: "操作成功",
							type: "success",
						});
						this.xiugaigongg = false;
						this.getlist()

					})
					.catch((err) => {
						console.log(err);
					});
			},
			tianjia() {
				this.modifyData.content = ''
				this.modifyData.title = ''
				this.modifyData.titleEn = ''
				this.modifyData.id = ''
				this.dialogamend = true;
			},
			amendList() {
				if (this.modifyData.content == "") {
					this.$message.error('请输入公告');
					return;
				}
				if (this.modifyData.title == "") {
					this.$message.error('请输入标题');
					return;
				}
				if (this.modifyData.linkUrl == "") {
					this.$message.error('请输入链接');
					return;
				}
				this.modifyData.token = window.localStorage.getItem('token')
				this.modifyData.userId = window.localStorage.getItem('userId')
				this.$http
					.post1("/admin/sysAdmin/addNotice", this.modifyData)
					.then((res) => {
						this.$message({
							message: "操作成功",
							type: "success",
						});
						this.dialogamend = false;
						this.getlist()

					})
					.catch((err) => {
						console.log(err);
					});
			},
			// 查询公告
			getlist() {
				console.log(11)
				// /sysAdmin/postNotice

				this.$http
					.get("/admin/sysAdmin/getNotices")
					.then((res) => {
						this.list = res.result.records
						console.log(res)

					})
					.catch((err) => {
						console.log(err);
					});

			},
			// 删除
			del(row) {
				let id = row.row.id
				this.$http
					.post("/admin/sysAdmin/delNotice", {
						id: id
					})
					.then((res) => {
						this.$message({
							message: "公告删除成功",
							type: "success",
						});
						this.getlist()
					})
					.catch((err) => {
						console.log(err);

					});

			},
		}
	}
</script>

<style scoped="scoped">
	.user {
		width: 95%;
		margin: 50px auto;
	}
</style>
