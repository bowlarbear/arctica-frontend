<template>
<div id="progressbar">
    <div v-if="setupStage == 1" id="stage1" class="stage active">Initial Flash</div>
    <div v-else id="stage1" class="stage">Initial Flash</div>
    <div v-if="setupStage == 2" id="stage2" class="stage active">Key Gen</div>
    <div v-else id="stage2" class="stage">Key Gen</div>
    <div v-if="setupStage == 3" id="stage3" class="stage active">Backups</div>
    <div v-else id="stage3" class="stage">Backups</div>
    <div v-if="setupStage == 4" id="stage4" class="stage active">Sync Bitcoin</div>
    <div v-else id="stage4" class="stage">Sync Bitcoin</div>
</div>
</template>


<script>
import store from '../store.js'



export default{
    name: 'ProgressBar',
    methods: {},
    computed: {
      setupStage(){
        return store.getters.getSetupStage
      }
    },
    data(){
      return{
      }
  },
    }
</script>

<style scoped>
#progressbar {
    margin: auto 0;
    padding-top: 10%;
    padding-bottom: 5%;
    padding-right: 5%;
    padding-left: 5%;
    display: flex;
    height: 0.5rem;
    width: 80%;
    border: 0px solid black;
}.stage {
    width: 25%;
    height: 20px;
    text-align: center;
    line-height: 20px;
    background-color: lightgray;
    border-radius:10px;
}.active {
    background-color: #F7931A;
    color: white;
    border-radius:10px;
}
</style>