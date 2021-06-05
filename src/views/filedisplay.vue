<template>
  <div class="filedisplay">
      <hometitle @createdir="createDir"/>
      <search/>
      <ol class="pathBar" ref="pathBar">
          <path-bar 
          :class="{last: index == pathDir.length - 1}"
          :file="value"
          v-for="(value, index) of pathDir" 
          :key="index" 
          :index="index"
          @changepath="changepath"/>
      </ol>
      <files-comp 
      v-for="(value, index) of getFiles" 
      :key="index" 
      :file="value"
      :filestyle="filestyle"
      :selecteallstyle="selecteAllStyle"
      @selected="selected(value)" 
      @into="into"
      @clickfile="clickfile"/>

      <div class="operate-top" v-if="selectedFiles.length != 0">
          <div @click="cancelSelecte">取消</div>
          <div>已选中{{selectedFiles.length}}个文件</div>
          <div @click="selecteAll">全选</div>
      </div>

      <div class="operate-bottom" v-if="selectedFiles.length != 0">
          <div @click="download">
              <span class="iconfont icon-icon-"></span>
              <span>下载</span>
          </div>
          <div>
              <span class="iconfont icon-fenxiang"></span>
              <span>分享</span>
          </div>
          <div>
              <span class="iconfont icon-shanchu" @click="deletefile"></span>
              <span>删除</span>
          </div>
          <div>
              <span class="iconfont icon-zhongmingming"></span>
              <span>重命名</span>
          </div>
          <div>
              <span class="iconfont icon-yidong"></span>
              <span>移动</span>
          </div>
      </div>

      <popup 
      :time="popupShowTime"
      :text="popupText"
      :title="popupTitle"
      :show="popupShow"/>
  </div>
</template>

<script>
import filesComp from '../components/file'
import pathBar from '../components/pathBar.vue'
import hometitle from '../components/title.vue'
import search from '../components/search.vue'
import popup from '../components/popup.vue'


import axios from 'axios'


export default {
    data() {
        return {
            files: {}, // 当前的树结构
            selectedFiles: [],  //用户选择的文件
            pathDir: [],
            filestyle: true,
            selecteAllStyle: true,
            popupShow: Boolean,      //弹窗是否显示
            popupShowTime: 3000,   //弹窗显示的时间
            popupTitle: '', // 弹窗的标题
            popupText: ''   // 弹窗内容
        }
    },
    methods: {
        popup(title, text, time=3000){      //显示弹窗
            this.popupTitle = title
            this.popupText = text
            this.popupShowTime = time
            this.popupShow = !this.popupShow
        },
        into(data){     // 点击了目录
            // 如果正在操作文件就禁止进入目录
            if(this.selectedFiles.length != 0) return 

            this.files = data
            this.pathDir.push(data)
        },
        clickfile(data){    //用户点击了文件，进入预览页面
            // 如果正在操作文件就禁止点击文件
            if(this.selectedFiles.length != 0) return

            console.log('点击文件了', data)
        },
        selected(data){     // 选择文件
            for(let i = 0; i < this.selectedFiles.length; i++){
                if(data.path == this.selectedFiles[i].path){
                    return this.selectedFiles.splice(i, 1)
                }
            }
            this.selectedFiles.push(data)
        },
        changepath(data){   // 点击了路径导航
            this.files = data.file
            this.pathDir.splice(data.index + 1)
        },
        cancelSelecte(){    // 取消选择文件
            this.selectedFiles.splice(0)

            //通过子组件监听属性的方式触发子组件的事件
            this.filestyle = !this.filestyle
        },
        selecteAll(){   //全选
            this.selectedFiles.splice(0)
            this.selectedFiles.push(...this.files.children)
            this.selecteAllStyle = !this.selecteAllStyle
        },
        createDir(){        // 用户创建文件夹
            let nameDir = window.prompt('输入文件夹名字')
            if(!nameDir || !nameDir.trim()) return

            axios.get('http://localhost:1234/createdir',{
                params: {
                    context: this.files.path,
                    name: nameDir
                }
            }).then((result)=>{
                this.popup('靓仔牛逼', '创建文件成功')
                this.files = result.data.files[0]
                this.$store.commit('changeFileTree', result.data.files[0])
            }).catch(err => {
                this.popup('卧槽！创建失败了', err)
                alert(err)
            })
        },
        download(){     // 下载文件
            let filepaths = []
            for(let file of this.selectedFiles){
                filepaths.push(file.path.split('\\USERDIR\\')[1])
            }
            
            this.cancelSelecte()
            popup('正在下载','已添加到下载任务')

            axios('http://localhost:1234/download', {
                params: {
                    filepaths
                },
                responseType:'blob',
                onDownloadProgress(evt){
                    console.log(evt)
                }
            })
            .then((result)=>{
                let a = document.createElement('a')
                a.style.display = 'none'
                a.href = URL.createObjectURL(result.data)
                a.download = this.files.name + '.tar.gz'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
            }).catch(err => {
                popup('错误提示',err)
                throw new Error(err)
            })
        },
        deletefile(){   // 删除文件
            let filepaths = []
            for(let file of this.selectedFiles){
                filepaths.push(file.path)
            }
            axios('http://localhost:1234/deletefile', {
                params: {
                    filepaths,
                    context: this.files.path,
                }
            }).then(result => {
                this.popup('删除成功', '靓仔牛逼')
                this.cancelSelecte()
                this.files = result.data.files[0]
                this.$store.commit('changeFileTree', result.data.files[0])
            }).catch(err => {
                this.popup('错误', err)
                throw new Error(err)
            })
        }
    },
    created() {
        this.files =  this.$store.getters.getFileTree
        this.pathDir.push(this.files)
    },
    computed: {
        getFiles(){
            let children = this.files.children
            return children.sort((a, b) => {
                if (a.type == 'file') {
                    return 1
                }
                return -1
            })
        }
    },
    components:{
        filesComp,
        pathBar,
        hometitle,
        search,
        popup
    }
}
</script>

<style scope>

.filedisplay{
    padding-bottom: 70px;
}

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


.operate-top{
    height: 60px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(0, 174, 255);
}
.operate-top div:nth-child(1),
.operate-top div:nth-child(3){
    color: rgb(0, 142, 236);
    padding: 0 10px;
}

.operate-top div:nth-child(2){
    font-size: 20px;
    font-weight: 600;
}

.operate-bottom{
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(0, 174, 255);
}

.operate-bottom > div{
    display: inherit;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    line-height: 22px;
    padding: 0 15px;
}

.operate-bottom > div span:nth-child(1){
    font-size: 20px;
    font-weight: 600;
}
</style>