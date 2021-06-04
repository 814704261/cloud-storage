<template>
  <div class="login">
      <h1 class="title">欢迎来到周少网盘</h1>
      <div class="form">
          <div class="account">
              <input type="email" placeholder="请输入邮箱" v-model.trim="formData.account">
          </div>
          <div class="verification">
              <input type="text" placeholder="请输入验证码" v-model.trim="formData.verification">
              <div class="getverification" @click="getverification">获取验证码</div>
          </div>
      </div>
      <div class="commit" @click="commit">
          登录
      </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
    data() {
        return {
            formData: {
                account: '',
                verification: ''
            }
        }
    },
    methods: {
        commit(){
            if(
                this.formData.account == '' ||
                this.formData.verification == ''
            ) return alert('请填写完表单')

            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if(!reg.test(this.formData.account)) return alert('请输入正确的邮箱')

            axios('http://localhost:1234/login',{
                params: {
                    account: this.formData.account,
                    verification: this.formData.verification
                }
            }).then((result)=>{
                
                if(result.data.succeed){
                    localStorage.setItem('account', this.formData.account)
                    this.$store.commit('setAccount', this.formData.account)
                    this.$router.replace('/')
                }else{
                    alert(result.data.msg)
                }


            }).catch(err => {
                throw new Error(err)
            })


        },
        getverification(){
            axios('http://localhost:1234/getverification',{
                params: {
                    email: this.formData.account
                }
            }).then((result)=>{
                let data = result.data
                if(data.succeed){
                    alert('邮件已发送，请注意查收，如果找不到，请看看垃圾箱')
                }else{
                    alert('不知名的错误')
                }
            }).catch(err => {
                alert('当前网络状态不佳')
                throw new Error(err)
            })
        }
    },
}
</script>

<style scope>

.title{
    padding: 30px 0;
    margin-bottom: 50px;
}
.login{
    padding: 0 20px;
    height: 100vh;
    background-color: rgb(255, 255, 255);
}

.form{
    width: 100%;
}

.form input{
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    border-bottom: 1px solid #777;
}

.account,
.verification,
.passwrod{
    width: 100%;
    height: 60px;
    margin: 20px 0;
}

.verification{
    position: relative;
}

.getverification{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    line-height: 60px;
}

.commit{
    margin-top: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 22px;
    font-weight: 700;
    border-radius: 25px;
    background-color: aquamarine;
}

</style>