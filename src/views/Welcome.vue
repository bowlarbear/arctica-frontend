<template>
    <div v-if="this.loading == true">
  <Loader/>
  </div>

  <div v-else class="login">
    <header>
      <h1>Welcome to Arctica</h1>
      <h2>Glad to have you back. Please ensure this computer is connected to the internet.</h2>
    </header>
    <div class="btn_container"> 
        <button @click="login()" class="btn">Log in</Button>
        <button v-if="tripwireTripped == 'none' && tripwireSetup == true" @click="quickWithdrawal()" class="btn2">Quick Withdrawal (Disabled)</button>
        <button v-else class="btn6">Quick Withdrawal (Disabled)</button>
       
    </div>
  </div>
</template>

<!-- This screen is where we will eventually:
-check for a BPS connection (update state)
-check the tripwire (update state)
-Check for any published time machine keys/privacy keys (update state) -->

<!-- Quick withdrawal button should eventually grey out if the balance has been swept/accessed or is not set up -->

<script>
import store from '../store.js'
const invoke = window.__TAURI__.invoke
import Loader from '@/components/loader'

export default {
  name: 'Welcome',
  components: {
    Loader
  },
    methods: {
        login(){
            //normal login path, takes the user to the main dashboard when they are already logged in (decrypted tarball)
            if(this.decrypted == true && this.hotHW == true){
              store.commit('setDebug', 'Existing Session Found, Masterkey found, decrypting and sending user to dashboard')
              this.loading = true
                //unpacking sensitive dir
                store.commit('setLoadMessage', 'unpacking tarball...')
                invoke('unpack').then((res)=>{
                  store.commit('setDebug', `unpacking sensitive dir ${res}`)
                  store.commit('setLoadMessage', 'Loading immediate wallet...')
                  invoke('load_wallet', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res) =>{
                      store.commit('setDebug', `Loaded Immediate Wallet: ${res}`)
                      store.commit('setLoadMessage', 'Loading delayed wallet...')
                      invoke('load_wallet', {walletname: "delayed", hwnumber: this.hwNumber.toString()}).then((res) =>{
                          store.commit('setDebug', `Loaded Delayed Wallet: ${res}`)
                          invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) => {
                            store.commit('setDebug', `successfully packed up: ${res}`)
                            this.loading = false
                            store.commit('setDebug', 'Login button pushed Sending user to dashboard')
                            this.$router.push({ name: 'dashboard' })
                          }).catch((e)=>{
                              store.commit('setDebug', `error packing up sensitive: ${e}`)
                              store.commit('setErrorMessage', `Error Packing up Sensitive Error Code: Welcome4 Response: ${e}`)
                              this.$router.push({ name: 'Error' })  
                          })
                      }).catch((e)=>{
                          store.commit('setDebug', `error loading delayed wallet: ${e}`)
                          store.commit('setErrorMessage', `Error Loading delayed Wallet Error Code: Welcome2 Response: ${e}`)
                          this.$router.push({ name: 'Error' }) 
                      })
                  }).catch((e)=>{
                      store.commit('setDebug', `error loading immediate wallet: ${e}`)
                      store.commit('setErrorMessage', `Error Loading immediate Wallet Error Code: Welcome3 Response: ${e}`)
                      this.$router.push({ name: 'Error' }) 
                  })
                }).catch((e)=>{
                  store.commit('setDebug', `error unpacking sensitive dir ${e}`)
                  store.commit('setErrorMessage', `Error unpacking sensitive from welcome. Error code: Welcome1 Response: ${e}`)
                  this.$router.push({ name: 'Error' })
                })
            }
            //user has bricked their relationship with BPS and must manually decrypt
            else if(this.bpsBricked == true){
              store.commit('setDebug', 'Sending user to BPS_Bricked')
              this.$router.push({ name: 'BPS_Bricked' })
            }
            //user is logging in with a warm wallet
            else if(this.hotHW == true){
              this.loading = true
              store.commit('setDebug', 'Initializing New Session, Sending user to Login')
              store.commit('setLoadMessage', 'Installing system updates...')
              //install the required dependencies for a warm wallet
              invoke('install_warm_deps').then((res) => {
                store.commit('setDebug', `Installing Warm Depdencies and security updates: ${res}`)
                this.loading = false
                this.$router.push({ name: 'Login'})
              }).catch((e)=> {
                store.commit('setDebug', `error installing warm deps error: ${e}`)    
                store.commit('setErrorMessage', `Error installing warm deps Error code: Welcome7 Response: ${e}`)
                this.$router.push({ name: 'Error' })      
              })        
            }
            //user does not have a warm wallet inserted and/or is trying to login with a cold wallet and does not have a valid transfer CD inserted
            else{
              store.commit('setDebug', 'Sending user to Boot')
              this.$router.push({ name: 'Boot' })
            }
            
        },
        quickWithdrawal(){
            store.commit('setDebug', 'Quick Withdraw pushed, Sending user to quick1')
            // this.$router.push({ name: 'quick1' })
        },
    },
    computed: {
      timelock(){
        return store.getters.getTimeLock
      },
      btcCoreHealthy(){
        return store.getters.getBTCCoreHealthy
      },
      bpsHealthy(){
        return store.getters.getBPSHealthy
      },
      tripwireTripped(){
        return store.getters.getTripwireTripped
      },
      tripwireSetup(){
        return store.getters.getTripwireSetup
      },
      timeMachineKeysFound(){
        return store.getters.getTimeMachineKeysFound
      },
      privacyKeysFound(){
        return store.getters.getPrivacyKeysFound
      },
      hwNumber:{
            get(){
                return store.getters.getCurrentHW
            },
            set(newVal){
                store.commit('setCurrentHW', newVal)
            }
        },
      bpsBricked(){
        return store.getters.getBPSBricked
      },
      hotHW(){
        return store.getters.getHotHW
      },
      decrypted(){
        if(this.privacyKeysFound == true){
          store.commit('setDecrypted', true)
          return store.getters.getDecrypted
        }else{return store.getters.getDecrypted}
      },
      setupStep(){
        return store.getters.getSetupStep
      },
    },
    data(){
        return{
            syncProgress: 0,
            loading: false
        }
    },
    mounted(){
      store.commit('setDebug', 'arrived at Welcome screen')
      //check if config is present (denotes whether user is here for first time setup or a returning user)
      store.commit('setDebug', `checking for config`)
      invoke('check_for_config').then((res) => {
        if(res == false){
          //send to initial install
          store.commit('setDebug', `no config found, sending to pre-setup flow`)
          this.$router.push({ name: 'Pre-Setup1' }) 
          return
        }else{
          //if config is found, check for init
          store.commit('setDebug', `Config found, checking for type=init`)
          //check if /mnt/ramdisk/CDROM/masterkey exists, in which case set decrypted = true, this check is to prevent unnecessary BPS requests
          store.commit('setDebug', `checking for masterkey`)
          invoke('check_for_masterkey').then((res) => {
            if(res == true){
              store.commit('setDebug', `masterkey found: res:${res}, setting Decrypted to true`)
              store.commit('setDecrypted', true)
            }else{store.commit('setDebug', `no masterkey found`)}
          }).catch((e)=>{
              store.commit('setDebug', `error checking for masterkey ${e}`)
              store.commit('setErrorMessage', `Error checking for masterkey. Error code: Welcome12 Response: ${e}`)
              this.$router.push({ name: 'Error' }) 
            })  
          //reading config values 
          store.commit('setDebug', `reading config`)
          invoke('read').then((res) => {
              store.commit('setDebug', `invoking read config: ${res}`)
              let resArray = res.split("\n")
              store.commit('setDebug', `response Array: ${resArray}`)
              for(let i = 0; i < resArray.length; i ++){
                let it = resArray[i].split("=")
                store.commit('setDebug', `for loop number: ${i+1}; key: ${it[0].toUpperCase()} value: ${it[1]}`)
                //send the user to the test environment if it is designated in the config file
                if (String(it[1]).toUpperCase() == 'TEST'){
                  store.commit('setDebug', 'Test type value found, sending to test environment')
                  this.$router.push({ name: 'TestEnvironment' }) 
                  return
                }
                //send the user to the initial setup flow if it is designated in the config file
                if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'INIT'){
                store.commit('setDebug', `Init Type value found, sending to initial setup`)
                this.$router.push({ name: 'Setup1a' }) 
                return
                }
                //send the user to the node screen if it is designated in the config file
                if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'NODE'){
                store.commit('setDebug', `Node Type value found, sending to Node Screen`)
                store.commit('setNode', true)
                this.$router.push({ name: 'Node' }) 
                return
                }
                //check config for current HW
                if (String(it[0]).toUpperCase() == 'HWNUMBER'){
                  store.commit('setCurrentHW', parseInt(it[1]))
                  this.hwNumber == store.getters.getCurrentHW
                  store.commit('setDebug', `HW NUMBER successfully set to: ${this.hwNumber}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                }
                //check config for current setup step
                else if(String(it[0]).toUpperCase() == 'SETUPSTEP'){
                  store.commit('setSetupStep', parseInt(it[1]))
                  this.setupStep == store.getters.getSetupStep
                  store.commit('setDebug', `SETUP STEP successfully set to: ${this.setupStep}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                }
                //check config for awake bool
                else if(String(it[0]).toUpperCase() == 'AWAKE' && String(it[1]).toUpperCase() == "TRUE"){              
                  store.commit('setHotHW', true)
                  this.hotHW == store.getters.getHotHW
                  store.commit('setDebug', `HOT WALLET VALUE TRUE; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                }
                else{
                  store.commit('setDebug', `fall back inside for loop triggered; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                }
            }
            store.commit('setDebug', `exiting config read`)
            //if the user has completed the initial flash of the 7 Hardware Wallets (config is present) create ramdisk and check for masterkey   
            //creating ramdisk for sensitive data
            invoke('create_ramdisk').then((res)=>{
              store.commit('setDebug', `creating ramdisk ${res}`)
            })
            .catch((e)=>{
              store.commit('setDebug', `error creating ramdisk ${e}`)
              store.commit('setErrorMessage', `Error creating ramdisk. Error code: Welcome9 Response: ${e}`)
              this.$router.push({ name: 'Error' }) 
            })  
            //if user has completed initial setup and booted from a Hardware Wallet, mount internal disk and symlink .bitcoin folders..
            //we MAY be better off removing this as if decrypted was true we assumed the ramdisk already exists above and thus we could probably also assume 
            //that bitcoin core is already running properly and sync MAY have already occurred, in which case running sync again is superfluous. 
            if(this.hotHW == true && this.setupStep == 0){
              store.commit('setDebug', `HOT WALLET VALUE TRUE`)
              store.commit('setDebug', 'current wallet Awake = true and setupStep = 0 conditional met, invoking mount internal')
              this.loading = true
              store.commit('setLoadMessage', 'Mounting the internal drive...')
              invoke('mount_internal').then((res)=> {
                  store.commit('setDebug', `invoking mount internal ${res}`)
                  store.commit('setLoadMessage', 'Checking network connection...')
                  //enable networking so that the user may connect to a network
                  invoke('enable_networking').then((res) => {
                    store.commit('setDebug', `Enabling Networking: ${res}`)
                      //start bitcoind with networking enabled
                      store.commit('setLoadMessage', 'Starting Bitcoin Daemon...')
                      invoke('start_bitcoind', {reindex: false, networkactive: true, wallets: true}).then((res)=> {
                        store.commit('setDebug', `started bitcoin daemon: ${res}`)
                        store.commit('setLoadMessage', 'Syncing Bitcoin Blockchain...Make sure you stay connected to the internet...')
                        invoke('check_bitcoin_sync_status').then((res)=>{
                          store.commit('setDebug', `sync successful${res}`)
                          //disable the loading component
                          this.loading = false
                        }).catch((e)=>{
                          store.commit('setDebug', `Error checking sync status: ${e}`)
                        })
                      }).catch((e)=> {
                      store.commit('setDebug', `error starting bitcoin daemon error: ${e}`)    
                      store.commit('setErrorMessage', `Error Starting Bitcoin Daemon Error code: Welcome6 Response: ${e}`)
                      this.$router.push({ name: 'Error' })      
                      })  
                  }).catch((e) => {
                    store.commit('setDebug', `error enabling networking: ${e}`)
                    store.commit('setErrorMessage', `Error enabling networking Error code: welcome10 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                  })
              }).catch((e)=> {
              store.commit('setDebug', `mount internal error: ${e}`)
              store.commit('setErrorMessage', `Error Mounting internal. Error code: Welcome5 Response: ${e}`)
              this.$router.push({ name: 'Error' })
              })
            }
            //initial set up step redirects
            if(this.setupStep == 99){
              store.commit('setDebug', 'recover value found, redirecting to restore_init')
              this.$router.push({ name: 'restoreInit' })  
            }
            else if(this.setupStep == 1 && this.hwNumber == 1){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 1 found, redirecting user to setup12')
                this.$router.push({ name: 'Setup12' })  
            }
            else if(this.setupStep == 2 && this.hwNumber == 2){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 2 found, redirecting user to setup14a')
                this.$router.push({ name: 'Setup14a' })
            }
            else if(this.setupStep == 3 && this.hwNumber == 3){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 3 found, redirecting user to setup15a')
                this.$router.push({ name: 'Setup15a' })
            }
            else if(this.setupStep == 4 && this.hwNumber == 4){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 4 found, redirecting user to setup16')
                this.$router.push({ name: 'Setup16' })
            }
            else if(this.setupStep == 5 && this.hwNumber == 5){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 5 found, redirecting user to setup18a')
                this.$router.push({ name: 'Setup18a' })
            }
            else if(this.setupStep == 6 && this.hwNumber == 6){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 6 found, redirecting user to setup19a')
                this.$router.push({ name: 'Setup19a' })
            }
            else if(this.setupStep == 7 && this.hwNumber == 7){
                store.commit('setSetupStage', 2)
                store.commit('setDebug', 'setup step 7 found, redirecting user to setup20a')
                this.$router.push({ name: 'Setup20a' })
            }
            else if(this.setupStep == 8 && this.hwNumber == 1){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 8 found, redirecting user to setup21')
                this.$router.push({ name: 'Setup21' })
            }
            else if(this.setupStep == 9 && this.hwNumber == 2){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 9 found, redirecting user to setup27a')
                this.$router.push({ name: 'Setup27a' })
            }
            else if(this.setupStep == 10 && this.hwNumber == 3){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 10 found, redirecting user to setup31a')
                this.$router.push({ name: 'Setup31a' })
            }
            else if(this.setupStep == 11 && this.hwNumber == 4){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 11 found, redirecting user to setup35a')
                this.$router.push({ name: 'Setup35a' })
            }
            else if(this.setupStep == 12 && this.hwNumber == 5){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 12 found, redirecting user to setup39a')
                this.$router.push({ name: 'Setup39a' })
            }
            else if(this.setupStep == 13 && this.hwNumber == 6){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 13 found, redirecting user to setup43a')
                this.$router.push({ name: 'Setup43a' })
            }
            else if(this.setupStep == 14 && this.hwNumber == 7){
                store.commit('setSetupStage', 3)
                store.commit('setDebug', 'setup step 14 found, redirecting user to setup47a')
                this.$router.push({ name: 'Setup47a' })
            }
            else if(this.setupStep == 15 && this.hwNumber == 1){
              store.commit('setSetupStage', 4)
              store.commit('setDebug', 'setup step 15 found, redirecting user to setup50b')
              this.$router.push({ name: 'Setup50b' })
            }
            //redirect user to boot screen if they have HW 2-7 or no HW inserted
            else if(this.hotHW == false){
              store.commit('setDebug', 'Cold Wallet Found, redirecting to the boot screen')
              this.$router.push({ name:'Boot' })
            }
            //eventually check externally for time machine keys here
            //might want to move this somewhere else
            //is this even possible to do without decrypting the tarball first? 
            //TODO address this problem ^
            if(this.timeMachineKeysFound == true){
              store.commit('setTimeLock', false)
            }
            })
              .catch((e) => {
                store.commit('setDebug', `read config error: ${e}`)
            })
        }
      }).catch((e)=>{
          store.commit('setDebug', `error checking for config ${e}`)
          store.commit('setErrorMessage', `Error checking for config. Error code: Welcome11 Response: ${e}`)
          this.$router.push({ name: 'Error' }) 
      })  
      
    },
}
</script>

<style scoped>
.btn3{
  cursor:wait;
}
</style>

