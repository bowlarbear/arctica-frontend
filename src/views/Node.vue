<template>
<div v-if="this.loading == true">
  <Loader/>
</div>

<div v-else-if="this.offline == true">
  <header>
      <h1>Please connect to the internet</h1>
      <h2>You must be connected to a network in order to continue.</h2>
      <h4 v-if="this.noNetwork == true">* Please verify that you are connected to the internet</h4>
    </header>
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have connected to the internet.</label>
            </div>
        </form>
            <div class="btn_container"> 
                <button v-if="checkbox" @click="startBitcoin()" class="btn">Proceed</Button>
                <button v-else @click="warn()" class="btn3">Proceed</Button>
            </div>
    </div>
</div>


<div v-else-if="this.confirm == true">
  <header>
    <h1>In order to access your wallet...</h1>
    <h2>You must insert Hardware Wallet 1 and reboot this computer.</h2>
    <h2>Would you like to do this now?</h2>
  </header>
    <div class="btn_container"> 
        <button @click="shutDown()" class="btn">Shutdown Arctica</Button>
        <button @click="goBack()" class="btn2">Go Back</Button>
    </div>
</div>

<div v-else-if="this.shutdown == true">
  <header>
    <h1>Bitcoin Core has been successfully shutdown</h1>
    <h2>You must now shut down this computer, and reboot into HWW 1.</h2>
    <h2>You may now close this window.</h2>
  </header>
</div>

<div v-else class="page">
<header>
  <h1>Welcome to Arctica</h1>
  <h2>You should keep this app running to ensure your Bitcoin Node stays synced.</h2>
  <h2>Always ensure you properly shutdown Arctica before turning off this computer.</h2>
  <h2>What would you like to do?</h2>
</header>
  <div class="btn_container"> 
      <button @click="login()" class="btn">Login to Wallet</Button>
      <button @click="restoreBackup()" class="btn2">Restore a Backup CD</button>
      <button @click="newWallet()" class="btn2">Create New Wallet</button>
      <button @click="shutDown()" class="btn2">Shutdown Arctica</button>
  </div>
</div>
</template>

<script>
import store from '../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke



