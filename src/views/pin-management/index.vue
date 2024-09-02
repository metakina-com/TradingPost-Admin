<template>
  <div class="user">
    <div class="filter-container" style="padding-bottom: 30px">
      <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addPinConfig">新增插针</el-button>
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="pairName" label="交易对" min-width="100" align="center">
      </el-table-column>
      <el-table-column prop="willPrice" label="目标价格" min-width="100" align="center">
      </el-table-column>
      <el-table-column prop="willTime" label="目标时间" min-width="100" align="center">
      </el-table-column>
      <el-table-column prop="address" label="操作" min-width="70" align="center">
        <template slot-scope="row">
          <el-button style="margin-bottom: 5px" type="primary" size="mini"  @click="modify(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="modifyShow" :fullscreen="false">
      <el-form ref="form" :model="modifyData" label-width="150px">
        <el-form-item label="交易对" prop="title">
          <el-input v-model="modifyData.pairName" :disabled="modifyData.id" min="0" />
        </el-form-item>
         <el-form-item label="目标价格" prop="title">
          <el-input v-model="modifyData.willPrice" min="0" />
        </el-form-item>
        <el-form-item label="目标时间" prop="title">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="modifyData.willTime" type="datetime"
            placeholder="目标时间"> </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyShow = false"> 关闭 </el-button>
        <el-button type="primary" @click="addConfirm"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import quillEditorVue from "@/components/quillEditor/quillEditor.vue";
export default {
  components: {
    quillEditorVue,
  },
  data() {
    return {
      xiugaigongg: false,
      addShow: false,
      list: [],
      listQuery:{
        pageNum:1,
        pageSize:30
      },
      modifyShow: false,
      modifyData: {

      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询公告
    getList() {
      let data = {
        pageNum:this.listQuery.pageNum,
        pageSize:this.listQuery.pageSize,
      }
      this.$http
        .get("/admin/sysAdmin/getKlineConfig", data)
        .then((res) => {
          this.list = res.result.records;
          this.list.forEach(item=>{
            item.willTime = this.formatDateTime(item.willTime)
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
    open(row) {
      let data = {
        state: 'true',
        id: row.row.id
      }
      this.$confirm(`确认开启?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.post('/admin/sysAdmin/upConfig', data).then(res => {
          if (res.status == 'SUCCEED') {
            this.$message({
              message: "操作成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.getList()
        })
      })
    },
    close(row) {
      let data = {
        state: 'false',
        id: row.row.id
      }
      this.$confirm(`确认关闭?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.post('/admin/sysAdmin/upConfig', data).then(res => {
          if (res.status == 'SUCCEED') {
            this.$message({
              message: "操作成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.errorMessage,
              type: "error",
            });
          }
          this.getList()
        })
      })
    },



    detail(row) {
      this.modifyData = row.row;
      this.modifyShow = true;
    },
    modify(row) {
      this.modifyData = row.row;
      this.modifyShow = true;
    },
    update() {
      this.$http
        .post1("/admin/sysAdmin/setKlineConfig", this.modifyData)
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
    },
    addPinConfig() {
      this.modifyData = {};
      this.modifyShow = true;
    },
    addConfirm() {
      this.update();
    },
    // 删除
    del(row) {
      let id = row.row.id;
      this.$http
        .post("/sysAdmin/deleteNotice", {
          id: id,
        })
        .then((res) => {
          this.$message({
            message: "公告删除成功",
            type: "success",
          });
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped="scoped">
.user {
  width: 95%;
  margin: 50px auto;
}
</style>
