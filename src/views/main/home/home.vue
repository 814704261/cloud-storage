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
        if(res.data.succeed){
          this.$store.commit("setFileTree", res.data.files);
          this.$router.replace({ name: "Filedisplay" });
        }else{
          localStorage.clear()
          this.$router.replace({ name: "Login" })
        }
        
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