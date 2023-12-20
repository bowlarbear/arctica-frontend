<template>
  <div v-if="this.loading == true">
  <Loader/>
  </div>
<div v-else class="page">
    <header>
        <h1>Hardware Wallet 6</h1>
        <h2>Please remove Hardware Wallet 5 & insert Hardware Wallet 6.</h2>
        <h4 v-if="noDevice==true">*No device detected. Please remove it and try again.</h4>
        <h4 v-if="extraDevice==true">*Extra device detected. Please remove it and try again.</h4>
        <h4 v-if="tryAgain==true">*Error flashing device. Please remove, reinsert, and try again.</h4>
    </header>   
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted HW 6.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Continue</Button>
            <button v-else @click="warn()" class="btn3">Continue</Button>
        </div>
    </div> 


</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Setup9',
  components: {
    Loader,
    ProgressBar
  },
  methods: {
    acknowledge() {
            this.loading = true
            this.noDevice = false
            this.extraDevice = false
            this.tryAgain = false
            store.commit('setLoadMessage', `Creating Hardware Wallet ${this.hw}...`)
            invoke('create_bootable_usb', {number: this.hw, setup: this.setupStep, awake: false, baseline: this.deviceList}).then((res) => {
                store.commit('setDebug', `Hardware Wallet initialized with config hwNumber:${this.hw} and setupStep:${this.setupStep}`)
                store.commit('setDebug', `create bootable HW ${this.hw} completed: ${res}`)
                this.loading = false
                this.$router.push({ name:'Setup10' })   
            }).catch((e) => {
                if(e.includes("No device found")){
                    this.loading = false
                    this.noDevice = true
                }else if(e.includes("More than one device found")){
                    this.loading = false
                    this.extraDevice = true
                }else if(e.includes("making partition file system")){
                    this.loading = false
                    this.tryAgain = true
                }
                else{
                    store.commit('setDebug', `create bootable error: ${e}`)
                    store.commit('setErrorMessage', `Error creating bootable Error code: Setup9-1 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                }
            })
        },
        warn(){
        },

    },
    data(){
        return{
            checkbox: false,
            loading: false,
            hw: "6",
            setupStep: '6',
            dupeFound: false,
            noDevice: false,
            extraDevice: false,
            devices: [],
            tryAgain: false,
        }
    },
    computed:{
        deviceList:{
            get(){
                return store.getters.getDeviceList
            },
            set(newVal){
                store.commit('setDeviceList', newVal)
            }
        },
    }
}
</script>
