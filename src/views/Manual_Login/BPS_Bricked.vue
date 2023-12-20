<!-- This page will be a popup that appears if the user has 5 unsuccesful login attempts and Bricks the BPS relationship-->

<template>
<div class="page">
    <header>
        <h1>You have 5 failed login attempts.</h1>
        <h2>Arctica will now initialize the manual recovery process.</h2>
        <h2 class="strong">This will require you access additional Hardware Wallets.</h2>
    </header>
    

        <div class="btn_container"> 
            <button @click="acknowledge()" class="btn">Ok</Button>
        </div>



</div>

</template>

<script>

export default {
  name: 'BPS_Bricked',
  components: {
    },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'Recovery' })
        },

    },
}
</script>

<style>

.strong{
    font-weight: 800;
}
</style>
