<template>
  <div id="box">
    <iframe src="/static/index.html" id="myiframe" width="100%" height="800" scrolling="no" frameborder="0"></iframe>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
  body {
    margin: 0;
    padding: 0;
  }


  #box {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    line-height: 30px;
    text-align: center;
    overflow: hidden;
  }

  #box::-webkit-scrollbar {
    display: none;
  }
</style>
