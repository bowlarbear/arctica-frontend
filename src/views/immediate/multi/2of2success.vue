<template>
<div class="page">
    <header>
        <h1>2 of 2 Signing Successful</h1>
        <h2>Please power off this machine. Swap the current Hardware Wallet for Hardware Wallet 1 and power on this machine.</h2>
        <h2>You may close this window.</h2>
    </header>
    

</div>

</template>

<script>
import store from '../../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: '2of2success',
  components: {
    },
    computed:{
    },
    mounted(){
        invoke('stop_bitcoind').then((res) =>{
            store.commit('setDebug', `stopping bitcoin daemon ${res}`)
        }).catch((e)=>{
            store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
            store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: 1of2success-1 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    }
}
</script>

<style>

.strong{
    font-weight: 800;
}
</style>
