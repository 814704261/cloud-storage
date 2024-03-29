<template>
  <div class="filedisplay">
    <hometitle @createdir="createDir" />
    <search />
    <ol class="pathBar" ref="pathBar">
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
      @clickfile="clickfile"
    />

    <div class="operate-top" v-if="selectedFiles.length != 0">
      <div @click="cancelSelecte">取消</div>
      <div>已选中{{ selectedFiles.length }}个文件</div>
      <div @click="selecteAll">全选</div>
    </div>

    <div class="operate-bottom" v-if="selectedFiles.length != 0">
      <div @click="download">
        <span class="iconfont icon-icon-"></span>
        <span>下载</span>
      </div>
      <div>
        <span class="iconfont icon-fenxiang" @click="shareFile"></span>
        <span>分享</span>
      </div>
      <div>
        <span class="iconfont icon-shanchu" @click="deletefile"></span>
        <span>删除</span>
      </div>
      <div>
        <span class="iconfont icon-zhongmingming" @click="renameFIle"></span>
        <span>重命名</span>
      </div>
      <div @click="remove">
        <span class="iconfont icon-yidong"></span>
        <span>移动</span>
      </div>
    </div>
    
    <div
      class="uploadFile"
      @click.self="selectFile"
      v-if="selectedFiles.length == 0"
    >
      <input
        type="file"
        multiple
        style="display: none"
        ref="uploadFile"
        @change.stop.prevent="uploadFile"
      />
    </div>

    <popup
      :time="popupShowTime"
      :text="popupText"
      :title="popupTitle"
      :show="popupShow"
    />
  </div>
</template>

<script>
import filesComp from "components/file";
import pathBar from "components/pathBar";
import hometitle from "components/title";
import search from "components/search";
import popup from "components/popup";



import axios from "axios";
import http from "@/network/index.js";

