<template>
  <div>
      <div class="tabBtn">
          <div class="tabBtn-wrap">
              <div
              :class="{active: value == currentTab}"
              v-for="(value, index) in tabs"
              :key="index"
              @click="changeCurrentTab(value)">{{value}}</div>
          </div>
      </div>
      <keep-alive>
          <component :is="currentTabComponent"></component>
      </keep-alive>
  </div>
</template>

<script>

import Upload from 'views/quest/upload'
import Download from 'views/quest/download'

export default {
    name: 'quest',
    data() {
        return {
            currentTab: 'Download',
            tabs: ['Download', 'Upload']
        }
    },
    methods: {
        changeCurrentTab(value){
            this.currentTab = value
        }
    },
    computed:{
        currentTabComponent(){
            return this.currentTab
        }
    },
    components:{
        Download,
        Upload
    }
}
</script>

<style scope>
.tabBtn{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    background-color: pink;
}
.tabBtn-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    overflow: hidden;
    font-size: 20px;
    font-weight: 600;
    background: white;
}

.tabBtn-wrap > div{
    width: 140px;
    height: 100%;
    line-height: 50px;
    text-align: center;
}

.tabBtn-wrap > div:hover{
    background: #e0e0e0;
}

.active{
    background: #e0e0e0;
}
</style>