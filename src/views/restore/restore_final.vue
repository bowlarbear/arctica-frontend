<template>
    <div class="page">
        <header>
            <h1>You have successfully restored your Hardware Wallet.</h1>
            <h2>You may now close this window.</h2>
        </header>
          <div class="btn_container"> 
               <button @click="proceed()" class="btn">What next?</Button>
          </div>
    </div>
</template>






<script>
  export default {
    name: 'restoreFinal',
    components: {
    },
      methods: {
        proceed(){
            //instruct the user on how to reboot into a HW and inform them to begin preparing a fullnode laptop with atleast 1TB of internal memory
        },
        },
      data(){
          return{
          }
      }
  }
  </script>