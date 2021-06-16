<template>
  <div class="home">
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
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
        console.log("这是文件目录树", res.data);
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