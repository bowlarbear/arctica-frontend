<template>
    <div v-if="this.loading == true">
      <Loader/>
      </div>
    <div v-else class="page">
        <div class="display_block">
            <h1>Approve Transaction for Signing (5 of 5)</h1>
            <img src="@/assets/checkmark_grey.png">
            <div class="tx_block">
                <h2>To</h2>
                <h3>{{ this.address }}</h3>
            </div>
    
            <div class="tx_block">
                <h2>Amount</h2>
                <h3>₿ {{ this.amount }}</h3>
            </div>
    
            <div class="tx_block">
                <h2>Fee</h2>
                <h3>₿ {{ this.fee }}</h3>
            </div>
    
            <div class="horizontal_btn_container">
                <button @click="sign()" class="btn"><img src="@/assets/checkmark_button.png">Approve</button>
            </div>
            
    
        </div>
    </div>
    </template>


<script>
import store from '../../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
    name: 'sign5of5',
    components: {
    Loader,
    },
    methods: {
        sign(){
            store.commit('setLoadMessage', 'Signing PSBT...')
            this.loading = true
            invoke('sign_processed_psbt', {walletname: "delayed", hwnumber: this.hwNumber.toString(), progress: "5of5"}).then((res) => {
                store.commit('setDebug', `Signing PSBT: ${res}`)
                store.commit('setLoadMessage', 'Refreshing Transfer CD...')
                invoke('export_psbt', {progress: "5of5"}).then((res) => {
                    store.commit('setDebug', `Exporting PSBT: ${res}`)
                    invoke('refresh_cd', {psbt: true}).then((res)=>{
                        store.commit('setDebug', `refreshing CD: ${res}`)
                        this.loading=false
                        this.$router.push({name: '5of5success'})
                    }).catch((e)=>{
                        store.commit('setDebug', `error refreshing CD ${e}`)
                        this.badExport = true
                        this.loading = false
                    })
                }).catch((e)=>{
                    store.commit('setDebug', `error exporting PSBT: ${e}`)
                    store.commit('setErrorMessage', `Error exporting PSBT Error Code: sign5of5-4 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                })
            }).catch((e)=>{
                store.commit('setDebug', `error signing PSBT: ${e}`)
                store.commit('setErrorMessage', `Error Signing PSBT Error Code: sign5of5-3 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })   
        },
    },
    data(){
        return{
            loading: true,
            address: null,
            amount: null,
            fee: null,
            feeString: null,
            amountString: null,
        }
    },
    computed:{
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
        delayedDecay(){
            return store.getters.getDelayedDecay
        },
    },
    mounted(){
    //unpack
    store.commit('setLoadMessage', 'Unpacking sensitive info...')
        invoke('unpack').then((res) => {
            store.commit('setDebug', `unpacked sensitive info ${res}`)
            //start bitcoind with networking disabled
            invoke('start_bitcoind', {reindex: false, networkactive: false, wallets: true})
                store.commit('setDebug', `starting bitcoin daemon with networking disabled`)
                store.commit('setLoadMessage', `Loading delayed wallet...`)
                //load immediate wallet
                invoke('load_wallet', {walletname: "delayed", hwnumber: this.hwNumber.toString()}).then((res)=>{
                    store.commit('setDebug', `loading delayed wallet: ${res}`)
                    store.commit('setLoadMessage', 'Decoding PSBT...')
                    invoke('decode_processed_psbt', {walletname: "delayed", hwnumber: this.hwNumber.toString()}).then((res)=>{
                        console.log('decoding raw tx')
                        store.commit('setDebug', `decoded psbt: ${res}`)
                        const parts = res.split(",")
                        this.address = parts[0].split("=")[1].trim()
                        this.amountString = parts[1].split("=")[1].trim()
                        this.amount = parseFloat(this.amountString)/100000000 //convert from sats to BTC
                        this.feeString = parts[2].split("=")[1].trim()
                        this.fee = parseFloat(this.feeString)
                        console.log("response:", res)
                        this.loading = false
                }).catch((e) => {
                        store.commit('setDebug', `error decoding PSBTs: ${e}`)
                })
            }).catch((e)=>{
                store.commit('setDebug', `error loading delayed wallet ${e}`)
                store.commit('setErrorMessage', `Error Loading Delayed Wallet Error Code: sign5of5-2 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
        })     
        .catch((e) => {
            store.commit('setDebug', `error unpacking sensitive: ${e}`)
            store.commit('setErrorMessage', `Error unpacking sensitive Error code: sign5of5-1 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
 }
}
</script>


<style scoped>
.btn{
    display:flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}
</style>