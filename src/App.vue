<template>
  <div id="app">
      <router-view/>
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
    if(localStorage.getItem('account')){
      this.$router.replace('/')
    }else{
      this.$router.replace('/login')
    }
  },
}
</script>


<style>
  @import url("//at.alicdn.com/t/font_2582268_y2blrvxlm5p.css");
  @import url("./assets/css/normalize.css");

</style>
