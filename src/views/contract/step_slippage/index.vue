<template>
  <div class="user">
    <h3>阶梯滑点</h3>
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px">邮箱</span>
      <el-input
        placeholder="邮箱"
        v-model.trim="listQuery.mail"
        style="width: 200px"
        class="filter-item"
      />
      <!-- <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.startTime"
            type="datetime"
            placeholder="开始时间"
          >
          </el-date-picker>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="listQuery.endTime"
            type="datetime"
            placeholder="结束时间"
          >
          </el-date-picker> -->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >搜索</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="reset"
        >重置</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="addStepHD"
        >添加</el-button
      >
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="mail" label="邮箱" min-width="90" align="center" />
      <el-table-column prop="hd" label="滑点" min-width="90" align="center" />

      <el-table-column prop="type" label="类型" min-width="50" align="center">
        <template slot-scope="row">
          <span v-if="row.row.type == 'OPENSJ'"> 开仓市价 </span>
          <span v-if="row.row.type == 'OPENXJ'"> 开仓限价 </span>
          <span v-if="row.row.type == 'CLOSESJ'"> 平仓市价 </span>
          <span v-if="row.row.type == 'CLOSEXJ'"> 平仓限价 </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button type="danger" size="mini" @click="delate(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="addModal" width="550px">
      <el-form
        :model="addData"
        :ref="addData"
        label-position="left"
        size="small"
        label-width="130px"
        title=""
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          label="邮箱"
          prop="mail"
          :rules="[
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input v-model="addData.mail" />
        </el-form-item>
        <el-form-item
          label="滑点"
          prop="hd"
          :rules="[
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
          ]"
        >
          <el-input v-model="addData.hd" class="filter-item" />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
          :rules="{ required: true, message: '请选择类型', trigger: 'blur' }"
        >
          <el-select v-model="addData.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addModal = false"> 关闭 </el-button>
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
      contractParamter: "", // 合约参数配置
      userType: {}, //
      addModal: false, //
      addData: {
        mail: "",
        hd: "",
        type: "",
      }, // 添加数据

      modifyData: {},
      paramterModal: false, //
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    // this.getCommInfoList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      (this.listQuery.member = window.localStorage.getItem("userId")),
        // 获取佣金汇总
        this.$http
          .get("/admin/sysAdmin/getMemberHds", this.listQuery)
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
    // 添加滑点
    addStepHD() {
      setTimeout(() => {
        this.addData.hd = "";
        this.addData.mail = "";
        this.addData.type = "";
      }, 1000);
      this.addModal = true;
    },
    // 添加阶梯滑点
    setMemberHdJt(addData) {
      this.$refs[addData].validate((valid) => {
        if (valid) {
          console.log(this.addData);
          this.$http
            .post1("/admin/sysAdmin/setMemberHdJt", this.addData)
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.addModal = false;
              this.getList();
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
      this.$confirm("此操作将永久该条滑点设置, 是否继续?", "提示", {
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
    // 删除阶梯滑点
    delMemberHd(id) {
      let data = {
        id,
      };
      this.$http
        .post("/admin/sysAdmin/delMemberHd", data)
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
