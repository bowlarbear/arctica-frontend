<template>
<div class="page">
    <div class="display_block">
        <h1>Ready to send?</h1>
        <img src="@/assets/checkmark_green.png">
        <div class="tx_block">
            <h2>To</h2>
            <h3>{{ this.transaction.address }}</h3>
        </div>

        <div class="tx_block">
            <h2>Amount</h2>
            <h3>₿ {{ this.transaction.balance }}</h3>
        </div>

        <div class="tx_block">
            <h2>Fee</h2>
            <h3>₿ {{ this.transaction.fee }}</h3>
        </div>

        <div class="horizontal_btn_container">
            <button @click="broadcast(this.transaction)" class="btn">Send</button>
            <button @click="discard()" class="btn2">Discard</button>
        </div>
        

    </div>
</div>
</template>


<script>
import store from '../../store.js'

export default {
    name: 'hotBroadcast',
    components: {},
    methods: {
        broadcast(){
            this.$router.push({name: 'hotConfirmation'}) 
            store.commit('pushHotTransaction', this.transaction)
        },
        discard(){
            store.commit('clearTransaction')
            this.$router.push({name: 'hot'}) 
        },
    },
    computed:{
        transaction(){
            return store.getters.getTransaction
        }
    }
}
</script>
