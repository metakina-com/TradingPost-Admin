<template>
  <div class="user">用户</div>
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
        pageSize: 10,
      },
      list: null,
      total: 0,
      listLoading: true,
    };
  },
  created() {
    setTimeout(() => {
      this.listLoading = false;
    }, 3000);
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$http
        .post("/admin/searchUserList", this.listQuery)
        .then((res) => {
          // console.log(res.data.data, "res");
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
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 重置
    reset() {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 10;
      this.listQuery.userPhone = "";
      this.listQuery.mail = "";
      this.getList();
    },

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
