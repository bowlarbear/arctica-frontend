<!-- This page will be a popup that appears when Arctica receives confirmation that a Time Machine Operator has accepted the call and received payment.
The document which the user prints out will be generated dynamically and include the Time Machine Operators name (and maybe phone number?) -->

<template>
<div class="page">
    <header>
        <h1>A Time Machine Operator has been provide your information and payment.</h1>
        <h2>Your operator is James Smith his phone number is XXX-XXX-XXXX.</h2> 
        <h2>The document below will include step by step instructions for your in person meeting.</h2>
        <h2>If your operator does not follow these instructions perfrectly you should assume he is trying to steal from you.</h2>
        <h4>You should print this document after saving.</h4>
    </header>
    

        <div class="btn_container"> 
            <button @click="acknowledge()" class="btn">Save this information</Button>
        </div>



</div>

</template>

<script>

export default {
  name: 'TimeMachine5',
  components: {
    },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'dashboard' })
        },

    },
}
</script>