export default {
  data() {
    return {
      files: {}, // 当前的树结构
      selectedFiles: [], //用户选择的文件
      pathDir: [],
      filestyle: true,
      selecteAllStyle: true,
      popupShow: Boolean, //弹窗是否显示
      popupShowTime: 3000, //弹窗显示的时间
      popupTitle: "", // 弹窗的标题
      popupText: "", // 弹窗内容
    };
  },
  methods: {
    popup(title, text, time = 3000) {
      //显示弹窗
      this.popupTitle = title;
      this.popupText = text;
      this.popupShowTime = time;
      this.popupShow = !this.popupShow;
    },
    into(data) {
      // 点击了目录
      // 如果正在操作文件就禁止进入目录
      if (this.selectedFiles.length != 0) return;

      this.files = data;
      this.pathDir.push(data);
    },
    clickfile(data) {
      //用户点击了文件，进入预览页面
      // 如果正在操作文件就禁止点击文件
      if (this.selectedFiles.length != 0) return;

      console.log("点击文件了", data);
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
    cancelSelecte() {
      // 取消选择文件
      this.selectedFiles.splice(0);

      //通过子组件监听属性的方式触发子组件的事件
      this.filestyle = !this.filestyle;
    },
    selecteAll() {
      //全选
      this.selectedFiles.splice(0);
      this.selectedFiles.push(...this.files.children);
      this.selecteAllStyle = !this.selecteAllStyle;
    },
    createDir() {
      // 用户创建文件夹
      let nameDir = window.prompt("输入文件夹名字");
      if (!nameDir || !nameDir.trim())
        return this.popup("创建失败", "你TM的名字呢！！！", 3000);

      let regexp = /(\.+[\/\\]?)+/gi;
      if (regexp.test(nameDir))
        return this.popup("创建失败", "干尼玛的，最好给老子换个名字！", 3000);

      http
        .get("/createdir", {
          params: {
            context: this.files.path,
            name: nameDir,
          },
        })
        .then((result) => {
          this.popup("靓仔牛逼", "创建文件成功");
          this.files = result.data.files;
          // 更新导航栏
          this.files = result.data.files;
          this.pathDir.splice(this.pathDir.length - 1, 1, result.data.files);
          // 更新目录树
          this.$store.commit("changeFileTree", result.data.files);
        })
        .catch((err) => {
          this.popup("卧槽！创建失败了", err);
          alert(err);
        });
    },
    download() {
      // 下载文件
      let filepaths = [];
      for (let file of this.selectedFiles) {
        filepaths.push(file.path);
      }

      this.cancelSelecte();
      this.popup("正在下载", "已添加到下载任务", 1000);

      let quest = {
        source: axios.CancelToken.source(),
        total: 0,
        loaded: 0,
        name: this.files.name + ".tar.gz",
        id: new Date().getTime(),
      };
      this.$store.commit("setDownloadQuest", quest);
      let that = this;

      http
        .post(
          "/download",
          { filepaths },
          {
            responseType: "blob",
            cancelToken: quest.source.token,
            onDownloadProgress(evt) {
              quest.total = evt.total;
              quest.loaded = evt.loaded;
              that.$store.commit("changeDownloadQuest", quest);
            },
          }
        )
        .then((result) => {
          that.$store.commit("deleteDownloadQuest", quest);
          that.popup("下载任务完成", "卧槽！靓仔牛逼", 1000);
          let a = document.createElement("a");
          a.style.display = "none";
          a.href = URL.createObjectURL(result.data);
          a.download = this.files.name + ".tar.gz";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch((err) => {
          this.popup("错误提示", err);
          throw new Error(err);
        });
    },
    deletefile() {
      // 删除文件
      let filepaths = [];
      for (let file of this.selectedFiles) {
        filepaths.push(file.path);
      }
      http
        .post("/deletefile", {
          filepaths,
          context: this.files.path,
        })
        .then((result) => {
          this.popup("删除成功", "靓仔牛逼");
          this.cancelSelecte();
          // 更新导航栏
          this.files = result.data.files;
          this.pathDir.splice(this.pathDir.length - 1, 1, result.data.files);
          // 更新目录树
          this.$store.commit("changeFileTree", result.data.files);
        })
        .catch((err) => {
          this.popup("错误", err);
          throw new Error(err);
        });
    },
    selectFile() {
      //用户选择上传的文件文件
      this.$refs.uploadFile.click();
    },
    uploadFile() {
      //用户上传文件
      let files = this.$refs.uploadFile.files;
      if (files.length == 0) return;

      let formdata = new FormData();
      let fileSize = 0;
      formdata.append("path", this.files.path);

      for (let i = 0; i < files.length; i++) {
        fileSize += files[i].size;
        formdata.append("files", files[i]);
      }
      if (fileSize > this.$store.getters.getSpaceAble)
        return this.popup("上传错误", "可用空间不足", 3000);

      if (fileSize >= 2 * 1024 * 1024 * 1024)
        return this.popup(
          "wo草泥马",
          "想搞坏我的服务器吗，上传文件的总大小不可以超过2G！！！",
          5000
        );

      this.popup("靓仔牛逼", "任务正在上传", 1000);
      let quest = {
        source: axios.CancelToken.source(),
        total: 0,
        loaded: 0,
        name: files[0].name + "等多个文件",
        id: new Date().getTime(),
      };
      this.$store.commit("addUploadQuest", quest);
      let that = this;
      http
        .post("/upload", formdata, {
          onUploadProgress(progressEvent) {
            (quest.total = progressEvent.total),
              (quest.loaded = progressEvent.loaded);
            that.$store.commit("changeUploadQuest", quest);
          },
          cancelToken: quest.source.token,
        })
        .then((result) => {
          if (!result.data.succeed)
            return this.popup("哦豁出错了", result.data.msg, 4000);
          this.popup("靓仔牛逼", "上传完毕", 1000);
          this.files = result.data.files;
          // 更新导航栏
          this.files = result.data.files;
          this.pathDir.splice(this.pathDir.length - 1, 1, result.data.files);
          // 更新目录树
          this.$store.commit("cancelUploadQuest", quest);
          this.$store.commit("changeFileTree", result.data.files);
        })
        .catch((err) => {
          this.popup("报错了大哥", err, 2000);
          throw new Error(err);
        });
    },
    remove() {
      // 文件移动功能
      let paths = this.selectedFiles.map((value) => {
        return value.path;
      });

      this.$router.push({
        name: "SelectPath",
        params: { paths, operation: 0, context: this.files.path },
      });
      this.pathDir.splice(1);
      this.cancelSelecte();
    },
    shareFile() {
      // 文件分享功能
      let paths = [];
      for (let p of this.selectedFiles) {
        paths.push(p.path);
      }
      let password = prompt("请输入密码");
      if (password == null || password.trim() == "")
        return alert("密码不能为空");

      http
        .post("/fileshare", {
          paths,
          password,
          shareEmail: localStorage.getItem("account"),
        })
        .then((result) => {
          this.cancelSelecte();
          let { randomID, password } = result.data;
          try {
            let text = `
            周少的网盘
            神秘链接：${randomID}
            开启密码：${password}
          `;
            if (navigator.clipboard) {
              return navigator.clipboard
                .writeText(text)
                .then((result) => {
                  this.popup("分享成功", "链接已复制到剪贴板", 3000);
                })
                .catch((err) => {
                  this.popup("分享失败", JSON.stringify(err), 3000);
                });
            }

            let inputElement = document.createElement("input");
            inputElement.value = text;

            document.body.append(inputElement);
            inputElement.select();
            document.execCommand("copy");
            document.body.removeChild(inputElement);
            this.popup("分享成功", "链接已复制到剪贴板", 3000);
          } catch (error) {
            this.popup("分享失败", JSON.stringify(error), 3000);
          }
        })
        .catch((err) => {
          this.popup("分享失败", JSON.stringify(err), 3000);
        });
    },
    renameFIle() {
      // 文件重命名功能

      if (this.selectedFiles.length > 1) return;
      let name = prompt("输入名字，记得带后缀名");
      if (name.trim == "") return;

      http
        .get("/rename", {
          params: {
            name,
            filePath: this.selectedFiles[0].path,
            context: this.files.path,
          },
        })
        .then((result) => {
          this.cancelSelecte();
          let data = result.data;
          if (data.err) {
            return this.popup(
              "重命名失败",
              "你小子太垃圾了" + "</br>" + JSON.stringify(data.err),
              4000
            );
          }
          this.files = result.data.files;
          this.$store.commit("changeFileTree", result.data.files);
          this.popup("重命名成功", "牛逼克拉斯", 4000);
        })
        .catch((err) => {
          this.cancelSelecte();
          return this.popup("重命名失败", err, 4000);
        });
    },
  },
  created() {
    console.log("filedisplay created");
    this.files = this.$store.getters.getFileTree;
    this.pathDir.push(this.files);
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
  components: {
    filesComp,
    pathBar,
    hometitle,
    search,
    popup,
  },
};
</script>

<style scope>
.filedisplay {
  padding-bottom: 70px;
}

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

.operate-top {
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
.operate-top div:nth-child(3) {
  color: rgb(0, 142, 236);
  padding: 0 10px;
}

.operate-top div:nth-child(2) {
  font-size: 20px;
  font-weight: 600;
}

.operate-bottom {
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

.operate-bottom > div {
  display: inherit;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  line-height: 22px;
  padding: 0 15px;
}

.operate-bottom > div span:nth-child(1) {
  font-size: 20px;
  font-weight: 600;
}

.uploadFile {
  width: 50px;
  height: 50px;
  background: black;
  position: fixed;
  bottom: 10px;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, 0);
  border-radius: 30px;
}
</style>