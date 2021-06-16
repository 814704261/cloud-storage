<template>
  <div class="preview">
    <ol class="pathBar">
      <path-bar
        :class="{ last: index == pathDir.length - 1 }"
        :file="value"
        v-for="(value, index) of pathDir"
        :key="value.path"
        :index="index"
        @changepath="changepath"
      />
    </ol>
    <files-comp
      v-for="value of getFiles"
      :key="value.path"
      :file="value"
      :filestyle="filestyle"
      :selecteallstyle="selecteAllStyle"
      @selected="selected(value)"
      @into="into"
    />

    <div class="preview-tools">
      <div class="preview-cancel" @click="cancel">
        <span>取消</span>
      </div>
      <div class="preview-save" @click="save">
        <span>保存</span>
      </div>
    </div>
  </div>
</template>

<script>
import filesComp from "components/file";
import pathBar from "components/pathBar";

export default {
  data() {
    return {
      files: null,
      selectedFiles: [], //用户选择的文件
      pathDir: [],
      filestyle: true,
      selecteAllStyle: true,
    };
  },
  components: {
    filesComp,
    pathBar,
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    save() {
      if (this.selectedFiles.length == 0) return alert("请选择文件");
      let paths = [];
      let fileSize = 0;
      for (let p of this.selectedFiles) {
        paths.push(p.path);
        if(p.type = 'file'){
          fileSize += p.size
        }else{
          fileSize += this.recursion(p)
        }
      }
      console.log('选择的文件大小', fileSize)
      if(fileSize > this.$store.getters.getSpaceAble) return alert('你的可用空间不足')

      this.$router.replace({
        name: "SelectPath",
        params: {
          paths,
          context: null,
          operation: 1,
        },
      });
    },
    into(data) {
      // 点击了目录
      // 如果正在操作文件就禁止进入目录
      if (this.selectedFiles.length != 0) return;
      this.files = data;
      this.pathDir.push(data);
    },
    selected(data) {
      // 选择文件
      for (let i = 0; i < this.selectedFiles.length; i++) {
        if (data.path == this.selectedFiles[i].path) {
          return this.selectedFiles.splice(i, 1);
        }
      }
      this.selectedFiles.push(data);
    },
    changepath(data) {
      // 点击了路径导航
      this.files = data.file;
      this.pathDir.splice(data.index + 1);
    },
    recursion(tree) {
      let space = 0;

      for (let f of tree.children) {
        if (f.type == "file") {
          space += f.size;
        } else {
          return (space += recursion(f));
        }
      }
      return space;
    },
  },
  computed: {
    getFiles() {
      let children = this.files.children;
      return children.sort((a, b) => {
        if (a.type == "file") {
          return 1;
        }
        return -1;
      });
    },
  },
  created() {
    let init = {
      name: "root",
      children: this.$route.params.files,
    };
    this.files = init;
    this.pathDir.push(this.files);
  },
};
</script>

<style scope>
.pathBar {
  height: 40px;
  padding: 0 10px;
  overflow-x: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #f5f5f5;
}

.last {
  color: #777 !important;
}

.preview {
  padding-bottom: 60px;
}

.preview-tools {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: aqua;
}

.preview-cancel {
  border-right: 1px solid rgb(0, 0, 0);
}

.preview-save {
  border-left: 1px solid rgb(0, 0, 0);
}

.preview-cancel,
.preview-save {
  flex: 1;
  height: 100%;
  line-height: 50px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  color: black;
  font-size: 18px;
}
</style>