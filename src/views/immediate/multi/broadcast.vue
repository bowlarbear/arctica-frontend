<template>
<div v-if="this.loading == true">
  <Loader/>
  </div>
<div v-else class="page">
    <div class="display_block">
        <h1>Ready to send?</h1>
        <img src="@/assets/checkmark_green.png">
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
            <button @click="broadcast()" class="btn">Send</button>
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
    name: 'immediateBroadcast',
    components: {
    Loader,
    },
    methods: {
        broadcast(){
            this.loading = true
            store.commit('setLoadMessage', 'Broadcasting transaction...')
            invoke('broadcast_tx', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                    store.commit('setDebug', `Broadcasting Fully Signed TX: ${res}`)
                    this.loading = false
                    this.$router.push({ name: 'immediateConfirmation' })
                }).catch((e)=>{
                    store.commit('setDebug', `error finalizing psbt ${e}`)
                    store.commit('setErrorMessage', `Error finalizing psbt Error Code: immediateBroadcast-1 Response: ${e}`)
                    this.$router.push({ name:'Error' })
                })
            
        },
        discard(){
            //TODO need to clear /mnt/ramdisk/CDROM/psbt at this point...should probably have a popup confirmation before doing this...
            this.$router.push({ name: 'dashboard' })
        },
    },
    computed:{
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
    },
    mounted(){
                store.commit('setLoadMessage', `decoding PSBT...`)
                invoke('decode_processed_psbt', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                         //expected path, return the tx info and display on front end
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
                        if(e.includes("PSBT not complete")){
                            store.commit('setDebug', `error PSBT not fully signed`)
                            store.commit('setErrorMessage', `Error PSBT not fully signed Error Code: immediateBroadcast-2 Response: None`)
                            this.$router.push({ name:'Error' })
                        }else{
                            store.commit('setDebug', `error decoding PSBTs: ${e}`)
                        }
                    })
    },
    data(){
        return{
            loading: true,
            address: null,
            amount: null,
            fee: null,
        }
    },
}
</script>
