<template :key="selectpath">
  <div class="selectpath">
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
      v-for="value of currentTress.children"
      :key="value.path"
      :file="value"
      @into="into"
    />

    <div class="selectpath-operation">
      <div class="selectpath-operation-cancel" @click="cancel">
        <span>取消</span>
      </div>
      <div class="selectpath-operation-confirm" @click="confirm">
        <span>粘贴</span>
      </div>
    </div>
  </div>
</template>

<script>
import filesComp from "components/file";
import pathBar from "components/pathBar";
import axios from "axios";

export default {
  data() {
    return {
      context: this.$route.params.context, //传过来的参数，移动文件所在的文件夹路径
      paths: this.$route.params.paths, // 传过来的需要操作的路径
      operation: this.$route.params.operation, // 如果是移动操作,值为0
      currentTress: {}, // 当前目录树
      pathDir: [],
    };
  },
  methods: {
    into(data) {
      this.currentTress = data;
      this.pathDir.push(data);
    },
    changepath(data) {
      this.currentTress = data.file;
      this.pathDir.splice(data.index + 1);
    },
    cancel() {
      this.$router.back();
    },
    confirm() {
      if(this.context == this.currentTress.path) return alert('你他妈是傻逼吗，文件就在这个文件夹里面')
      switch (this.operation) {
        case 0:
          this.remove();
          break;
        case 1:
          this.copy();
          break;
        default:
          break;
      }
    },
    remove() {
      let data = {
        paths: this.paths,
        context: this.currentTress.path,
      };
      axios
        .post("/remove", data)
        .then((result) => {
          console.log(result.data)
          this.$router.replace("/")
        })
        .catch((err) => {
          console.log(err);
        });
    },
    copy() {
      console.log("copy");
    },
  },
  created() {
    console.log('selected created')
    this.currentTress = this.$store.getters.getFileTree;
    this.pathDir.push(this.currentTress);
  },
  components: {
    filesComp,
    pathBar,
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

.selectpath {
  padding-bottom: 50px;
}

.selectpath-operation {
  width: 100vw;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}
.selectpath-operation-cancel,
.selectpath-operation-confirm {
  flex: 1;
  height: 100%;
  background: black;
  text-align: center;
  line-height: 50px;
  color: white;
  font-size: 22px;
  font-weight: 600;
}
</style>