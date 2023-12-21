<!-- this page conditionally renders if the user does not currently have any Arctica HW inserted (in which case they are prompted to install Arctica software)
or directs them to the 'i need help' section which can walk them through restoring an attic HW. 
the second conditional rendering below appears if the user has booted from HW 2-7 and needs to insert a transfer CD or a recovery CD. -->
<template>
<div v-if="this.loading == true">
  <Loader/>
</div>
  <div v-else class="login">
    <header> 
      <h1>Welcome to Arctica</h1>
      <h2>Please insert a transfer CD.</h2>
      <h2>If you do not have a transfer CD, please insert Hardware Wallet 1 and reboot this machine.</h2>
      <h2>If you would like to restore a backup CD, click to proceed.</h2>
      <h4 v-if="this.fullySigned == true">* Please switch to HW 1, your PSBT is fully signed</h4>
      <h4 v-if="this.badCD == true">* Error reading the CD. Please reinsert and try again</h4>
      <h4 v-if="this.noPSBT == true">* No PSBT Found on CD. Please log in to HW 1 to create a PSBT.</h4>
    </header>
    <div class="form_container">
      <form>
              <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted a transfer CD.</label>
              </div>
          </form>
      <div class="btn_container"> 
          <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
          <button v-else class="btn3">Proceed</Button>
          <button @click="help()" class="btn2">I need help</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Boot',
  components: {
    Loader
  },
    methods: {
        acknowledge(){
          //display loading component
          this.loading = true
          //reset error feedback
          this.badCD = false
          this.noPSBT = false
          store.commit('setLoadMessage', 'copying CD to ramdisk')
          //mount the inserted disc and copy the contents to ramdisk
          invoke('copy_cd_to_ramdisk').then((res) =>{
            store.commit('setDebug', `copying cd to ramdisk: ${res}`)
            store.commit('setLoadMessage', 'reading CD...')
            //read the config file of the inserted CD
            invoke('read_cd').then((res) => {
              store.commit('setDebug', `invoking read_cd: ${res}`)
              let resArray = res.split("\n")
              store.commit('setDebug', `response Array: ${resArray}`)
              //check the config values
              for(let i = 0; i < resArray.length; i ++){
                  let it = resArray[i].split("=")
                  store.commit('setDebug', `for loop number: ${i+1}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                  //if config value is set to 'recoverycd', user is attempting to manually decrypt
                  if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'RECOVERYCD'){
                      store.commit('setDebug', `Recovery CD detected`)
                      store.commit('setDebug', 'Sending user to RecoveryAdditional')
                      this.$router.push({ name: 'RecoveryAdditional' })
                      break
                  }
                  else if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'TRANSFERCD'){
                    this.transferCD = true
                    break
                  }
                  //immediate wallet conditions
                  //if the PSBT key is present, and = 1OF2 user is attempting to sign from immediate wallet
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '1OF2'){
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 1OF2`)
                    store.commit('setDebug', 'Sending user to sign2of2')
                    this.$router.push({ name: 'sign2of2' })
                    break
                  }
                  //if the PSBT key is present, and = 2OF2 user is attempting to broadcast a signed immediate transaction
                  //TODO, this condition can NEVER normally happen because the user should be broadcasting from HW 1...however we should still handle this condition with a warning
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '2OF2'){
                    this.fullySigned = true
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 2OF2`)
                    break
                  }//delayed wallet conditions
                  //if the PSBT key is present, and = 5OF5 user is attempting to broadcast a signed delayed transaction
                  //TODO, this condition can NEVER normally happen because the user should be broadcasting from HW 1...however we should still handle this condition with a warning
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '5OF5'){
                    this.fullySigned = true
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 5OF5`)
                    break
                  }
                  //if the PSBT key is present, and = 1OF5 user is attempting to sign from delayed wallet
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '1OF5'){
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 1OF5`)
                    store.commit('setDebug', 'Sending user to sign2of5')
                    this.$router.push({ name: 'sign2of5' })
                    break
                  }
                  //if the PSBT key is present, and = 2OF5 user is attempting to sign from delayed wallet
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '2OF5'){
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 2OF5`)
                    store.commit('setDebug', 'Sending user to sign3of5')
                    this.$router.push({ name: 'sign3of5' })
                    break
                  }
                  //if the PSBT key is present, and = 3OF5 user is attempting to sign from delayed wallet
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '3OF5'){
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 3OF5`)
                    store.commit('setDebug', 'Sending user to sign4of5')
                    this.$router.push({ name: 'sign4of5' })
                    break
                  }
                  //if the PSBT key is present, and = 4OF5 user is attempting to sign from delayed wallet
                  else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '4OF5'){
                    this.loading = false
                    store.commit('setDebug', `Transfer CD detected 4OF5`)
                    store.commit('setDebug', 'Sending user to sign5of5')
                    this.$router.push({ name: 'sign5of5' })
                    break
                  }
                  //if the user is trying to log in with a blank transfer CD (can happen after completing a recovery CD or a failed PSBT export)
                  else if(this.transferCD == true){
                    store.commit('setDebug', `transfer CD found with no PSBT state`)
                    this.loading = false
                    this.noPSBT = true
                  }
                  //if no valid config value is found, either a blank cd is inserted or user potentially hit the button too fast
                  else{
                      this.loading = false
                      store.commit('setDebug', `fall back inside for loop triggered; key: ${String(it[0]).toUpperCase()} value: ${String(it[1]).toUpperCase()}`)
                      store.commit('setDebug', `Blank CD detected, something is wrong.`)
                      store.commit('setErrorMessage', `Error could not find a valid transfer or recovery CD, Error Code: Boot4`)
                      this.$router.push({ name: 'Error' })
                  }
              }
            }).catch((e)=>{
              store.commit('setDebug', `error reading CD Error Code: Boot5 Response: ${e}`)
              //display front end feedback
              this.badCD = true
              this.loading = false
            })
        }).catch((e)=>{ 
          store.commit('setDebug', `error copying cd to ramdisk Error Code: Boot3 Response: ${e}`)
          //display front end feedback
          this.badCD = true
          this.loading = false
        })     
     },
        help(){
          this.$router.push({ name: 'convertInitial' })
        },
        },
  computed:{
    hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
    setupStep(){
      return store.getters.getSetupStep
    },
    numberToRecover(){
      return store.getters.getNumberToRecover
    },
  },
  mounted(){
      //check if config is present (denotes whether user is here for first time setup or a returning user)
      store.commit('setDebug', 'arrived at Boot')
      store.commit('setDebug', `checking for config`)
      //if the new user was set to true in the above read, create ramdisk
      if(this.newUser == false){
        store.commit('setDebug', `config found, user has completed setup, creating ramdisk`)
        //create the ramdisk and display info for returning users
        invoke('create_ramdisk').then((res)=>{
            store.commit('setDebug', `creating ramdisk ${res}`)
          })
        .catch((e)=>{
          store.commit('setDebug', `error creating ramdisk ${e}`)
          store.commit('setErrorMessage', `Error creating ramdisk. Error code: Boot6 Response: ${e}`)
          this.$router.push({ name: 'Error' }) 
        })  
      }
      store.commit('setDebug', `returning user found, terminating evaluation`)
    },
  data() {
    return {
    loading: false,
    checkbox: false,
    fullySigned: false,
    badCD: false,
    transferCD: false,
    noPSBT: false,
    }
  },
}
</script>