export default {
  name: 'Node',
  components: {
    Loader
  },
  data(){
     return{
         loading: true,
         offline: false,
         noNetwork: false,
         checkbox: false,
         confirm: false,
     }
 },
 methods:{
  login(){
    this.confirm = true
  },
  goBack(){
    this.confirm = false
  },
  shutDown(){
    this.loading = true
    this.confirm = false
    this.shutdown = true
    store.commit('setLoadMessage', 'stopping Bitcoin Core...')
    invoke('stop_bitcoind').then((res)=>{
      store.commit('setDebug', `stopping bitcoin daemon ${res}`)
      this.loading=false
      }).catch((e)=>{
          store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
          store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Node-5 Response: ${e}`)
          this.$router.push({ name:'Error' })
      })
  },
  restoreBackup(){
    store.commit('setDebug', 'restore Backup button clicked, sending user to restoreBackup flow')
    this.$router.push({ name: 'restoreBackup' })
  },
  warn(){
    //show feedback
  },
  newWallet(){
    store.commit('setDebug', 'create new wallet button clicked, sending user to setup1b')
    this.$router.push({ name: 'Setup1b' })
  },
  startBitcoin(){
    store.commit('setDebug', 'proceed button clicked, checking network connection again')
    //reset the front end state
    this.loading = true
    this.noNetwork = false
    store.commit('setLoadMessage', `Checking Network Connection...`)
    //check network connection
    invoke('check_network').then((res) => {
      store.commit('setDebug', `network is connected ${res}`)
      store.commit('setLoadMessage', `Initializing Bitcoin core...`)
      this.offline = false
      invoke('create_ramdisk').then((res) => {
        store.commit('setDebug', `creating ramdisk ${res}`)
        store.commit('setLoadMessage', `Creating Ramdisk...`)
        //init bitcoin daemon
        invoke('init_bitcoind').then((res) => {
          store.commit('setDebug', `Bitcoin initialized: ${res}`)
          store.commit('setLoadMessage', `Starting Bitcoin Core...`)
          //start Bitcoin core
          invoke('start_bitcoind', {reindex: false, networkactive: true, wallets: false}).then((res)=> {
            store.commit('setDebug', `started bitcoin daemon ${res}`)
            store.commit('setDebug', 'starting check sync status')
            invoke('check_bitcoin_sync_status').then((res)=>{
                store.commit('setDebug', `sync successful${res}`)
                //disable the loading component
                this.loading = false
            }).catch((e)=>{
                store.commit('setDebug', `Error checking sync status: ${e}`)
            })
          }).catch((e)=> {
            //fatal error starting bitcoin daemon
            store.commit('setDebug', `error starting bitcoin daemon error: ${e}`)    
            store.commit('setErrorMessage', `Error Starting Bitcoin Daemon Error code: Node-3 Response: ${e}`)
            this.$router.push({ name: 'Error' })      
          })
        }).catch((e)=>{
            //fatal error init bitcoin daemon
            store.commit('setDebug', `error initializing bitcoin daemon error: ${e}`)    
            store.commit('setErrorMessage', `Error initializing Bitcoin Daemon Error code: Node-6 Response: ${e}`)
            this.$router.push({ name: 'Error' })
          })
      }).catch((e)=>{
          //fatal error create ramdisk
          store.commit('setDebug', `error creating ramdisk error: ${e}`)    
          store.commit('setErrorMessage', `Error creating ramdisk Error code: Node-7 Response: ${e}`)
          this.$router.push({ name: 'Error' })
        })
    }).catch((e) => {
      store.commit('setDebug', `Error No network connection found Error code: Node-4 Response:: ${e}`)
      //no network connection, show feedback
      this.noNetwork = true
      this.loading = false
    })
  }
 },
  mounted(){
    //set a state value here that informs restore backup user is on the node machine
    store.commit('setNode', true)
    store.commit('setDebug', 'Arrived at Node')
    store.commit('setDebug', 'checking network connection')
    store.commit('setLoadMessage', `Checking Network Connection...`)
    //check network connection
    invoke('enable_networking').then((res) => {
      store.commit('setDebug', `Enabling Networking: ${res}`)
      if(res.includes("SUCCESS networking is already enabled")){
        store.commit('setDebug', `network connected: ${res}`)
        store.commit('setLoadMessage', `Initializing Bitcoin core...`)
        //init bitcoin daemon
        invoke('init_bitcoind').then((res) => {
          store.commit('setDebug', `Bitcoin initialized: ${res}`)
          store.commit('setLoadMessage', `Starting Bitcoin Core...`)
          invoke('create_ramdisk').then((res) => {
            store.commit('setDebug', `creating ramdisk ${res}`)
            store.commit('setLoadMessage', `Creating Ramdisk...`)
            //start Bitcoin core
            invoke('start_bitcoind', {reindex: false, networkactive: true, wallets: false}).then((res)=> {
              store.commit('setDebug', `started bitcoin daemon ${res}`)
              store.commit('setDebug', 'starting check sync status')
              store.commit('setLoadMessage', `Syncing Bitcoin Core...Ensure you stay connected to the internet`)
                invoke('check_bitcoin_sync_status').then((res)=>{
                  store.commit('setDebug', `sync successful${res}`)
                  //disable the loading component
                  this.loading = false
                }).catch((e)=>{
                  store.commit('setDebug', `Error checking sync status: ${e}`)
                })
            }).catch((e)=> {
              //fatal error starting bitcoin daemon
              store.commit('setDebug', `error starting bitcoin daemon error: ${e}`)    
              store.commit('setErrorMessage', `Error Starting Bitcoin Daemon Error code: Node-1 Response: ${e}`)
              this.$router.push({ name: 'Error' })      
            })
          }).catch((e)=>{
            //fatal error create ramdisk
            store.commit('setDebug', `error creating ramdisk error: ${e}`)    
            store.commit('setErrorMessage', `Error creating ramdisk Error code: Node-8 Response: ${e}`)
            this.$router.push({ name: 'Error' })
          })
        }).catch((e)=>{
          //fatal error init bitcoin daemon
          store.commit('setDebug', `error initializing bitcoin daemon error: ${e}`)    
          store.commit('setErrorMessage', `Error initializing Bitcoin Daemon Error code: Node-5 Response: ${e}`)
          this.$router.push({ name: 'Error' })
        })
      }
    }).catch((e) => {
      //no network connection, show feedback
      store.commit('setDebug', `Error No network connection found Error code: Node-2 Response:: ${e}`)
      this.loading = false
      this.offline = true
    })
 },
}
</script>
