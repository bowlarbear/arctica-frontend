<template>
<div class="page">
    <div class="display_block">
        <img src="@/assets/Circle_arrow_up.png">
        <h1>Transaction Sent. </h1>
        <h2>It usually takes about 30 minutes to be finalized.</h2>
        <div class="horizontal_btn_container">
            <button @click="viewTx()" class="btn2">View Transaction</button>
            <button @click="back()" class="btn">Back to Wallet</button>
        </div>
    </div>
</div>

</template>


<script>
import store from '../../store.js'
export default{
    name: 'hotConfirmation',
    methods:{
        back(){
            this.$router.push({ name: 'hot' })
        },
        viewTx(){
            this.$router.push({path: `${this.id}`})
        },
    },
    computed:{
        id(){
           let hotTransactions = store.getters.getHotTransactions
           return hotTransactions.length

        }
    },
}
</script>
