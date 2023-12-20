<!-- This screen will automatically show when the user does not have sufficient funds in their immediate account to proceed -->

<!-- This screen is currently not displayed anywhere because we need a live price API for it to work-->

<template>
  <div class="login">
    <header>
      <h1>Insufficient Funds</h1>
      <h2>In order to proceed you must have atleast $10,000 in your immediate account.</h2>
    </header>
    <div class="btn_container"> 
        <button @click="acknowledge()" class="btn">Ok</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeMachine4A',
    methods: {
        acknowledge(){
            this.$router.push({ name: 'immediateReceive' })
        },

    },
}
</script>

