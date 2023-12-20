<template>
<DelayWarning v-if="warning" v-on:ackWarning="ackWarning"/>
<div v-else class="page">
    <NavDelayed/>
    <div class="outer_container">
      <div class="receive_head_container">
        <h1>Receive Bitcoin</h1>
             </div>
            <div class="receive_container">
                <div class="receive_top">
                    <h2 class="receive_address">{{ address }}</h2>
                </div>
                <div class="receive_bottom">
                    <div @click="copy()" id="copy">
                        <img src="@/assets/Copy.png">
                        <h2 class="copy_text">Copy Address</h2>
                    </div>
                    <div @click="displayQR()" id="download">
                        <img src="@/assets/Arrow_down.png">
                        <h2 class="download_text">Display QR Code</h2>
                    </div>
                </div>
            </div>
            <button @click="newAddress()" class="btn">New Address</Button>
        </div>        
    </div>
    </template>

<script>
import NavDelayed from '@/components/NavDelayed'
import DelayWarning from './DelayWarning'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: 'delayedReceive',
  components: {
    NavDelayed,
    DelayWarning
  },
  methods:{
            copy(){
            invoke('copy_to_clipboard', {address: this.address}).then((res)=>{
              store.commit('setDebug', `copying to clipboard: ${res}`)
              alert('Copied Address!')
            })
            .catch((e)=>{
                store.commit('setDebug', `error copying address to clipboard ${e}`)
                store.commit('setErrorMessage', `Error copying address to clipboard Error code: DelayedReceive4 Response: ${e}`)
                this.$router.push({ name: 'Error' })
              })
            },
            newAddress(){            
                invoke('get_address', {walletname: this.wallet, hwnumber:this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `getting new address for delayed wallet: ${res}`)
                this.address = res
            })
              .catch((e)=>{
                store.commit('setDebug', `error getting new delayed wallet address ${e}`)
                store.commit('setErrorMessage', `Error getting new wallet address Error code: DelayedReceive1 Response: ${e}`)
                this.$router.push({ name: 'Error' })
              })
            },
            displayQR(){
              invoke('display_qr').then((res)=>{
                store.commit('setDebug', `displaying QR code: ${res}`)
              }).catch((e)=>{
                store.commit('setDebug', `error getting new delayed wallet address ${e}`)
                store.commit('setErrorMessage', `Error displaying QR code Error code: DelayedReceive2 Response: ${e}`)
                this.$router.push({ name: 'Error' })
              })
            },
            ackWarning(){
        this.warning = false
      },
    
      },
      data(){
          return{
              address: null,
              wallet: "delayed",
              warning: null
          }
      },
      computed: {
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            },
            set(newVal){
                store.commit('setCurrentHW', newVal)
            }
        },
      },
    
      mounted(){
        this.timeLock = store.getters.getTimeLock
        if(this.timeLock == true){
            this.warning = true
        }else{this.warning = false}
        invoke('get_address', {walletname: this.wallet, hwnumber:this.hwNumber.toString()}).then((res)=>{
                store.commit('setDebug', `getting new address for delayed wallet: ${res}`)
                this.address = res
            })
              .catch((e)=>{
                store.commit('setDebug', `error getting new delayed wallet address ${e}`)
                store.commit('setErrorMessage', `Error getting new wallet address Error code: DelayedReceive3 Response: ${e}`)
                this.$router.push({ name: 'Error' })
              })
      }
    
    }
            
    </script>