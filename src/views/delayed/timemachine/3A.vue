<!-- This screen will automatically show when the user navigates to the delayed wallet while they have an open Time Machine Request -->

<!-- This screen is currently not displayed anywhere -->

<template>
  <div class="login">
<header>
  <h1>Your Time Machine request is still processing</h1>
  <h2>We are still waiting on Time Machine Operators. Check back in 24 hours.</h2>
</header>
    <div class="btn_container"> 
        <button @click="acknowledge()" class="btn">Ok</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeMachine3A',
    methods: {
        acknowledge(){
            this.$router.push({ name: 'dashboard' })
        },

    },
}
</script>

