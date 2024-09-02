<template>
  <div class="user">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="理财设置" name="first">
      <setLsit></setLsit>
    </el-tab-pane>
    <el-tab-pane label="理财记录" name="second">
      <recordList></recordList>
    </el-tab-pane>

  </el-tabs>
  </div>
</template>

<script>
import { getDatetime } from "@/api/user";
import Pagination from "@/components/Pagination";
import recordList from './com/recordList'
import setLsit from './com/setLsit.vue'

export default {
  name: "",
  components: {
    Pagination,
    setLsit,
    recordList,
  },
  data() {
    return {
      activeName: 'first'
      
    };
  },
  created() {
 
  },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
        this.activeName=tab.name
      }
  },
};
</script>

<style lang="scss" scoped>
.user {
  width: 95%;
  margin: 20px auto;
}

</style>
