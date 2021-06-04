<template>
  <div class="title">
      <div>周少的网盘</div>
      <div class="tools">
          <div>
              <span class="icon-shangchuan iconfont"></span>
          </div>
          <div>
              <span class="icon-jia-tianchong iconfont"></span>
          </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scope>
    .title{
        position: sticky;
        top: 0;
        padding: 0 20px;
        height: 50px;
        background-color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title > div:nth-child(1){
        line-height: 50px;
        font-size: 20px;
        font-weight: 600;
    }

    .tools{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tools > div{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        font-size: 26px !important;
        color: white;
        font-weight: 600;
        background-color: #c0c0c0;
    }
</style>