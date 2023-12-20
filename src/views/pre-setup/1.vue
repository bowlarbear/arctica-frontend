<template>
  <div v-if="this.loading == true">
  <Loader/>
  </div>
  <!-- Default Display -->
    <div v-else class="login">
      <header>
        <h1>Welcome to Arctica, a secure and easy to use Bitcoin self custody suite.</h1>
        <h2>In order to continue, here is what you will need:</h2>
        <h2>1. A dedicated laptop with atleast 1TB of internal SSD storage space, used as a full node.</h2>
        <h2>2. An optional secondary laptop used exclusively for signing.</h2>
        <h2>3. A USB tethered CD drive if necessary</h2>
        <h2>4. 8 USB good quality sticks with atleast 16GB of storage space</h2>
        <h2>5. A pack of CD-RWs (atleast 10)</h2>
        <h2>6. A pack of either DVD-R or M-DISCs (atleast 7)</h2>
        <h2>The total cost of this setup with 1 computer should only be around $500.</h2>
        <!-- Do we want to reccomend any specific brand names & specs here?         -->
        <!-- Should we add a link to a FAQ on this page? -->
        <h3>Please enter this computer's system level password below (if none leave blank)</h3>
        <h4 v-if="this.badPass== true">*Error: The password you provided is incorrect, repeated failed attempts may cause issues.</h4>
      </header>
        <div class="form_container">
            <form>
                    <label>Enter Password</label>
                   <br><input v-model="password" type="password" required placeholder="This computer's password">
                <div class="checkbox_container">
                    <input type="checkbox" v-model="checkbox" name="checkbox">
                    <label for="checkbox">I have acquired all materials.</label>
                    </div>
            </form>
            <div class="btn_container"> 
                <button v-if="checkbox" @click="acknowledge()" class="btn">Get Started</Button>
                <button v-else @click="warn()" class="btn3">Get Started</Button>
                <button @click="restoreBackup()" class="btn2">Restore From Backup CD</button>
            </div>
        </div> 
    </div>
  </template>
  
  <script>
  import store from '../../store.js'
  import Loader from '@/components/loader'
  const invoke = window.__TAURI__.invoke

  
  export default {
    name: 'Pre-Setup1',
    components: {
      Loader,
    },
      methods: {
         acknowledge(){
            //reset local state
            this.badPass = false
            //set the load message
            store.commit('setLoadMessage', "building iso generator...")
            //enable the loading component
            this.loading = true
            //capture the user inputted sys password and store it in state for later use
            store.commit('setSysPass', this.password)
              store.commit('setLoadMessage', "checking storage media...")
              invoke('get_device_info', {root: this.sysPass}).then((res)=>{
                store.commit('setDebug', `getting device info: ${res}`)
                //populate the devices array
                this.devices = res.split(',')
                store.commit('setDeviceList', this.devices)
                this.loading = false
                //send the user to the next step
                this.$router.push({ name:'Pre-Setup2' })
                //handle error, assumes bad password
              }).catch((e)=>{
                  store.commit('setErrorMessage', `Error get_device_info, Bad Password Error code: Pre-setup1-1 Response: ${e}`)
                  //enable badpass frontend feedback
                  this.badPass = true
                  //disable the loading component
                  this.loading = false
            })
            
          },
          restoreBackup(){
          this.$router.push({ name: 'restoreBackup' })
        },
        },
        computed: {
          sysPass(){
            return store.getters.getSysPass
          }
        },
      data(){
          return{
            checkbox:false,
            loading: false,
            password:'',
            badPass: false,
          }
      }
  }
  </script>
  
  