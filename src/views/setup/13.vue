<template>
  <div v-if="this.loading == true">
  <Loader/>
</div>
<div v-else class="page">
    <header>
        <h1>Key Generation for Wallet 1 complete</h1>
        <h2>Please power off this machine, remove HW 1, insert HW 2, and power on the machine.</h2>
        <h2>You may close this window.</h2>
    </header> 

</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Setup13',
  components: {
    Loader,
    ProgressBar
  },
  computed:{
    hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
    },
    mounted(){
      this.loading = true
      store.commit('setLoadMessage', 'Packing up sensitive info...')
      invoke('stop_bitcoind').then((res)=>{
        store.commit('setDebug', `stopping bitcoin daemon ${res}`)
        invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) =>{
          store.commit('setDebug', `packing up sensitive ${res}`)
          invoke('async_write', {name: 'setupStep', value: this.setupStep}).then(() => {
            this.loading=false
          }).catch((e) => {
              store.commit('setDebug', `async write error: ${e}`)
              store.commit('setErrorMessage', `Error with async write Error code: Setup12-9 Response: ${e}`)
              this.$router.push({ name:'Error' })
          })      
        }).catch((e)=>{
            store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
            store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Setup13-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
      }).catch((e)=>{
        store.commit('setDebug', `error with pack up: ${e}`)
        store.commit('setErrorMessage', `Error packing up Error code: Setup13-1 Response: ${e}`)
        this.$router.push({ name:'Error' })
      })
    },
    data(){
      return{
        loading: false,
        setupStep: '8',
      }
    }
}
</script>

