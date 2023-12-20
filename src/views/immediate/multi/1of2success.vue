<template>
<div class="page">
    <header>
        <h1>1 of 2 Signing Successful</h1>
        <h2>Please take your transfer CD and boot into your next available wallet to continue signing.</h2>
        <h2>What would you like to do?.</h2>
        <button @click="shutdown()" class="btn">Shut down</button>
        <button @click="dashboard()" class="btn2">Dashboard</button>
    </header>
    

</div>

</template>

<script>
import store from '../../../store.js'

export default {
  name: '1of2success',
    computed:{
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
    },
    methods:{
        dashboard(){
            this.$router.push({ name: 'dashboard' })
        },
        shtudown(){
            this.$router.push({ name: '1of2shutdown' })
        }
    },
   
}
</script>

<style>

.strong{
    font-weight: 800;
}
</style>
