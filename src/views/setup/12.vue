<!-- User will be automatically brought to this screen by a text file present on HW 1 which informs arctica to redirect the user to this page (state variable setup1)-->

<template>
<div v-if="this.loading == true">
  <Loader/>
</div>
<div v-else class="page">
    <header>
        <h1>Please insert the set up CD</h1>
        <h2>Insert the set up CD to continue.</h2>
    </header>   
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted the set up CD.</label>
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
  name: 'Setup12',
  components: {
    Loader,
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.loading = true
            store.commit('setLoadMessage', 'Creating Bitcoin wallet...')
            invoke('generate_store_key_pair', {number: "1"}).then((res)=>{
                store.commit('setDebug', `Generating Wallet: ${res}`)
                //create 4 simulated time machine key pairs
                //eventually this will be where user receives 4 time machine pubkeys from BPS
                invoke('generate_store_simulated_time_machine_key_pair', {number: '1'}).then((res)=>{
                    store.commit('setDebug', `Generating simulated time machine key pair 1: ${res}`)
                    invoke('generate_store_simulated_time_machine_key_pair', {number: '2'}).then((res)=>{
                        store.commit('setDebug', `Generating simulated time machine key pair 2: ${res}`)
                        invoke('generate_store_simulated_time_machine_key_pair', {number: '3'}).then((res)=>{
                            store.commit('setDebug', `Generating simulated time machine key pair 3: ${res}`)
                            invoke('generate_store_simulated_time_machine_key_pair', {number: '4'}).then((res)=>{
                                store.commit('setDebug', `Generating simulated time machine key pair 4: ${res}`)
                                store.commit('setLoadMessage', 'Creating setup CD...')
                                //create & burn setup CD
                                invoke('create_setup_cd').then((res)=>{
                                    store.commit('setDebug', `invoking create setup cd ${res}`)
                                    this.loading = false
                                    this.$router.push({ name:'Setup13' }) 
                                }).catch((e)=>{
                                    if(e.includes("ERROR No CD found in create_setup_cd")){
                                        store.commit('setDebug', `create setup cd error (MAYBE USER DOES NOT HAVE A CD DRIVE?): ${e}`) 
                                        store.commit('setHelperMessage', `It seems that you do not currently have a CD or a DVD drive connected to this computer, 
                                        in order to continue, you will need to obtain a usb tethered CD drive and start over.`)
                                        this.$router.push({ name:'Helper' })
                                    }else{
                                        store.commit('setDebug', `create setup cd error: ${e}`)
                                        store.commit('setErrorMessage', `Error creating setup CD Error code: Setup12-1 Response: ${e}`)
                                        this.$router.push({ name:'Error' })
                                    }
                                })

                            })
                            .catch((e)=>{
                                store.commit('setDebug', `error generating time machine key pair 4 ${e}`)
                                store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-2 Response: ${e}`)
                                this.$router.push({ name:'Error' })
                            })  
                        })
                        .catch((e)=>{
                            store.commit('setDebug', `error generating time machine key pair 3 ${e}`)
                            store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-3 Response: ${e}`)
                            this.$router.push({ name:'Error' })
                        })  
                    })
                    .catch((e)=>{
                        store.commit('setDebug', `error generating time machine key pair 2 ${e}`)
                        store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-4 Response: ${e}`)
                        this.$router.push({ name:'Error' })
                    })  
                })
                })
                .catch((e)=>{
                    store.commit('setDebug', `error generating time machine key pair 1 ${e}`)
                    store.commit('setErrorMessage', `Error creating time machine key Error code: Setup12-5 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                })  
            .catch((e)=>{
                store.commit('setDebug', `error generating wallet ${e}`)
                store.commit('setErrorMessage', `Error generating wallet Error code: Setup12-6 Response: ${e}`)
                this.$router.push({ name:'Error' })
        })             
        },
        warn(){
        },
    },
    data(){
        return{
            checkbox: false,
            loading: false,
        }
    },
    mounted(){
              //start bitcoind with networking disabled
              invoke('start_bitcoind', {reindex: false, networkactive: false, wallets: true})
                store.commit('setDebug', `starting bitcoin daemon with networking disabled`)
    }
}
</script>

