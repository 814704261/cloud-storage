<template>
  <div>
      <uploaditem
      v-for="(item, index) of quest"
      :key="index"
      :quest="item"
      />
      <h1 v-if="quest.length == 0">
        暂无上传任务
      </h1>
  </div>
</template>

<script>
import uploaditem from 'components/uploadItems'
export default {
    data(){
      return {
        quest: this.$store.state.uploadQuest
      }
    },
    components:{
      uploaditem
    }
}
</script>

<style>

</style>