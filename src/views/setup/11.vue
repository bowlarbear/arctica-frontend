<template>
<div class="page">
    <header>
        <h1>Hardware Wallet initial flash successful</h1>
        <h2>Please power off this machine, insert Hardware Wallet 1 and power it on.</h2>
        <h2>You should automatically boot into the Hardware wallet's internal operating system, however,
           some computers will require you to manually configure the boot order within the BIOS.</h2>
        <h2>Once you reach the desktop screen, you should navigate to your home directory and double click the "Arctica" program</h2>
        <h2>You may close this window.</h2>
           <h2> <a href="#">See here for help.</a></h2>
    </header>   

</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Setup11',
  components: {
    ProgressBar
  },
  mounted(){
    invoke('async_write', {name: 'type', value: "node"}).then(() => {
      store.commit('setDebug', 'updated config from init to node')
    }).catch((e) => {
        store.commit('setDebug', `async write error: ${e}`)
        store.commit('setErrorMessage', `Error with async write Error code: Setup11-1 Response: ${e}`)
        this.$router.push({ name:'Error' })
    })      
  },
}
</script>

