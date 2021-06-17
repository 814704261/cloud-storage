<template>
  <div class="home">
    <router-view></router-view>
  </div>
</template>

<script>
import http from "@/network/index";

export default {
  data() {
    return {};
  },
  created() {
    console.log("home created");

    http.get("/files", {
      params: {
        account: localStorage.getItem("account"),
      },
    })
      .then((res) => {
        this.$store.commit("setFileTree", res.data);
        this.$router.replace({ name: "Filedisplay" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
  components: {},
};
</script>

<style scope>
</style>