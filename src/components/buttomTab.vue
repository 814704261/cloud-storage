<template>
  <div class="buttomTab">
      <div :class="{actions: currentTab}" @click="tabclick(1)">
          <span class="iconfont icon-shouye"></span>
          <span>首页</span>
      </div>
      <div :class="{actions: !currentTab}" @click="tabclick(2)">
          <span class="iconfont icon-gerenzhongxin"></span>
          <span>个人中心</span>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            currentTab: true
        }
    },
    methods: {
        tabclick(parame){
            switch(parame){
                case 1:
                    if(!this.currentTab){
                        this.currentTab = true
                        this.$emit('goto', '/filedisplay')
                    }
                    break;
                case 2:
                    if(this.currentTab){
                        this.currentTab = false
                        this.$emit('goto', '/profile')
                    }
                    break;
            }
        }
    },
}
</script>

<style scope>

    .buttomTab{
        padding: 10px 0 10px 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: fixed;
        bottom: 0;
        background-color: white;
        box-shadow: 0 5px 5px #888888;
    }

    .buttomTab > div{
        display: inherit;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
        text-align: center;
    }

    .buttomTab > div > span:nth-child(1){
        font-size: 30px;
    }

    .actions{
        animation: animateOne 0.5s forwards;
    }


    @keyframes animateOne{
        30% {
            transform: scale(0.3);
            color: black;
            font-weight: 100;
        }
        60%{
            transform: scale(0.5);
        }
        90%{
            transform: scale(0.3);
        }
        100% {
            transform: scale(1);
            color: pink;
            font-weight: 600;
        }
    }

</style>