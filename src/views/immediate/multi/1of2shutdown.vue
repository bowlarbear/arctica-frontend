<template>
<div v-if="this.loading == true">
    <Loader/>
</div>
<div v-else class="page">
    <header>
        <h1>1 of 2 Signing Successful</h1>
        <h2>Please turn off this computer, insert your next available HW and restart.</h2>
        <h2>You may close this window. </h2>
    </header>
    

</div>

</template>

<script>
import store from '../../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: '1of2shutdown',
  components: {
    Loader,
    },
    computed:{
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
    },
    mounted(){
        //note: only necessary to packup on HW 1
        invoke('stop_bitcoind').then((res)=>{
            store.commit('setDebug', `stopping bitcoin daemon ${res}`)
            invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) =>{
                store.commit('setDebug', `packing up sensitive ${res}`)
                this.loading=false
            }).catch((e)=>{
                store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
                store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: 1of2success-1 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
        }).catch((e)=>{
            store.commit('setDebug', `error packing up sensitive ${e}`)
            store.commit('setErrorMessage', `Error with packing up sensitive: 1of2success-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    }, 
    data(){
        return{
            loading: true,
        }
    }
}
</script>

<style>

.strong{
    font-weight: 800;
}
</style>
