<template>
<!-- Loading Component Display -->
<div v-if="this.loading == true">
  <Loader/>
</div>
<!-- Default Display -->
<div v-else class="page">
    <div class="login">
      <header>
        <h1>We will now create your installation media.</h1>
        <h2>Please insert a blank USB stick of atleast 16GB.</h2>
        <h4 v-if="networkingDisabled">* Error: you must be connected to the internet to continue</h4>
      </header>
        <div class="form_container">
                <form>
                <div class="checkbox_container">
                    <input type="checkbox" v-model="checkbox" name="checkbox">
                    <label for="checkbox">I inserted my USB.</label>
                </div>
            </form>
        </div>
            <div class="btn_container"> 
                <button v-if="checkbox" @click="acknowledge()" class="btn">Create</Button>
                <button v-else @click="warn()" class="btn3">Create</Button>
            </div>
      </div> 
</div>
  </template>
  
  <script>
  import store from '../../store.js'
  import Loader from '@/components/loader'
  const invoke = window.__TAURI__.invoke
  
  export default {
    name: 'Pre-Setup2',
    components: {
      Loader,
    },
      methods: {
        acknowledge(){
          store.commit('setDebug', `ack pressed`)
          //reset the local state
          this.networkingDisabled = false
          //enable the loading component
          this.loading = true
          //set the load component message
          store.commit('setLoadMessage', "obtaining device info")
          //retrieve device info
          invoke('get_device_info', {root: this.sysPass}).then((res)=>{
            store.commit('setDebug', `getting device info: ${res}`)
            //populate the devices array
            this.devices = res.split(',')
            for (const item of this.devices){
              if(!this.deviceList.includes(item)) {
                //obtain the mountpoint with regex
                const regex = /Mount: (.+?) - Model: (.+?) - Size: (.+?)$/;
                const match = item.match(regex);
                if (match){
                  //populate the local state from data() with the appropriate info obtained via regex
                  this.mount = match[1]
                  this.size = match[3]
                }
                break;
              }
            }
            store.commit('setDebug', `discovered differential: ${this.mount}`)
            store.commit('setLoadMessage', 'Creating Installer...')
            //build the iso and flash the target device
            invoke('pre_install', {root: this.sysPass, target: this.mount}).then((res) => {
              store.commit('setDebug', `pre_install completed: ${res}`)
              this.loading = false
              this.$router.push({ name:'Pre-Setup3' })   
            }).catch((e) => {
              //handle the condition where pre_install returns a failed ping
              if(e.includes("ping failed")){
              store.commit('setDebug', `pre_install error, no network connection: Error code: Pre-setup2-3 Response: ${e}`)
              this.networkingDisabled = true
              this.loading = false
              }
              //generic error
              store.commit('setDebug', `pre_install error: ${e}`)
              store.commit('setErrorMessage', `Error pre_install Error code: Pre-setup2-1 Response: ${e}`)
              this.$router.push({ name:'Error' })
            })
          }).catch((e)=>{
            store.commit('setDebug', `get_device_info error: ${e}`)
            store.commit('setErrorMessage', `Error get_device_info Error code: Pre-setup2-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
          })
        },
        },
      data(){
          return{
            checkbox:false,
            loading: false,
            networkingDisabled: false,
            devices: [],
            Mount: '',
            Size: '',
          }
      },
      mounted(){
        //TODO need to capture the baseline device list here and store it in state
      },
      computed: {
      sysPass(){
        return store.getters.getSysPass
      },
      deviceList:{
            get(){
                return store.getters.getDeviceList
            },
            set(newVal){
                store.commit('setDeviceList', newVal)
            }
        },
    },
  }
  </script>
  