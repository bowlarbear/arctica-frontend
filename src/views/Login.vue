<template>
<div v-if="this.loading == true">
  <Loader/>
</div>
<div v-else class="page">
        <header>
            <h1>Log in</h1>
            <!-- <h2>Please enter your password below.</h2> -->
            <h2>Beta testers must use the Setup CD to Login! (Note: you can also create a recovery CD if you have lost the setup CD, click "i forgot my password" to get started)</h2>
            <h4 v-if="this.badCD == true">* Error reading CD. Please reinsert and try again.</h4>
        </header>
            <div class="form_container">
                <form>
                    <label>Enter Password (Disabled)</label>
                   <br><input v-model="password1" type="password" required placeholder="Your secret password" disabled="disabled">

                    <br><label>Confirm Password (Disabled)</label>
                   <br><input v-model="password2" type="password" required placeholder="Your secret password" disabled="disabled">

                <div class="checkbox_container">
                    <input type="checkbox" v-model="checkbox" name="checkbox">
                    <label for="checkbox">I have inserted a CD for login.</label>
                </div>
                </form>

                <div class="btn_container"> 
                    <button v-if="(password1 == password2 && password1 != '' && password2 != '' ) || checkbox == true " @click="login()" class="btn">Continue</Button>
                    <button v-else @click="warn()" class="btn3">Continue</Button>
                    <button @click="passwordRecovery()" class="btn2">I Forgot my Password</button>
                </div>
            </div>
            
</div>  
</template>

