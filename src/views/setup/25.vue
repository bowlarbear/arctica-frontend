<template>
<div class="page">
<header>
<h1>Package 1 is now complete.</h1>
 <h2>Please remove DVD/M-DISC 1 and HW 1.</h2>
 <h2>Place Hardware Wallet 1, and backups CD 1 and DVD/M-DISC 1 into Envelope 1.</h2> 
 <h2>This envelope should be stored somewhere secure and easily accessible, like your attic.</h2>
 <h2>Hardware Wallet 1 should be what you boot first when you want to spend or receive bitcoin or check your wallet balances.</h2>
 </header>
      <div class="form_container">
        <form>
            <div class="lg_checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">My #1 devices have been placed into Envelope 1.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
        </div>
    </div> 

</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Setup25',
  components: {
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'Setup26' })
        },
        warn(){
        },

    },
    mounted(){
        //update the setup step
        invoke('async_write', {name: 'setupStep', value: this.setupStep}).then((res) => {
            store.commit('setDebug', `async writing setupstep ${this.setupStep}: ${res} `)
            })
            .catch((e) => {
                store.commit('setDebug', `async write error: ${e}`)
                store.commit('setErrorMessage', `Error with async write Error code: Setup25-1 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
        invoke('stop_bitcoind').then((res) =>{
            store.commit('setDebug', `stopping bitcoin daemon ${res}`)
        }).catch((e)=>{
            store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
            store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Setup25-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    },
    data(){
        return{
            checkbox: false,
            setupStep: '15',
        }
    }
}
</script>
