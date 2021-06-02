<template>
  <div class="search">
      <div>
          <span class="icon-suosou iconfont searchicon"></span>
          <input type="text" class="inputsearch" placeholder="搜索">
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scope>

    .search{
        padding: 0 20px;
        height: 60px;
        background: white;
        display: flex;
        align-items: center;
    }

    .search > div{
        height: 35px;
        width: calc(100% - 20px);
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 20px;
        background-color: #ececec;
    }

    .searchicon{
        font-size: 20px;
        font-weight: 600;
        margin-right: 5px;
    }

    .inputsearch{
        flex: 1;
        height: 100%;
        border: none;
        outline: none;
        background: transparent;
    }
    .inputsearch::placeholder{
        color: black;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
    }
</style>