<script>
import store from '../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Login',
  components: {
    Loader
  },
    methods: {
        login(){
            if(this.checkbox == true){
                this.badCD = false
                this.loading = true
                store.commit('setLoadMessage', 'Reading CD...')
                store.commit('setDebug', 'checking inserted CD for masterkey')
                invoke('copy_cd_to_ramdisk').then((res) => {
                    store.commit('setDebug', `copying CD to ramdisk: ${res}`)
                    store.commit('setLoadMessage', 'checking for masterkey...')
                    invoke('check_for_masterkey').then((res) => {
                        if(res == true){
                        store.commit('setDebug', 'Masterkey Found in Ramdisk')
                        invoke('unpack').then((res) => {
                            store.commit('setDebug', `successfully unpacked: ${res}`)
                            store.commit('setLoadMessage', 'Loading Immediate wallet...')
                            console.log('immediate_wallet', this.hwNumber)
                            invoke('load_wallet', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res) =>{
                                store.commit('setDebug', `Loaded Immediate Wallet: ${res}`)
                                store.commit('setLoadMessage', 'Loading delayed wallet...')
                                invoke('load_wallet', {walletname: "delayed", hwnumber: this.hwNumber.toString()}).then((res) =>{
                                    store.commit('setDebug', `Loaded Delayed Wallet: ${res}`)
                                    store.commit('setLoadMessage', 'Packing up sensitive info...')
                                    invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) => {
                                        store.commit('setDebug', `successfully packed up: ${res}`)
                                        store.commit('setDebug', 'Login succesful, checking CD for psbt')
                                        store.commit('setLoadMessage', 'checking for PSBT...')
                                        invoke('read_cd').then((res) => {
                                            store.commit('setDebug', `invoking read_cd: ${res}`)
                                            let resArray = res.split("\n")
                                            store.commit('setDebug', `response Array: ${resArray}`)
                                            //check the config values
                                            for(let i = 0; i < resArray.length; i ++){
                                                let it = resArray[i].split("=")
                                                store.commit('setDebug', `for loop number: ${i+1}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                                                //if config value is set to 2of2, user has completed signing and is ready to broadcast
                                                if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '2OF2'){
                                                this.loading = false
                                                store.commit('setDebug', `Transfer CD detected: 2OF2, sending user to immediate broadcast screen`)
                                                this.$router.push({ name: 'immediateBroadcast' })
                                                break
                                                }
                                                //else if config value is set to 5of5, user has completed signing and is ready to broadcast
                                                else if(String(it[0]).toUpperCase() == 'PSBT' && String(it[1]).toUpperCase() == '5OF5'){
                                                this.loading = false
                                                store.commit('setDebug', `Transfer CD detected: 5OF5, sending user to delayed broadcast screen`)
                                                //calculate delayed_decay1
                                                invoke('calculate_decay_time', {file: "delayed_decay1"}).then((res)=>{
                                                    //in the event that the wallet is no longer time locked...
                                                    console.log("delayed decay response:", res)
                                                    if(res.includes("decay complete")){
                                                        //send the user to the broadcast page
                                                        this.$router.push({ name: 'delayedBroadcast' })
                                                    }else{
                                                        //otherwise, in the event the wallet IS still timelocked, send the user to the time machine
                                                        this.$router.push({ name: 'TimeMachine1' })
                                                    }
                                                }).catch((e)=>{
                                                    store.commit('setDebug', `error calculating decay time: ${e}`)
                                                    store.commit('setErrorMessage', `Error calculating decay time: Login10 Response: ${e}`)
                                                    this.$router.push({ name: 'Error' })  
                                                })
                                                break
                                                }
                                                //if no valid config value is found assume user is not here to broadcast a signed tx
                                                else{
                                                    this.loading = false
                                                    store.commit('setDebug', `fall back inside for loop triggered; key: ${String(it[0]).toUpperCase()} value: ${String(it[1]).toUpperCase()}`)
                                                    store.commit('setDebug', `User is not ready to broadcast. Sending to dashboard.`)
                                                    this.$router.push({ name: 'dashboard' })
                                                }
                                            }
                                        }).catch((e)=>{
                                            store.commit('setDebug', `error reading CD Error Code Login9 Response: ${e}`)
                                            this.badCD = true
                                            this.loading = false 
                                        })
                                    }).catch((e)=>{
                                        store.commit('setDebug', `error packing up sensitive: ${e}`)
                                        store.commit('setErrorMessage', `Error Packing up Sensitive Error Code: Login8 Response: ${e}`)
                                        this.$router.push({ name: 'Error' })  
                                    })
                                })
                                .catch((e)=>{
                                    store.commit('setDebug', `error loading delayed wallet: ${e}`)
                                    store.commit('setErrorMessage', `Error Loading delayed Wallet Error Code: Login7 Response: ${e}`)
                                    this.$router.push({ name: 'Error' }) 
                                })

                            })
                            .catch((e)=>{
                                store.commit('setDebug', `error loading immediate wallet: ${e}`)
                                store.commit('setErrorMessage', `Error Loading immediate Wallet Error Code: Login6 Response: ${e}`)
                                this.$router.push({ name: 'Error' }) 
                            })        
                        })
                        .catch((e) => {
                        store.commit('setDebug', `error unpacking: ${e}`)
                        store.commit('setErrorMessage', `Error unpacking sensitive Error code: Login2 Response: ${e}`)
                        this.$router.push({ name: 'Error' }) 
                        })
                        }
                        else{
                            //eventually need to add front end feedback here prompting the user on what to do next rather than send to fatal error screen
                            store.commit('setDebug', 'no masterkey was found on the CD')
                            store.commit('setErrorMessage', `Error no masterkey found on CD Error code: Login5 No Response Message`)
                            this.$router.push({ name: 'Error' }) 
                        }
                    })
                        .catch((e) => {
                        store.commit('setDebug', `error checking for masterkey ${e}`)
                        store.commit('setErrorMessage', `Error Checking for masterkey Error code: Login3 Response: ${e}`)
                        this.$router.push({ name: 'Error' }) 
                    })
                })
                .catch((e) => {
                    //eventually need to add front end feedback here prompting the user on what to do next rather than send to fatal error screen
                    store.commit('setDebug', `error copying CD to ramdisk Error code: Login4 Response: ${e}`)
                    this.badCD = true
                    this.loading = false
                })
            }
            //use this condition for when user has a bricked bps relationship but has not indicated they already have a transfer CD with a masterkey 
            else if(this.bpsBricked == true){
                store.commit('setDebug', 'Sending user to BPS_Bricked')
                this.$router.push({ name: 'BPS_Bricked' })
            }
            //use this condition for when user is logging in normally with password & BPS
            else{
                store.commit('setDebug', 'error, cannot login with password, not yet implemented, try setupCD, recoveryCD, or transferCD')
            }
        },
        passwordRecovery(){
            store.commit('setDebug', 'Sending user to Recovery')
            this.$router.push({ name: 'Recovery' })
        },
        warn(){
        },
    },
 computed: {
    hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
 },
 data(){
     return{
         password1: '',
         password2: '',
         bpsBricked: null,
         checkbox: false,
         loading: false,
         badCD: false,
     }
 },
 mounted(){
    this.bpsBricked = store.getters.getBPSBricked
    if(this.bpsBricked == true){
        store.commit('setDebug', 'Sending user to BPS_Bricked')
        this.$router.push({ name: 'BPS_Bricked' })
    }
 }
}
</script>


