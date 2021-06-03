<template>
  <li class="pathName" @click="clickpath">{{file.name}}</li>
</template>

<script>
export default {
    props: ['file', 'index'],
    methods: {
        clickpath(){
            this.$emit('changepath', {
                file: this.file,
                index: this.index
            })
        }
    },
}
</script>

<style scope>
    .pathName{
        display: inline-block;
        flex-shrink: 0;
        color: #337ab7;
        font-size: 16px;
        font-weight: 500;
    }
    .pathName::before{
        padding: 0 5px;
        color: #ccc;
        content: "/\00a0";
    }
</style>