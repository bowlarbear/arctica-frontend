<template>
<div class="page">
    <div class="display_block">
        <h1>Ready to Send?</h1>
        <div class="output_wrap">
            <div class="output_multi" v-for="tx in transaction" :key="tx.id">
                <img v-if="this.x == tx.id - 1" class="selected" src="@/assets/checkmark_green.png">
                <img v-else src="@/assets/checkmark_green.png">
            </div>
        </div>
        <div class="tx_block">
            <h2>To</h2>
            <h3>NaaN</h3>
        </div>

        <div class="tx_block">
            <h2>Amount</h2>
            <h3>₿ NaaN</h3>
        </div>

        <div class="tx_block">
            <h2>Fee</h2>
            <h3>₿ NaaN</h3>
        </div>

        <div class="horizontal_btn_container">
            <button v-if="this.transaction.length == 1" hidden class="btn8"><img src="@/assets/carat_left.png"></button>
            <button v-else-if="this.x == 0" class="btn8"><img src="@/assets/carat_left.png"></button>
            <button v-else @click="backward()" class="btn7"><img src="@/assets/carat_left.png"></button>
            <div class="interior_horizontal_btn_container">
                <button @click="broadcast()" class="btn">Send</button>
                <button @click="discard()" class="btn2">Discard</button>
            </div>
            <button v-if="this.transaction.length == 1" hidden class="btn8"><img src="@/assets/carat_right.png"></button>
            <button v-else-if="this.x == this.transaction.length - 1" class="btn8"><img src="@/assets/carat_right.png"></button>
            <button v-else @click="forward()" class="btn7"><img src="@/assets/carat_right.png"></button>
            
        </div>
        
    </div>
</div>
</template>


<script>
import store from '../../store.js'

export default {
    name: 'hotBroadcastMultioutput',
    components: {},
    methods: {
        broadcast(){
        },
        discard(){
        },
        forward(){
            this.x = this.x + 1
        },
        backward(){
            this.x = this.x - 1
        }
    },
    data(){
        return {
            x: 0
        }
        },
    computed:{
        //this is a mess, need to rework how the state is handled, above is the multioutput array, below is the single output tx
        tx(){
            return store.getters.getTransaction
        }
    }
    }

</script>

<style scoped>
.btn{
    display:flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    margin-top: 2%;
}
.horizontal_btn_container{
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.btn2{
    margin-top: 2%;
}
.btn7{
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius:5px;
    margin-left: 25px;
    margin-right: 25px;
}
.btn8{
    background: #DEDEDE;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius:5px;  
    margin-left: 25px;
    margin-right: 25px;
}
.output_wrap{
    display:flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-content:space-between; 
    
}
.output_multi{
    padding-left: 3px;
    padding-right: 3px;
}
.selected{
    border: 2px solid #009DE0;
    border-radius: 25px;
}
</style>
