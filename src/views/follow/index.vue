<template>
  <div class="user">
    <div style="padding-bottom: 30px">佣金管理</div>
    <div class="filter-container" style="padding-bottom: 30px">
      <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >订单号</span
      >
      <el-input
        placeholder="订单号"
        v-model.trim="listQuery.orderId"
        style="width: 140px"
        class="filter-item"
      />
      <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >申诉类型</span
      >
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option
          v-for="(item, index) in appealType"
          :key="index"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
      <span class="demonstration" style="margin: 0px 10px 0px 10px"
        >申诉状态</span
      >
      <el-select v-model="listQuery.status" placeholder="请选择">
        <el-option
          v-for="(item, index) in status"
          :key="index"
          :label="item.label"
          :value="item.index"
        />
      </el-select>
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
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-add" @click="addmarketClick">添加</el-button> -->
    </div>
    <el-table :data="list" border tooltip-effect="dark" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单号"
        min-width="70"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="type"
        label="申诉类型"
        min-width="70"
        align="center"
      >
        <template slot-scope="scop">
          <p v-if="scop.row.type == 1">没有收到币</p>
          <p v-if="scop.row.type == 2">没有收到款</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="申诉原因"
        min-width="70"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="申诉状态"
        min-width="70"
        align="center"
      >
        <template slot-scope="scop">
          <p v-if="scop.row.status == 0">待审核</p>
          <p v-if="scop.row.status == 1">成功</p>
          <p v-if="scop.row.status == 2">失败</p>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        min-width="70"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="row">
          <el-button
            type="primary"
            @click="appealClick(row)"
            :disabled="row.row.status == 0 ? false : true"
          >
            {{ row.row.status == 0 ? "申诉处理" : "已完成" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <!-- 申诉审核 -->
    <el-dialog :visible.sync="appeal" :close-on-click-modal="false">
      <el-form
        :data="appealDate"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="申诉结果">
          <el-select v-model="appealDate.status" placeholder="请选择">
            <el-option
              v-for="(item, index) in status"
              :key="index"
              :label="item.label"
              :value="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申诉描述">
          <el-input v-model="appealDate.appealAdminRemark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appeal = false"> 取消 </el-button>
        <el-button type="primary" @click="appealConfirm"> 确认 </el-button>
      </div>
    </el-dialog>
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
        page: 1,
        size: 10,
        orderId: "",
        type: "",
        status: "",
      },
      list: null,
      total: 0,
      listLoading: true,
      status: [
        { label: "成功", index: 1 },
        { label: "失败", index: 2 },
      ],
      appealType: null,

      appeal: false,
      appealDate: {
        appealId: "",
        status: "",
        appealAdminRemark: "",
      },
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    this.getList();
    this.getAppeal();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 用户交易权限设置
      this.$http
        .post("/admin/searchAppealList", this.listQuery)
        .then((res) => {
          console.log(res);
          this.list = res.data.data.content;
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].createTime = getDatetime(this.list[i].createTime);
          }
          this.total = res.data.data.totalElements;
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
      this.listQuery.page = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.listQuery.page = 1;
      this.listQuery.size = 10;
      this.listQuery.orderId = "";
      this.listQuery.type = "";
      this.listQuery.status = "";
      this.getList();
    },
    // 获取所有申诉类型
    getAppeal() {
      this.$http
        .post("/admin/searchAppealTypeList", {})
        .then((res) => {
          console.log(res);
          this.appealType = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 申诉处理
    appealClick(row) {
      console.log(row);
      this.appeal = true;
      this.appealDate.appealId = row.row.id;
    },
    appealConfirm() {
      this.appeal = false;
      this.$http
        .post("/admin/processAppeal", this.appealDate)
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.getList();
          this.appealDate.appealId = "";
          this.appealDate.appealAdminRemark = "";
        })
        .catch((err) => {
          console.log(err);
          this.appealDate.appealId = "";
          this.appealDate.appealAdminRemark = "";
        });
    },
    // 添加
    addmarketClick() {},

    // 删除
    del(row) {},
  },
};
</script>

<style lang="scss" scoped>
.user {
  width: 95%;
  margin: 50px auto;
}
</style>
