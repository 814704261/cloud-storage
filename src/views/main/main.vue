<template>
  <div>
    <router-view/>
    <buttom-tab v-on:goto="skip"></buttom-tab>
  </div>
</template>

<script>
import buttomTab from "components/buttomTab.vue";
export default {
  created() {},
  components: {
    buttomTab,
  },
  methods: {
    skip(url) {
      this.$router.replace(url).catch(err => {
        console.log(err)
      })
    },
  },
};
</script>

<style>
</style>