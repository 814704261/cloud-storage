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
      console.log(url)
      this.$router.replace(url)
    }
  },
  components: {
    buttomTab
  }
}
</script>


<style>
  @import url("//at.alicdn.com/t/font_2582268_hm4guwzuk9.css");
</style>
