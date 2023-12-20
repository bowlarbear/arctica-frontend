<template>
<div class="page">
    <NavImmediate />
      <div class="dashboard">
        <div class="head_container">
          <h1>Transaction History</h1>
        </div>
        <div v-if="this.txHistory == false">
        <h2>You don't have any transactions yet.</h2></div>
        <div v-else @click="transactionDetail(transaction.id)" v-for="transaction in this.jsonData.slice().reverse()" :key="transaction.id" class="transaction_container">
          <div class="transaction_container_left">
          <h2>{{ truncateString(transaction.detail.address) }}</h2>
          <h3>{{ convertDateTime(transaction.info.time) }}</h3>
          </div>
          <div class="transaction_container_right">
            <!-- if receive show black text with a + sign -->
            <h2 v-if="transaction.detail.category == 'Receive'" class="receive_balance">₿ + {{ transaction.detail.amount }} sats</h2>
            <h2 v-else class="send_balance">₿ {{ transaction.detail.amount }} sats</h2>
            <!-- if send show red text with a - sign -->
            <h3 class="fiat_currency"> $ 0.00</h3>
          </div>
        </div>
      </div>
</div>
</template>

<!-- Need search and filter component -->


<script>
import NavImmediate from '@/components/NavImmediate'
import store from '../../store.js'
const invoke = window.__TAURI__.invoke

export default {
  name: 'immediate',
  components: {
    NavImmediate,
  },
    methods: {
      transactionDetail(txId){
        this.$router.push({ path: `/wallets/immediate/${txId}` })

      },
      convertDateTime(unixTime){
        let multiplied = unixTime * 1000
        let dateval = new Date(multiplied).toLocaleString()
        return dateval
      },
  },
    computed:{
    truncateString(){
      return (str)=>{
        return str.slice(0,18) + '...'
      }
      },
      immediateTransactions:{ 
        get(){
          return store.getters.getImmediateTransactions
        }
        },
        hwNumber:{
            get(){
                return store.getters.getCurrentHW
            },

        },
  },
  data(){
    return{
      txHistory: false,
      jsonData: {}
    }
  },
  mounted(){
    console.log("invoking get_transactions")
    invoke('get_transactions', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
                  if(res.toLowerCase().includes("empty123321") == true){
                    console.log(`empty result: ${res}`)
                  }
                  else{
                  this.txHistory = true
                  console.log(`JSON result: ${res}`)
                  let parsed = JSON.parse(res)
                  this.jsonData = parsed
                  console.log(`parsed: ${JSON.stringify(parsed)}`)
                  store.commit('setDebug', `obtaining transaction history JSON for immediate wallet: ${parsed}`)
                  store.commit('setImmediateTransactions', `${parsed}`)
                  console.log('console logging immediate tx store:', JSON.stringify(store.getters.getImmediateTransactions))
                  }
            })
            .catch((e)=>{
                store.commit('setDebug', `error obtaining transactions for immediate wallet: ${e}`)
            })

  },
}
</script>

<style scoped>
h3{
  font-family: 'Inter';
  color: #777777;
}
</style>