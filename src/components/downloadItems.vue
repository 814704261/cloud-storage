<template>
    <div class="downloadQuest">
          <div class="downloadQuest-img">
              <img src="~image/fileicon.webp">
          </div>
          <div class="downloadQuest-exhibition">
              <div class="downloadQuest-fileName">{{quest.name}}</div>
              <div class="downloadQuest-progress-wrap">
                  <div class="downloadQuest-progress"></div>
              </div>
              <div class="downloadQuest-fileSize">{{quest.loaded}}字节/0mb</div>
          </div>
          <div class="downloadQuest-operation" @click="cancel">取消下载</div>
    </div>
</template>

<script>
export default {
    name: 'item',
    props: ['quest'],
    methods: {
        cancel(){
            this.quest.source.cancel()
            this.$store.commit('deleteDownloadQuest', this.quest)
        }
    },
}
</script>

<style scope="this api replaced by slot-scope in 2.5.0+">
.downloadQuest{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 60px;
    margin-bottom: 10px;
    background-color: aqua;
}
.downloadQuest-img{
    width: 50px;
    height: 60px;
    margin-right: 5px;
    overflow: hidden;
}

.downloadQuest-img img{
    width: 100%;
    height: 100%;
}

.downloadQuest-operation{
    padding: 5px;
    color: white;
    font-weight: 600;
    margin-left: 5px;
    background-color: red;
}

.downloadQuest-exhibition{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.downloadQuest-fileName{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 26px;
    font-size: 16px;
    font-weight: 600;
}

.downloadQuest-fileSize{
    line-height: 26px;
    font-size: 14px;
}

.downloadQuest-progress-wrap{
    height: 3px;
    background: red;
}

.downloadQuest-progress{
    width: 10px;
    height: 100%;
    background-color: white;
}
</style>