<template>
<div class="page">
<header>
<h1>Package 7 is now complete.</h1>
 <h2>Please remove DVD/M-DISC 7 and Hardware Wallet 7.</h2>
 <h2>Place Hardware Wallet 7, and backups CD 7 and DVD/M-DISC 7 into Envelope 7.</h2> 
 <h2>This envelope should be stored somewhere...[placeholder text]</h2>
 </header>
      <div class="form_container">
        <form>
            <div class="lg_checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">My #7 devices have been placed into Envelope 7.</label>
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
  name: 'Setup49a',
  components: {
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'Setup49b' })
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
                store.commit('setErrorMessage', `Error with async write Error code: Setup49a-1 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
            invoke('stop_bitcoind').then((res) =>{
            store.commit('setDebug', `stopping bitcoin daemon ${res}`)
        }).catch((e)=>{
            store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
            store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Setup49a-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    },
}
</script>
