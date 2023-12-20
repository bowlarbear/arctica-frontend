<template>
    <DelayWarning v-if="warning" v-on:ackWarning="ackWarning"/>
    <div v-else class="page">
        <NavDelayed/>
        <div class="outer_container">
            <div class="send_head_container">
             <h1>Send Bitcoin</h1>
             </div>
        <div class="send_container">
            <div class="send_form">
                <!-- <label>Description (disabled)</label>
                <br><input v-model="description" type="text" placeholder="What is this transaction for?" disabled="disabled"> -->
    
                <br><h4 v-if="badAddress == true">*Invalid Bitcoin Address</h4>
                <br><label class="address-label">Address <img class="img-hover" @click="scanQR()" src="@/assets/qrupload.png"></label>
                <br><h4 v-if="badQR == true">*Problem scanning QR code. Please try again.</h4>
                <br><input v-model="address" type="text" required placeholder="Enter Address"> 
    
                <br><label>Amount</label>
                <br><input v-model="balance" type="float" required placeholder="₿ 0.00">
                <!-- Need to implement a 2 way bind here and reference it against an exchange API so we can dynamically calucate the BTC or Fiat amount against whatever the user inputs -->
                <br><h4 v-if="insufficientFunds == true">*Insufficient Balance</h4>
                <div class="balance_calculator">
                    <div class="balance_left">
                    <h2>Your Balance</h2>
                    <h3>₿ {{ delayedBalance }}</h3>
                    </div>
                    <div class="balance_right">
                        <button @click="selectMax()" class="btn4">Select Max</button>
                    </div>
                </div>
                <br><h4 v-if="feeEstimate == false">*Fee Estimates not yet calculated. Please wait or use a custom fee.</h4>
                <br><label>Fee</label>
                <br><input v-if="custom == false" v-model="fee" type="integer" placeholder="Sats per Byte">
                <div class="checkbox_container">
                        <input type="checkbox" v-model="custom" name="checkbox" checked>
                        <label for="checkbox">Use a recomended fee</label>
                    </div>
    
    
            </div>
        </div>
            <div class="send_button_container">
                <button @click="addRecipient()" class="btn2">Add another recipient (disabled)</button>
                <button @click="continueFn(address, balance, fee)" class="btn">Continue</Button>
            </div>
        </div>        
    </div>
    </template>


<script>
import NavDelayed from '@/components/NavDelayed'
import DelayWarning from './DelayWarning'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: 'delayedSend',
  components: {
    NavDelayed,
    DelayWarning
  },
    methods: {
        continueFn(address, balance, fee){
                this.feeEstimate = true
                this.insufficientFunds = false
                this.badAddress = false
                invoke('generate_psbt', {walletname:"delayed", hwnumber: this.hwNumber.toString(), recipient: address, amount: Number(balance), fee: Number(fee)}).then((res) => {
                    store.commit('setDebug', `Generating PSBT: ${res}`)
                    this.$router.push({name: 'sign1of5'})
                })
                .catch((e) => {
                    //eventually need to add front end feedback here rather than send to fatal error screen
                    store.commit('setDebug', `Error generating PSBT: ${e}`)
                    if(e.includes("Fee estimation failed.")){
                        this.feeEstimate = false
                    }else if(e.includes("Insufficient funds")){
                        this.insufficientFunds = true
                    }else if(e.includes("Invalid Bitcoin address")){
                        this.badAddress = true
                    }else{
                        store.commit('setErrorMessage', `Error generating PSBT. Error code: DelayedSend1 Response: ${e}`)
                        this.$router.push({ name: 'Error' })
                    }
    
                })
    
            },
            scanQR(){
          invoke('enable_webcam_qr_scan').then((res)=>{
            this.badQR = false
            store.commit('setDebug', `scanning with webcam: ${res}`)
            this.address = res
          }).catch((e)=>{
            store.commit('setDebug', `error scanning QR code ${e}`)
            store.commit('setErrorMessage', `Error scanning QR code DelayedSend2 Response: ${e}`)
            this.badQR = true
          })
        },
            addRecipient(){
                this.multiOutput = true
            },
            selectMax(){
                this.balance = this.delayedBalance
            },
            ackWarning(){
            this.warning = false
            },
    },
   data(){
     return{
        id: null,
        datetime: null,
        description: '',
        fiat_currency: 'NaN', //this eventually needs to utilize a live exchange API or a global user provided exchange price
        address: '',
        balance: null,
        fee: 0,
        custom: true,
        multiOutput: false,
        checkbox: true,
        feeEstimate: true,
        insufficientFunds: false,
        badAddress: false,
        warning: null,
        badQR: false,
}
    //  Need a function to deliver dynamic fee estimates for the above data
 },
 computed:{
    delayedBalance(){
        return store.getters.getDelayedBalance
    },
    hwNumber(){
        return store.getters.getCurrentHW
      },

 },
 mounted(){
    this.timeLock = store.getters.getTimeLock
    if(this.timeLock == true){
        this.warning = true
    }else{this.warning = false}
    //get a new internal id for the bitcoin tx about to be created
    this.id = store.getters.getDelayedTransactions.length + 1
    //
    this.delayedBalance = store.getters.getDelayedBalance
 }
 }

</script>

<style scoped>
.img-hover{
    cursor: pointer;
    margin-left: 10px;
}

.address-label{
    display:flex;
    align-items:center;
}
h2{
    font-size:15px;
    line-height: 18px;
}
  </style>