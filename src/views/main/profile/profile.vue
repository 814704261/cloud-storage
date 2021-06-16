<template>
  <div class="profile">
    <div class="profile-space">
      <div class="profile-space-exhibition">
        <span>{{ getSpaceAble }} / {{ totalSpace }}G</span>
      </div>
      <div class="profile-space-progress-background">
        <div class="profile-space-progress" :style="{width: getWidth}"></div>
      </div>
    </div>
    <div class="profile-log-out" @click="logOut">
      <span>换个账号登录</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalSpace: this.$store.state.totalSpace,
      spaceAble: this.$store.getters.getSpaceAble,
    };
  },
  methods:{
    logOut(){
      localStorage.clear()
      this.$router.replace('/login')
    }
  },
  computed: {
    getSpaceAble() {
      if (this.spaceAble >= 1073741824)
        return (this.spaceAble / 1024 / 1024 / 1024).toFixed(2) + "GB";
      if (this.spaceAble >= 1048576)
        return (this.spaceAble / 1024 / 1024).toFixed(2) + "MB";
      if (this.spaceAble >= 1024)
        return (this.spaceAble / 1024).toFixed(2) + "KB";
    },
    getWidth(){
      let spaceAble = this.spaceAble / 1024 / 1024 / 1024
      let width = spaceAble / this.totalSpace * 100 + '%'
      return width
    }
  },

};
</script>

<style scope>
.profile-space-exhibition {
  white-space: pre;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  font-weight: 600;
}

.profile-space-progress-background {
  width: 100%;
  background: black;
  height: 20px;
}

.profile-space-progress {
  width: 0;
  height: 100%;
  background: rgb(252, 95, 95);
}

.profile-log-out {
  width: 80%;
  height: 50px;
  background-color: aqua;
  margin: 50px auto 0 auto;
  border-radius: 25px;
  text-align: center;
  line-height: 50px;
  font-weight: 600;
  font-size: 18px;
}
</style>