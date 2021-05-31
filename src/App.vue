<template>
  <div id="app">

    <keep-alive>
      <router-view/>
    </keep-alive>

    <buttom-tab class="buttomTab" v-on:goto="skip"></buttom-tab>
  </div>
</template>


<script>
import buttomTab from './components/buttomTab.vue'

export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  methods: {
    skip(url){
      this.$router.replace(url)
    }
  },
  components: {
    buttomTab
  }
}
</script>


<style>
  @import url("//at.alicdn.com/t/font_2582268_ik6a5pzsy2g.css");
  @import url("./assets/css/normalize.css");

  body{
    background-color: #cccccc;
  }
</style>
