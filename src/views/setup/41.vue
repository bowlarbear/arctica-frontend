<template>
<div class="page">
<header>
<h1>Package 5 is now complete.</h1>
 <h2>Please remove DVD/M-DISC 5 and Hardware Wallet 5.</h2>
 <h2>Place Hardware Wallet 5, and backups CD 5 and DVD/M-DISC 5 into Envelope 5.</h2> 
 <h2>This envelope should be stored somewhere...[placeholder text]</h2>
 </header>
      <div class="form_container">
        <form>
            <div class="lg_checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">My #5 devices have been placed into Envelope 5.</label>
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
  name: 'Setup41',
  components: {
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'Setup42' })
        },
        warn(){
        },

    },
    data(){
        return{
            checkbox: false,
            setupStep: '0',
        }
    },
    mounted(){
        //update HW setupstep to 0
        invoke('async_write', {name: 'setupStep', value: this.setupStep}).then(() => {
            })
            .catch((e) => {
                store.commit('setDebug', `async write error: ${e}`)
                store.commit('setErrorMessage', `Error with async write Error code: Setup41-1 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
        invoke('stop_bitcoind').then((res) =>{
            store.commit('setDebug', `stopping bitcoin daemon ${res}`)
        }).catch((e)=>{
            store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
            store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Setup41-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    },
}
</script>
