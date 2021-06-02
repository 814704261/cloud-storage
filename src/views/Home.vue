<template>
  <div>
      <hometitle/>
      <search/>
      <router-view></router-view>
  </div>
</template>

<script>

import hometitle from '../components/title.vue'
import search from '../components/search.vue'
import axios from 'axios'

export default {
    data() {
        return {
            
        }
    },
    methods: {
        
    },
    created() {
        axios('http://localhost:1234/files').then((res)=>{

            this.$store.commit('setFileTree', res.data[0])
            this.$router.replace({name:'Filedisplay'})
            
        }).catch((err)=>{
            throw new Error(err)
        })
    },
    components: {
        hometitle,
        search
    }
}
</script>

<style scope>

</style>