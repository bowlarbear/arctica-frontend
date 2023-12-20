<template>
<div class="page">
    <div class="display_block">
        <header class="transaction_head">
            <h1>Transaction</h1>
            <button class="btnclose" @click="goBack()"><img src="@/assets/X.png"></button>
        </header>
         <div class="description_block">
            <input v-model="this.transaction.description" type="text" placeholder="Enter a description...">
        </div>

        <div class="tx_block">
            <h2>To</h2>
            <h3>{{ this.transaction.address }}</h3>
        </div>

       <div class="tx_block">
            <h2>Amount</h2>
            <h3>{{ this.transaction.balance }}</h3>
        </div>

        <div class="tx_block">
            <h2>Fee</h2>
            <h3>{{ this.transaction.fee }}</h3>
        </div>

        <div class="tx_block">
            <h2>Time</h2>
            <h3>{{ this.transaction.datetime }}</h3>
        </div>

        <div class="tx_block">
            <h2>Status</h2>
            <h3 v-if="this.transaction.status=='Confirmed'" id="confirmed" >{{ this.transaction.status }}</h3>
            <h3 v-else id="unconfirmed" >{{ this.transaction.status }}</h3>
        </div>

        <div class="footer_block">
            <h2>View in explorer</h2>
            <div><img src="@/assets/carat_right.png"></div>
        </div> 
       

    </div> 
</div>



</template>

<script>
import store from '../../store.js'


export default{
components:{},
methods:{
    goBack(){
        this.$router.push({ name: 'hot' })
    }
},
  computed:{
    hotTransactions(){
        return store.getters.getHotTransactions
    },
    params(){
        return this.$route.params.id
    },
    transaction(){
        return this.hotTransactions[this.params-1]
    }
  }
}

</script>


<style scoped>
.display_block{
    align-items: flex-start;
    width:30%;
    padding:2%;
    background: #FFFFFF;
    border-radius:10px;
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