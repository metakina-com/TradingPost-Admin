<template>
  <div>
    <audio preload="auto|metadata|none" controls="controls" id='MessageAudio'>
      <source src="../../assets/14122.wav" />
    </audio>
  </div>
</template>

<script>
  export default {
    name: 'Music',
    mounted() {
      // this.timer = setInterval(() => {
      //   this.music();
      // }, 5000);
    },
    methods: {
    //   music() {
    //     this.listLoading = true;
    //     // 声音提示
    //     this.listQuery.member = window.localStorage.getItem("userId");
    //     this.$http
    //       .get("/admin/sysAdmin/getReadWithdrawalData", this.listQuery)
    //       .then((res) => {
    //         console.log(res.result);

    //         // if (res.result.texsum > 0) {
    //           setTimeout(() => {
    //             var MessageAudio = document.getElementById("MessageAudio");
    //             //     // console.log(MessageAudio)
    //             MessageAudio.play(); // 播放
    //           }, 100);
    //         // } else {
    //         //   MessageAudio.pause();
    //         //   MessageAudio.currentTime = 0; // 停止
    //         // }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   },
    }
  }

</script>

<style scoped>

</style>
