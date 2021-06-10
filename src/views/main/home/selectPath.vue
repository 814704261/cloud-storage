<template>
  <div class="selectpath">
    <ol class="pathBar">
      <path-bar
        :class="{ last: index == pathDir.length - 1 }"
        :file="value"
        v-for="(value, index) of pathDir"
        :key="index"
        :index="index"
        @changepath="changepath"
      />
    </ol>

    <files-comp
      v-for="(value, index) of currentTress.children"
      :key="index"
      :file="value"
      @into="into"
    />

    <div class="selectpath-operation" v-if="show">
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
  name: "SelectPath",
  data() {
    return {
      paths: this.$route.params.paths, // 传过来的需要操作的路径
      operation: this.$route.params.operation, // 如果是移动操作,值为0
      currentTress: {}, // 当前目录树
      pathDir: [],
      show: true, // 用户只能点击一次，无论成功与失败
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
      (this.show = false), this.$router.back();
    },
    confirm() {
      this.show = false;
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
        context: this.currentTress.path
      }
      axios
        .post("/remove",data)
        .then((result) => {
          this.$store.commit('changeFileTree', result.data.files[0])
          this.$router.replace('/')
        })
        .catch((err) => {
          console.log(err);
        })
    },
    copy() {
      console.log("copy");
    },
  },
  created() {
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