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
      this.$router.replace('/register')
    }
  },
}
</script>


<style>
  @import url("//at.alicdn.com/t/font_2582268_ik6a5pzsy2g.css");
  @import url("./assets/css/normalize.css");

  body{
    background-color: #cccccc;
  }
</style>
