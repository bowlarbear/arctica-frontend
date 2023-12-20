<template>
    <div v-if="this.loading == true">
        <Loader/>
    </div>
    <div v-else class="page">
        <header>
            <h1>5 of 5 Signing Successful</h1>
            <h2>Please power off this machine. Return to your primary machine, insert HW 1 & the Transfer CD and power on the primary machine.</h2>
            <h2>You may close this window.</h2>
        </header>
        
    
    </div>
    
    </template>
    
    <script>
    import store from '../../../store.js'
    import Loader from '@/components/loader'
    const invoke = window.__TAURI__.invoke
    
    export default {
      name: '5of5success',
      components: {
        Loader,
        },
        computed:{
        },
        mounted(){
            invoke('stop_bitcoind').then((res) =>{
                store.commit('setDebug', `stopping bitcoin daemon ${res}`)
                this.loading = false
            }).catch((e)=>{
                store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
                store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: 2of5success-1 Response: ${e}`)
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
    

