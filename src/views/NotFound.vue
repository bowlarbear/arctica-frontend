<template>
<div class="page">
    <header>
        <h1>Something went wrong!</h1>
        <h2>Now you've done it!</h2>
        <h2>You've gone and broken something.</h2>
        <h2>Just kidding you should not be seeing this screen at all.</h2>
        <h2>This is entirely the fault of some crackpot junior developer</h2>
    </header>
    <div class="btn_container"> 
        <button @click="goHome()" class="btn">Go Back Home</button>
    </div>
    
</div>
</template>

<script>
import store from '../store.js'

export default{

    methods:{
        goHome(){
            store.commit('setDebug', 'go home button pushed, Sending user to dashboard')
            this.$router.push({ name: 'dashboard' })
        }
    }

}

</script>

<style>

</style>