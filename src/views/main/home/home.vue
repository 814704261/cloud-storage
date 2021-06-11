<template>
  <div class="home">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  created() {
    console.log("home created");

    axios("http://localhost:1234/files", {
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