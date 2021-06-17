<template>
  <div :class="{'file': true, 'file-on': sele}" @click="into">
      <div class="fileicon">
          <img v-if="file.type != 'file'" src="../assets/image/diricon.png">
          <img v-else src="../assets/image/fileicon.webp">
      </div>
      <div class="filename">
          <span>{{file.name}}</span>
          <span>{{file.ctime}}</span>
      </div>
      <div class="operation" @click.stop="selecte">
          <div :class="{'operation-sele': true, 'operation-sele-on': sele}"></div>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        file: Object,
        filestyle: {
            type: Boolean,
            default: false
        },
        selecteallstyle: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            sele: false
        }
    },
    methods: {
        into(){
            if(this.file.type == 'directory'){
                this.$emit('into', this.file)
            }else{
                this.$emit('clickfile', this.file)
            }
        },
        selecte(){
            this.sele = !this.sele
            this.$emit('selected', this.file)
            console.log(this.file.path)
        }
    },
    watch:{
        filestyle(val){
            this.sele = false
        },
        selecteallstyle(){
            this.sele = true
        }
    }
}
</script>

<style scope>

.file{
    width: 100%;
    height: 60px;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}

.file > div {
    flex-shrink: 0;
}

.file-on{
    background-color: pink;
}
.fileicon{
    width: 60px;
    height: 60px;
    overflow: hidden;
    margin-right: 15px;
}

.fileicon img{
    width: 100%;
    height: 100%;
}


.filename{
    flex: 1;
    height: 100%;
    display: inherit;
    flex-direction: column;
    justify-content: space-between;
}

.filename span:nth-child(1){
    flex: 1;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-weight: 600;
    font-size: 18px;
    word-break: break-all;
}

.filename span:nth-child(2){
    color: #cccccc;
}

.operation{
    width: 40px;
    height: 100%;
    display: inherit;
}


.operation-sele{
    margin: auto;
    width: 10px;
    height: 10px;
    border: 2px solid #ccc;
    border-radius: 50%;
}

.operation-sele-on{
    background-color: blue;
}

</style>