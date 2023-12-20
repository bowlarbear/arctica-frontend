<template>
<div class="page">
    <NavImmediate/>
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
import NavImmediate from '@/components/NavImmediate'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: 'immediateReceive',
  components: {
    NavImmediate,
  },
  methods:{
    copy(){
            invoke('copy_to_clipboard', {address: this.address}).then((res)=>{
              store.commit('setDebug', `copying to clipboard: ${res}`)
              alert('Copied Address!')
            })
            .catch((e)=>{
                store.commit('setDebug', `error copying address to clipboard ${e}`)
                store.commit('setErrorMessage', `Error copying address to clipboard Error code: ImmediateReceive4 Response: ${e}`)
                this.$router.push({ name: 'Error' })
              })
            },
        newAddress(){            
            invoke('get_address', {walletname: this.wallet, hwnumber:this.hwNumber.toString()}).then((res)=>{
            store.commit('setDebug', `getting new address for immediate wallet: ${res}`)
            this.address = res
        })
          .catch((e)=>{
            store.commit('setDebug', `error getting new immediate wallet address ${e}`)
            store.commit('setErrorMessage', `Error getting new wallet address Error code: ImmediateReceive1 Response: ${e}`)
            this.$router.push({ name: 'Error' })
          })
        },
        displayQR(){
          invoke('display_qr').then((res)=>{
            store.commit('setDebug', `displaying QR code: ${res}`)
          }).catch((e)=>{
            store.commit('setDebug', `error getting new immediate wallet address ${e}`)
            store.commit('setErrorMessage', `Error displaying QR code Error code: ImmediateReceive2 Response: ${e}`)
            this.$router.push({ name: 'Error' })
          })
        },
  },
  data(){
      return{
          address: null,
          wallet: "immediate"
      }
  },
  computed: {
    hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
  },

  mounted(){
    invoke('get_address', {walletname: this.wallet, hwnumber:this.hwNumber.toString()}).then((res)=>{
            store.commit('setDebug', `getting new address for immediate wallet: ${res}`)
            this.address = res
        })
          .catch((e)=>{
            store.commit('setDebug', `error getting new immediate wallet address ${e}`)
            store.commit('setErrorMessage', `Error getting new wallet address Error code: ImmediateReceive3 Response: ${e}`)
            this.$router.push({ name: 'Error' })
          })
  }

}
        
</script>

