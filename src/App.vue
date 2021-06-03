<template>
  <div id="app">

    <keep-alive>
      <router-view/>
    </keep-alive>

  </div>
</template>


<script>


export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  created() {
    if(localStorage.getItem('login')){
      this.$router.replace('/')
    }else{
      this.$router.replace('/login')
    }
  },
}
</script>


<style>
  @import url("//at.alicdn.com/t/font_2582268_v30nyo8d5ti.css");
  @import url("./assets/css/normalize.css");

  body{
    background-color: #cccccc;
  }

  #app{
    width: 100%;
    height: 100%;
  }
</style>
