<template>
  <div class="verify">
      <div class="verify-wrap">
          <div class="verify-link">
              <input type="text" placeholder="神秘代码" v-model.trim="link">
          </div>
          <div class="verify-password">
              <input type="text" placeholder="开启密码" v-model.trim="password">
          </div>
          <div class="verify-sure" @click="sure">
              <span>确定</span>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import http from '@/network/index'

export default {
    data(){
        return {
            link: '',
            password: ''
        }
    },
    methods: {
        sure(){
            if(this.link == '' || this.password == '') return alert('不可为空')
            http.get('/getshare', {
                params: {
                    link: this.link,
                    password: this.password
                }
            })
            .then(result => {
                let data = result.data
                if(data.err) return alert(data.err)
                if(data.exceed) return alert('文件失效了')
                if(!data.succeed) return alert('链接或者密码错误')
                this.$router.replace({name: 'Preview', params:{
                    files: data.files
                }})
            })
            .catch(err => {
                alert(err)
                console.log(err)
            })
        }
    }
}
</script>

<style scope>

.verify{
    width: 100vw;
    height: 100vh;
    background-color: pink;
    position: relative;
}


.verify-wrap{
    width: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: white;
}

.verify-wrap input{
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    text-indent: 2em;
    background-color: transparent;
}

.verify-link{
    width: 100%;
    height: 50px;
}

.verify-sure{
    width: 100%;
    height: 50px;
    background-color: blue;
    margin-top: 10px;
    text-align: center;
    line-height: 50px;
    font-weight: 600;
    font-size: 18px;
    color: white;
}


</style>