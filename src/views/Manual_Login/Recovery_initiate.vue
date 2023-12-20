<template>

  <div v-if="this.loading == true">
  <Loader/>
  </div>

  <div v-else-if="this.cdfinished == true" class="page">
    <header>
      <h1>Recovery disk created</h1>
      <h2>Please power off this machine, insert your next available Hardware Wallet and reboot.</h2>
    </header>
  </div>
   
  <div v-else class="page">
    <header>
      <h1>Manual Recovery Initiated.</h1>
      <h2>Please insert a blank CD(RW).</h2>
    </header>
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted a transfer CD.</label>
            </div>
        </form>
      <div class="btn_container"> 
        <button @click="acknowledge()" class="btn">Ok</Button>
        <button @click="help()" class="btn2">I need help</button>
      </div>
    </div>
  </div>

</template>

<script>
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'RecoveryInitiate',
  components: {
    Loader,
  },
    methods: {
        acknowledge(){
          this.loading=true
          store.commit('setLoadMessage', 'creating recovery cd...')
          //creating recovery cd
          invoke('recovery_initiate').then((res)=>{
            store.commit('setDebug', `creating recovery cd ${res}`)
            this.loading=false
            this.cdfinished=true
          })
          .catch((e)=>{
            store.commit('setDebug', `error creating recovery cd ${e}`)
            this.loading=false
          })
        },
        help(){
            //placeholder
        }
    },
    data(){
        return{
            loading: false,
            cdfinished: false,
            checkbox: false,
        }
    },
  }
</script>

