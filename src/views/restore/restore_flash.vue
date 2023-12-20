
<template>
  <div v-if="this.loading == true">
  <Loader/>
  </div>
<div v-else class="page">
    <header>
      <h1>Replacement Device </h1>
      <h2>Please insert a new, blank USB stick or SD card with atleast 16GB of memory.</h2>
      <h4 v-if="badCD == true"></h4>
    </header>    
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted the device.</label>
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
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

  export default {
    name: 'restoreFlash',
    components: {
      Loader,
    },
      methods: {
        acknowledge() {
          //read_cd and use it to populate state
          this.loading = true
          this.badCD = false
          //check the CD contents and determine what number HW the user is attempting to restore
          invoke('read_cd').then((res) => {
              store.commit('setDebug', `invoking read_cd: ${res}`)
              let resArray = res.split("\n")
              store.commit('setDebug', `response Array: ${resArray}`)
              //check the config values
              for(let i = 0; i < resArray.length; i ++){
                  let it = resArray[i].split("=")
                  store.commit('setDebug', `for loop number: ${i+1}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                  //if config value is set to 'backupcd', user is attempting to manually decrypt
                  if (String(it[0]).toUpperCase() == 'HWNUMBER'){
                      //set the hwNumber state to the corresponding config value
                      this.hwNumber = String(it[1])
                      if(this.hwNumber == "1"){
                        //set awake value true if HW 1, let user awken later otherwise if required
                        this.awakeBool = true
                      }
                      store.commit('setDebug', `backup CD detected`)
                  }
                  else{
                    continue
                  }
              }
              //END OF READ_CD loop
              //run create_bootable to flash currently inserted USB stick into an Arctica HW. 
              store.commit('setLoadMessage', 'Creating Hardware Wallet...')
              invoke('create_bootable_usb', {number: this.hwNumber, setup: this.setupStep, awake: this.awakeBool, baseline: this.deviceList}).then((res) => {
                  store.commit('setDebug', `Hardware Wallet initialized with config hwNumber:${this.hwNumber}, setupStep: ${this.setupStep}, and awake: ${this.awakeBool}`)
                  store.commit('setDebug', `create bootable HW completed: ${res}`)
                  //export the contents of the backup disc
                  invoke('export_backup').then((res)=>{
                    store.commit(`setDebug`, `successfully exported backup, sending user to restoreFlash: ${res}`)
                    //send to restore_final which will instruct them on what to do next
                    this.$router.push({ name:'restoreFinal' })
                    this.loading = false 
                }).catch((e) => {
                  store.commit('setDebug', `export backup error: ${e}`)
                  store.commit('setErrorMessage', `Error exporting backup. Error code: restoreFlash-3 Response: ${e}`)
                  this.$router.push({ name: 'Error' })
                })
              }).catch((e) => {
                  store.commit('setDebug', `create bootable error: ${e}`)
                  store.commit('setErrorMessage', `Error creating bootable Error code: restoreFlash-1 Response: ${e}`)
                  this.$router.push({ name:'Error' })
              })
            }).catch((e)=>{
              store.commit('setDebug', `error reading CD Error Code: restoreFlash-2 Response: : ${e}`)
              this.$router.push({ name:'restoreBackup' })
            })
          },
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
                store.commit('setErrorMessage', `Error obtaining baseline device list Error code: restoreFlash-4 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
        },
      data(){
          return{
            loading: true,
            checkbox: false,
            setupStep: '99',
            badCD: false,
            hwNumber: "0",
            awakeBool: false,
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



















