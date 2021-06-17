<template>
  <div class="popup" v-if="isshow">
      <div class="popup-content">
          <div class="popup-content-title">
              <span>{{title}}</span>
          </div>
          <div class="popup-content-text">
              <span>{{text}}</span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    props: ['time', 'title', 'text', 'show'],
    data() {
        return {
            isshow: false,
            timer: 0
        }
    },
    watch: {
        show(){
            if(this.isshow){
                clearTimeout(this.timer)
            }
            this.isshow = true
            this.timer = setTimeout(()=>{
                this.isshow = false
            }, this.time)
        }
    }
}
</script>

<style scope>
.popup {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background: rgba(255, 255, 255, .5);
}
.popup-content{
    width: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    box-shadow: 0 3px 9px rgb(0 0 0 / 50%);
    background: white;
    animation: showPopup 0.5s ease-in 1 forwards;
}

.popup-content-title{
    padding: 15px;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #e5e5e5;
}
.popup-content-text{
    padding: 15px;
    overflow: hidden;
    word-break: break-all;
}

@keyframes showPopup {
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
</style>