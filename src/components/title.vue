<template>
  <div class="title">
      <div>周少的网盘</div>
      <div>
          <span class="icon-shangchuan iconfont"></span>
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

    .title > div:nth-child(2){
        width: 35px;
        height: 35px;
        border-radius: 50%;
        text-align: center;
        line-height: 35px;
        font-size: 22px !important;
        color: white;
        font-weight: 600;
        background-color: #c0c0c0;
    }
</style>