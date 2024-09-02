<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import Vue from 'vue'
  import http from './utils/http'
  import store from './store'
  Vue.prototype.$http = http;
  export default {
    name: 'App',
    // created: function() {
    //   console.log(this.$store.state.name, 55)
    //   var Music = this.$store.state.name
    //   var that = window.localStorage.getItem("userId");
    //   // setInterval不会清除定时器队列，每重复执行1次都会导致定时器叠加 \
    //   window.setInterval(() => {
    //     // setTimeout是自带清除定时器
    //     // console.log(that)
    //     var data = {
    //       member: that,
    //       pageNum: 1,
    //       pageSize: 10,
    //       mail: "",
    //       uuid: "", //
    //       exOrRe: "EX",
    //       type: "GROUP", // GROUP WEL
    //       startTime: "",
    //       endTime: "",
    //     }
    //     setTimeout(function() {
    //       // console.log(Music,66)
    //       Vue.prototype.$http.get("/admin/sysAdmin/getReadWithdrawalData", data).then(function(res) {
    //           if (res.result.texsum == 0) {
    //             console.log(res.result.texsum, 22)
    //             setTimeout(() => {
    //             var MessageAudio = document.getElementById("MessageAudio");
    //             //     // console.log(MessageAudio)
    //             MessageAudio.play(); // 播放
    //             }, 10);
    //             console.log(Music, 77)
    //           } else {
    //             MessageAudio.pause();
    //             MessageAudio.currentTime = 0; // 停止
    //           }
    //         })
    //         .catch(function(err) {
    //           // console.log("=err====" + err);
    //         })
    //     }, 600)
    //   }, 5000)
    // },
    // methods: {

    // }
  }
</script>
