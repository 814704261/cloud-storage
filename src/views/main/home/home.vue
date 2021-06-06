<template>
  <div class="home">
      <router-view></router-view>
  </div>
</template>

<script>


import axios from 'axios'

export default {
    data() {
        return {
            
        }
    },
    methods: {
        
    },
    created() {
        axios('http://localhost:1234/files', {
            params:{
                account: localStorage.getItem('account')
            }
        }).then((res)=>{

            this.$store.commit('setFileTree', res.data[0])
            this.$router.replace({name:'Filedisplay'})
            
        }).catch((err)=>{
            throw new Error(err)
        })
    },
    components: {
        
    }
}
</script>

<style scope>



</style>