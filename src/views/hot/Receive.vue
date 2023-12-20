<template>
<div class="page">
    <NavHot/>
    <div class="outer_container">
        <div class="receive_head_container">
         <h1>Receive Bitcoin</h1>
         </div>
        <div class="receive_container">
            <div class="receive_top">
                <img src="@/assets/placeholderQR.png">
                <h2 class="receive_address">{{ address }}</h2>
            </div>
            <div class="receive_bottom">
                <div @click="copy(address)" id="copy">
                    <img src="@/assets/Copy.png">
                    <h2 class="copy_text">Copy Address</h2>
                </div>
                <div id="download">
                    <img src="@/assets/Arrow_down.png">
                    <h2 class="download_text">Download QR Code</h2>
                </div>
            </div>
        </div>
        <button @click="newAddress()" class="btn">New Address</Button>
    </div>        
</div>
</template>


<!-- 
Todo:
-download QR button not yet implemented -->

<script>
import NavHot from '@/components/NavHot'
import store from '../../store.js'

export default {
  name: 'hotReceive',
  components: {
    NavHot,
  },
  methods:{
        async copy(s){
        await navigator.clipboard.writeText(s)
        alert('Copied Address!')
        },
        newAddress(){
        },
  },
  data(){
      return{
          address: null
      }
  },
     mounted(){
    this.address = store.getters.getHotAddress
     }
}
</script>
