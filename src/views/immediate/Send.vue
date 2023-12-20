<template>
  <div v-if="this.loading == true">
  <Loader/>
  </div>
<div v-else class="page">
    <NavImmediate/>
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
                <h3>₿ {{ immediateBalance }}</h3>
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
            <h4 v-if="this.badCD == true">*Error reading transfer CD. Please try again.</h4>
            <button @click="broadcast()" class="btn2">Broadcast</button>
            <button @click="continueFn(address, balance, fee)" class="btn">Continue</Button>
        </div>
    </div>        
</div>
</template>


<script>
import NavImmediate from '@/components/NavImmediate'
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'immediateSend',
  components: {
    NavImmediate,
    Loader,
  },  
    methods: {
        continueFn(address, balance, fee){
            this.feeEstimate = true
            this.insufficientFunds = false
            this.badAddress = false
            invoke('generate_psbt', {walletname:"immediate", hwnumber: this.hwNumber.toString(), recipient: address, amount: Number(balance), fee: Number(fee)}).then((res) => {
                store.commit('setDebug', `Generating PSBT: ${res}`)
                this.$router.push({name: 'sign1of2'})
            })
            .catch((e) => {
                store.commit('setDebug', `Error generating PSBT: ${e}`)
                if(e.includes("Fee estimation failed.")){
                    this.feeEstimate = false
                }else if(e.includes("Insufficient funds")){
                    this.insufficientFunds = true
                }else if(e.includes("Invalid Bitcoin address")){
                    this.badAddress = true
                }else{
                    store.commit('setErrorMessage', `Error generating PSBT. Error code: ImmediateSend1 Response: ${e}`)
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
            store.commit('setErrorMessage', `Error scanning QR code ImmediateSend3 Response: ${e}`)
            this.badQR = true
          })
        },
        //addRecipient button currently disabled 
        addRecipient(){
            this.multiOutput = true
        },
        selectMax(){
            this.balance = this.immediateBalance
        },
        broadcast(){
            this.badCD = false
            this.loading = true
            //remove stale psbt
            store.commit('setLoadMessage', 'Reading Transfer CD...')
            invoke('clear_psbt').then((res)=>{
                store.commit('setDebug', `clearing psbt: ${res}`)
                //copy CD contents to ram
                invoke('copy_cd_to_ramdisk').then((res) => {
                    store.commit('setDebug', `copying CD to ramdisk: ${res}`)
                    //send user to broadcast path
                    this.loading = false
                    this.$router.push({ name: 'immediateBroadcast' })
                }).catch((e)=>{
                    store.commit('setDebug', `error copying CD to ramdisk: ${e}`)
                    //enable front end feedback
                    this.badCD = true
                    this.loading = false
                })
            }).catch((e)=>{
                    store.commit('setDebug', `error clearing psbt: ${e}`)
            })
        }
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
         badQR: false,
         badCD: false,
         loading: false,
     }
 },
 computed:{
    immediateBalance:{
        get(){
                return store.getters.getImmediateBalance
            }
    },
    hwNumber(){
        return store.getters.getCurrentHW
      },
 },
 mounted(){
    this.immediateBalance = store.getters.getImmediateBalance
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