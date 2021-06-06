<template>
  <div class="download">
      <item
      v-for="(item, index) in quest" :key="index"
      :quest="item"
      />
      <div v-if="quest.length == 0">
          <h1>没有任何下载内容</h1>
      </div>
  </div>
</template>

<script>
import item from 'components/downloadItems'

export default {
    name: 'download',
    data() {
        return {
            quest: this.$store.state.downloadQuest
        }
    },
    components:{
        item
    }
}
</script>

<style scope>

</style>