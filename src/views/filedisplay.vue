<template>
  <div class="filedisplay">
      <ol class="pathBar">
          <path-bar 
          :class="{last: index == pathDir.length - 1}"
          :file="value" 
          v-for="(value, index) of pathDir" 
          :key="index" 
          :index="index"
          @changepath="changepath"></path-bar>
      </ol>
      <files-comp 
      v-for="(value, index) of files.children" 
      :key="index" 
      :file="value" 
      @selected="selected" 
      @into="into"
      @clickfile="clickfile"></files-comp>
  </div>
</template>

<script>
import filesComp from '../components/file'
import pathBar from '../components/pathBar.vue'

export default {
    data() {
        return {
            files: {}, // 当前的树结构
            selectedFiles: [],
            pathDir: []
        }
    },
    methods: {
        into(data){     // 点击了目录
            this.files = data
            this.pathDir.push(data)
        },
        clickfile(){
            console.log('点击文件了')
        },
        selected(data){     // 选择文件
            for(let i = 0; i < this.files.children.length; i++){
                if(data.path == this.files.children[i].path){
                    return this.selectedFiles.splice(i, 1)
                }
            }
            this.selectedFiles.push(data)
        },
        changepath(data){   // 点击了路径导航
            this.files = data.file
            this.pathDir.splice(data.index + 1)
        }
    },
    created() {
        this.files =  this.$store.getters.getFileTree
        this.pathDir.push(this.files)
    },
    components:{
        filesComp,
        pathBar
    }
}
</script>

<style scope>
.pathBar{
    height: 40px;
    padding: 0 10px;
    overflow-x: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f5f5f5;
}

.last{
    color: #777 !important;
}
</style>