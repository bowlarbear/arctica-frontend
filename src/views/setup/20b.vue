<template>
    <div v-if="this.loading ==true">
    <Loader />
    </div>
    <div v-else class="page">
        <header>
        <h1>Key Generation for Wallet 7 complete</h1>
        <h2 v-if="badCD == false">Please return to your primary machine, power it  off, insert Hardware Wallet 1 and power on the machine.</h2>
        <h2 v-if="badCD == false">You may close this window.</h2>
        <h2 v-if="badCD == true">There was an error refreshing your setup CD. Please reinsert it and try again.</h2>
    </header> 

    <div class="btn_container"> 
    <button v-if="badCD == true" class="btn" @click="tryAgain()">Try again</button>
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
    name: 'Setup20b',
    components: {
    Loader,
    ProgressBar
    },
    computed:{
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
},
methods: {
      tryAgain(){
        this.loading = true
        this.badCD = false
        //refresh setup CD with latest .iso 
        invoke('refresh_cd', {psbt: false}).then((res)=>{
            store.commit('setDebug', `refreshing setup CD: ${res}`)
            store.commit('setLoadMessage', 'Packing up sensitive info...')
            invoke('stop_bitcoind').then((res)=>{
                store.commit('setDebug', `stopping bitcoin daemon: ${res}`)
                store.commit('setLoadMessage', 'Updating application state...')
                //update setupstep state on Hardware Wallet
                invoke('async_write', {name: 'setupStep', value: this.setupStep}).then((res) => {
                    store.commit('setDebug', `config set to new values setupStep: ${this.setupStep} res:${res}`)
                    invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) =>{
                    store.commit('setDebug', `packing up sensitive... ${res}`)
                    this.loading = false
                    }).catch((e)=>{
                        store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
                        store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Setup20b-9 Response: ${e}`)
                        this.$router.push({ name:'Error' })
                })
                }).catch((e) => {
                    store.commit('setDebug', `async write error: ${e}`)
                    store.commit('setErrorMessage', `Error with async write Error code: Setup20b-10 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                })
            }).catch((e) => {
                    store.commit('setDebug', `packup error: ${e}`)
                    store.commit('setErrorMessage', `Error packing up Error code: Setup20b-11 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                })
        }).catch((e)=>{
            store.commit('setDebug', `refresh setup CD error Error code: Setup20b-12 Response: ${e}`)
            this.loading = false
            this.badCD = true
        })
        
      }
    },
    mounted(){
    this.loading = true
    store.commit('setLoadMessage', 'Copying the setup CD...')
    //copy everything from the setup CD to ramdisk
    invoke('copy_cd_to_ramdisk').then((res) => {
        store.commit('setDebug', `reading setup CD ${res}`)
        store.commit('setLoadMessage', 'Creating Bitcoin Wallet...')
        //create xpriv and xpub
        invoke('generate_store_key_pair', {number: this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `Generating Wallet: ${res}`)
                store.commit('setLoadMessage', 'Distributing privacy keys...')
                //distribute 1 shard onto HW 7 from setupCD dir
                invoke('distribute_shards_hw7').then((res)=>{
                        store.commit('setDebug', `distributing 1 shard to Hardware Wallet ${res}`)
                        store.commit('setLoadMessage', 'Installing dependencies...')
                        //install wodim & ssss
                        invoke('install_hw_deps').then((res) => {
                                store.commit('setDebug', `installing HW dependencies ${res}`)
                                store.commit('setLoadMessage', 'Refreshing setup CD...')
                                    //refresh setup CD with latest .iso 
                                    invoke('refresh_cd', {psbt: false}).then((res)=>{
                                        store.commit('setDebug', `refreshing setup CD: ${res}`)
                                        store.commit('setLoadMessage', 'Packing up sensitive info...')
                                        invoke('stop_bitcoind').then((res)=>{
                                            store.commit('setDebug', `stopping bitcoin daemon: ${res}`)
                                            store.commit('setLoadMessage', 'Updating application state...')
                                            //update setupstep state on Hardware Wallet
                                            invoke('async_write', {name: 'setupStep', value: this.setupStep}).then((res) => {
                                                store.commit('setDebug', `config set to new values setupStep: ${this.setupStep} res:${res}`)
                                                invoke('packup', {hwnumber: this.hwNumber.toString()}).then((res) =>{
                                                store.commit('setDebug', `packing up sensitive... ${res}`)
                                                this.loading = false
                                                }).catch((e)=>{
                                                    store.commit('setDebug', `error stopping bitcoin daemon: ${e}`)
                                                    store.commit('setErrorMessage', `Error with stopping bitcoin daemon Error Code: Setup20b-8 Response: ${e}`)
                                                    this.$router.push({ name:'Error' })
                                            })
                                            }).catch((e) => {
                                                store.commit('setDebug', `async write error: ${e}`)
                                                store.commit('setErrorMessage', `Error with async write Error code: Setup20b-1 Response: ${e}`)
                                                this.$router.push({ name:'Error' })
                                            })
                                        }).catch((e) => {
                                                store.commit('setDebug', `packup error: ${e}`)
                                                store.commit('setErrorMessage', `Error packing up Error code: Setup20b-2 Response: ${e}`)
                                                this.$router.push({ name:'Error' })
                                            })
                                    }).catch((e)=>{
                                        store.commit('setDebug', `refresh setup CD error Error code: Setup20b-3 Response: ${e}`)
                                        this.loading = false
                                        this.badCD = true
                                        })
                            }).catch((e) => {
                                store.commit('setDebug', `install HW deps error: ${e}`)
                                store.commit('setErrorMessage', `Error installing HW dependencies Error code: Setup20b-4 Response: ${e}`)
                                this.$router.push({ name:'Error' })
                            })
                }).catch((e)=>{
                    store.commit('setDebug', `distributing 2 shards error: ${e}`)
                    store.commit('setErrorMessage', `Error distributing 2 shards Error code: Setup20b-5 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                })
        }).catch((e)=>{
            store.commit('setDebug', `create wallet error ${e}`)
            store.commit('setErrorMessage', `Error creating wallet Error code: Setup20b-6 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
    }).catch((e) => {
        store.commit('setDebug', `error reading setup CD: ${e}`)
        store.commit('setErrorMessage', `Error reading setup CD Error code: Setup20b-7 Response: ${e}`)
        this.$router.push({ name:'Error' })
    })
    },
    data(){
        return{
            setupStep: '14',
            loading: false,
            badCD: false,
        }
    },

}
</script>

