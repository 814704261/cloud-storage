<template>
  <div class="uploadQuest">
          <div class="uploadQuest-img">
              <img src="~image/fileicon.webp">
          </div>
          <div class="uploadQuest-exhibition">
              <div class="uploadQuest-fileName">{{quest.name}}</div>
              <div class="uploadQuest-progress-wrap">
                  <div class="uploadQuest-progress" :style="{width: process}"></div>
              </div>
              <div class="uploadQuest-fileSize">{{loaded}} / {{total}}</div>
          </div>
          <div class="uploadQuest-operation" @click="cancel">取消上传</div>
    </div>
</template>

<script>
export default {
    name: 'uploaditem',
    props: ['quest'],
    methods: {
        cancel(){
            this.quest.source.cancel()
            this.$store.commit('cancelUploadQuest', this.quest)
        }
    },
    computed:{
        loaded(){
            if(this.quest.loaded > 1024 * 1024 * 1024) return (this.quest.loaded / 1024 / 1024 /1024).toFixed(2) + 'GB'
            if(this.quest.loaded > 1024 * 1024) return (this.quest.loaded / 1024 /1024).toFixed(2) + 'MB'
            if(this.quest.loaded > 1024) return (this.quest.loaded / 1024).toFixed(2) + 'KB'
            return this.quest.loaded + 'byte'
        },
        total(){
            if(this.quest.total > 1024 * 1024 * 1024) return (this.quest.total / 1024 / 1024 /1024).toFixed(2) + 'GB'
            if(this.quest.total > 1024 * 1024) return (this.quest.total / 1024 /1024).toFixed(2) + 'MB'
            if(this.quest.total > 1024) return (this.quest.total / 1024).toFixed(2) + 'KB'
            return this.quest.total + 'byte'
        },
        process(){
            return Number.parseInt(this.loaded) / Number.parseInt(this.total) * 100 + '%'
        }
    }
}
</script>

<style scope>
.uploadQuest{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 60px;
    margin-bottom: 10px;
    background-color: aqua;
}

.uploadQuest > div{
    flex-shrink: 0;
}

.uploadQuest-img{
    width: 50px;
    height: 60px;
    margin-right: 5px;
    overflow: hidden;
}

.uploadQuest-img img{
    width: 100%;
    height: 100%;
}

.uploadQuest-operation{
    padding: 5px;
    color: white;
    font-weight: 600;
    margin-left: 5px;
    background-color: red;
}

.uploadQuest-exhibition{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.uploadQuest-fileName{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 26px;
    font-size: 16px;
    font-weight: 600;
}

.uploadQuest-fileSize{
    line-height: 26px;
    font-size: 14px;
}

.uploadQuest-progress-wrap{
    height: 3px;
    background: red;
}

.uploadQuest-progress{
    width: 0px;
    height: 100%;
    background-color: white;
}
</style>