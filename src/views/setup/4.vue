<template>
  <div v-if="this.loading == true">
  <Loader/>
  </div>
<div v-else class="page">
    <header>
        <h1>Hardware Wallet 1</h1>
        <h2>Please insert Hardware Wallet 1.</h2>
        <h4 v-if="noDevice==true">*No device detected. Please remove it and try again.</h4>
        <h4 v-if="extraDevice==true">*Extra device detected. Please remove it and try again.</h4>
        <h4 v-if="tryAgain==true">*Error flashing device. Please remove, reinsert, and try again.</h4>
    </header>    
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted HW 1.</label>
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
  name: 'Setup4',
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
            invoke('create_bootable_usb', {number: this.hw, setup: this.setupStep, awake: true, baseline: this.deviceList}).then((res) => {
                store.commit('setDebug', `Hardware Wallet initialized with config hwNumber:${this.hw} and setupStep:${this.setupStep}`)
                store.commit('setDebug', `create bootable HW ${this.hw} completed: ${res}`)
                this.loading = false
                this.$router.push({ name:'Setup5' })   
            })
            .catch((e) => {
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
                store.commit('setErrorMessage', `Error creating bootable Error code: Setup4-1 Response: ${e}`)
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
            loading: true,
            hw: "1",
            setupStep: '1',
            noDevice: false,
            extraDevice: false,
            devices: [],
            Mount: '',
            Size: '',
            tryAgain: false,
        }
    },
    mounted(){
        store.commit('setLoadMessage', 'obtaining device info...')
        store.commit('setDebug', `getting baseline...`)
            invoke('get_baseline').then((res)=>{
                store.commit('setDebug', `getting baseline fdisk reading: ${res}`)
                //populate the devices list
                store.commit('setDeviceList', res)
                this.loading = false
            }).catch((e)=>{
                store.commit('setDebug', `get_baseline error: ${e}`)
                store.commit('setErrorMessage', `Error obtaining baseline device list Error code: Setup4-3 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
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
