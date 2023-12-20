<!-- This page will dynamically display the current number of Hardware Wallets needed to decrypt as well as a countdown to the remaining privacy key decay schedules -->
<!-- Revisit this entire flow after dynamic privacy key decay feature is implemented -->
<!-- The recovery protocol currently demands the user is starting the recovery process on HW 1-->
<!-- There is a very rare edge case here which is not handled. If the user has somehow lost HW 1-4 and converted one of HW 5-7 into a new HW 1, they will only have access to 3 shards in total -->
<template>
  <div class="page">
    <header>
    </header>
    <div v-if="this.numberToRecover == 5" class="btn_container">
      <h1>In order to manually recover you will need access to 2-3 additional Hardware Wallets.</h1>
        <button @click="acknowledge()" class="btn">Proceed</Button>
    </div>
    <!-- Eventually every option below this point needs to be fetching privacy keys from blockchain and adding them to shards dir -->
    <div v-else-if="this.numberToRecover == 4" class="btn_container"> 
      <h1>In order to manually recover you will need access to 1-2 additional Hardware Wallets.</h1>
      <button @click="acknowledge()" class="btn">Proceed</Button>
    </div>
    <div v-else-if="this.numberToRecover == 3" class="btn_container">
      <h1>In order to manually recover you will need access to 1 additional Hardware Wallet.</h1>
        <button @click="acknowledge()" class="btn">Proceed</Button>
    </div>
    <div v-else-if="this.numberToRecover <= 2" class="btn_container">
      <!-- this case may not always be true if the user tries to recover with a converted wallet that only has 1 shard accessible *shrug*-->
      <h1>Enough of your privacy keys have decayed that you may login without a passphrase.</h1>
        <button @click="login()" class="btn">Login</Button>
    </div>

  
  </div>
</template>

<script>
  import store from '../../store.js'
  
  export default {
    name: 'Recovery',
      methods: {
          acknowledge(){
              this.$router.push({ name: 'RecoveryInitiate' })
          },
          login(){
            //nothing here yet until numbertorecover <=2 threshold is achievable, this will not happen until BPS publishes privacy keys according to decay schedule
          }
      },
      computed: {
        numberToRecover(){
          return store.getters.getNumberToRecover
        },
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
      }
    }
  </script>


