<template>
    <div class="page">
        <div class="display_block">
            <header class="transaction_head">
                <h1>Transaction</h1>
                <button class="btnclose" @click="goBack()"><img src="@/assets/X.png"></button>
            </header>
             <!-- <div class="description_block"> -->
                <!-- <input v-model="transaction.detail.label" type="text" placeholder="Enter a description..."> -->
                <!-- <h2>There is no description</h2> -->
            <!-- </div> -->
    
            <div class="tx_block">
                <h2>To</h2>
                <h3>{{ transaction.detail.address }}</h3>
            </div>
    
           <div class="tx_block">
                <h2>Amount</h2>
                <h3>₿ {{ convertSatstoBTC(transaction.detail.amount) }}</h3>
            </div>
    
            <div class="tx_block">
                <h2>Fee</h2>
                <h3>{{ transaction.detail.fee }}</h3>
            </div>
    
            <div class="tx_block">
                <h2>Time</h2>
                <h3>{{ convertDateTime(transaction.info.time) }}</h3>
            </div>
    
            <div class="tx_block">
                <h2>Status</h2>
                <h3 v-if="transaction.info.confirmations >=1 " id="confirmed" >{{ transaction.info.confirmations }} Confirmation(s)</h3>
                <h3 v-else id="unconfirmed" >Unconfirmed</h3>
            </div>
    
            <div class="footer_block">
                <h2>View in explorer (Disabled)</h2>
                <div><img src="@/assets/carat_right.png"></div>
            </div> 
           
    
        </div> 
    </div>
    
    
    
    </template>
    
    <script>
    import store from '../../store.js'
    const invoke = window.__TAURI__.invoke
    
    
    export default{
    components:{},
    methods:{
        goBack(){
            this.$router.push({ name: 'delayed' })
        },
        convertDateTime(unixTime){
            let multiplied = unixTime * 1000
            let dateval = new Date(multiplied).toLocaleString()
            return dateval
          },
          convertSatstoBTC(sats){
            let total = sats/100000000
            return total
          }
    },
    
      computed:{
        hwNumber(){
        return store.getters.getCurrentHW
      },
    
    
        params:{
            get(){
                console.log(`logging params`, this.$route.params.id)
                return this.$route.params.id
            },
    
        },
    
    
        
            
        },
        mounted(){
            console.log("invoking get_transactions")
            invoke('get_transactions', {walletname: "delayed", hwnumber: this.hwNumber.toString()}).then((res)=>{
                      if(res.toLowerCase().includes("empty123321") == true){
                        console.log(`empty result: ${res}`)
                      }
                      else{
                      this.txHistory = true
                      console.log(`JSON result: ${res}`)
                      let parsed = JSON.parse(res)
                      this.transaction = parsed[this.params]
                      console.log(`parsed: ${JSON.stringify(parsed)}`)
                      store.commit('setDebug', `obtaining transaction history JSON for delayed wallet at param index: ${this.transaction}`)
                      }
                })
                .catch((e)=>{
                    store.commit('setDebug', `error obtaining transactions for delayed wallet: ${e}`)
                })
                },
        data(){
            return{
                transaction:{}
            }
        }
    }
      
    
    
    </script>
    
    
    <style scoped>
.display_block{
    align-items: flex-start;
    flex-wrap: wrap;
    width:40%;
    padding:2%;
    background: #FFFFFF;
    border-radius:10px;
    display: flex;
    flex-direction: column;
}
    .page{
      width:100%;
      padding-top:5%;
      padding-bottom:5%;
      background: rgba(0, 0, 0, 0.5);
      margin: 0 auto;
    }
    h2{
        color:#000000;
    }
    h3{
    font-family: 'Inter';
    text-align:right;
    color: #404040;
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-width: 100%;
}
    input{
        width:100%;
        padding:12px;
        border:none;
        text-align:center;
    }
    #confirmed{
        color:#27AE60;
    }
    #unconfirmed{
        color: #EB5757;
    }
    </style>