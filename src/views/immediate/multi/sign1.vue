<template>
    <div v-if="this.loading == true">
      <Loader/>
      </div>
    <div v-else class="page">
        <div class="display_block">
            <h1>Approve Transaction for Signing (1 of 2)</h1>
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
                <button @click="discard()" class="btn2">Discard</button>
            </div>
            
    
        </div>
    </div>
    </template>


<script>
import store from '../../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
    name: 'sign1of2',
    components: {
    Loader,
    },
    methods: {
        sign(){
            store.commit('setLoadMessage', 'Signing PSBT...')
            this.loading = true
            invoke('sign_funded_psbt', {walletname: "immediate", hwnumber: this.hwNumber.toString(), progress: "1of2"}).then((res) => {
                store.commit('setDebug', `Signing PSBT: ${res}`)
                store.commit('setLoadMessage', 'Signing PSBT...')
                if(this.immediateDecay == false){
                    this.$router.push({ name: 'immediateTransfer' })
                }else{
                    this.$router.push({ name: 'immediateBroadcast' })
                }
                
            }).catch((e)=>{
                store.commit('setDebug', `error signing PSBT: ${e}`)
                store.commit('setErrorMessage', `Error Signing PSBT Error Code: sign1of2-1 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })   
        },
        discard(){
            this.$router.push({ name: 'immediateSend' })
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
        immediateDecay(){
            return store.getters.getImmediateDecay
        },
    },
    mounted(){
        store.commit('setLoadMessage', 'Decoding PSBT...')
        //this obtains the fee
        invoke('decode_funded_psbt', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
            console.log('decoding funded psbt')
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
                store.commit('setDebug', `error decoding funded PSBT: ${e}`)
                store.commit('setErrorMessage', `Error Decoding PSBT Error Code: sign1of2-2 Response: ${e}`)
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
h3{
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-width: 100%;
}
</style>