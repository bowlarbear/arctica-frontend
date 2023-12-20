<template>
    <div v-if="this.loading == true">
  <Loader/>
</div>
<div v-else class="page">
    <header>
        <h1>Congratulations. You have successfully completed set up.</h1>
        <h2>Please ensure this computer is properly connected to the internet.</h2>
        <h2>We must wait for Bitcoin Core to finish it's initial sync.</h2>
        <h2>This computer should remain on and unlocked until the time chain has finished it's sync.</h2> 
        <h2>This can take anywhere from a few hours to a few weeks depending on your internet connection.</h2>
        <h4 v-if="this.noNetwork == true">*Please verify that you are connected to the internet</h4>
    </header>
        <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have connected to the internet.</label>
            </div>
        </form>
            <div class="btn_container"> 
                <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
                <button v-else @click="warn()" class="btn3">Proceed</Button>
            </div>
        </div> 
</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke
import Loader from '@/components/loader'


export default {
  name: 'Setup50b',
  components: {
    Loader,
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.loading = true
            this.noNetwork = false
                    //update HW setupstep to 0
        invoke('async_write', {name: 'setupStep', value: this.setupStep}).then(() => {
            store.commit('setDebug', `updating setupStep to ${this.setupStep}`)
            })
            .catch((e) => {
                store.commit('setDebug', `async write error: ${e}`)
                store.commit('setErrorMessage', `Error with async write Error code: Setup50b-1 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
        store.commit('setLoadMessage', 'Mounting internal drive...')
        invoke('mount_internal').then((res) => {
            store.commit('setDebug', `Mounted internal drive ${res}`)
            store.commit('setLoadMessage', 'Syncing Bitcoin Blockchain...Make sure you are connected to the internet...')
            //start the bitcoin daemon
            invoke('start_bitcoind', {reindex: false, networkactive: true, wallets: true}).then((res) => {
                store.commit('setDebug', `Started the Bitcoin daemon ${res}`)
                this.$router.push({ name: "Setup51" })
                })
                .catch((e) => {
                    if(e.includes("ERROR network is not active")){
                        this.noNetwork = true
                        this.loading = false
                    }else{
                        store.commit('setDebug', `error starting the bitcoin daemon: ${e}`)
                        store.commit('setErrorMessage', `Error starting Bitcoin Daemon Error code: Setup50b-2 Response: ${e}`)
                        this.$router.push({ name:'Error' })
                    }
                })
        })
        .catch((e) => {
            store.commit('setDebug', `error mounting internal drive: ${e}`)
            store.commit('setErrorMessage', `Error mounting internal Error code: Setup50b-3 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
        },
        warn(){
        }
    },
    computed:{
        btcCoreHealthy(){
            return store.getters.getBTCCoreHealthy
        },
    },
    data(){
        return{
            loading: false,
            setupStep: '0',
            checkbox: false,
            noNetwork: false,
        }
    },
    mounted(){
        //enable networking so that the user may connect to a network
        invoke('enable_networking').then((res) => {
        store.commit('setDebug', `Enabling Networking: ${res}`)
        })
        .catch((e) => {
            store.commit('setDebug', `error enabling networking: ${e}`)
            store.commit('setErrorMessage', `Error enabling networking Error code: Setup50b-4 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    },
}
</script>
