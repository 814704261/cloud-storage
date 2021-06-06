<template>
    <div>
        <keep-alive>
            <router-view/>
        </keep-alive>
        <buttom-tab v-on:goto="skip"></buttom-tab>
    </div>
</template>

<script>
import buttomTab from 'components/buttomTab.vue'
export default {
  created() {
    
  },
  components: {
    buttomTab
  },
  methods: {
    skip(url){
      this.$router.replace(url)
    }
  }
}
</script>

<style>

</style>