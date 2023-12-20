<template>
  <div class="login">
    <header>
      <h1>Your Time Machine request is processing</h1>
      <h2>We've contacted Time Machine Operators. Check back in 24 hours.</h2>
    </header>
    <div class="btn_container"> 
        <button @click="acknowledge()" class="btn">Ok</Button>
    </div>
  </div>
</template>

<script>  
export default {
  name: 'TimeMachine3',
    methods: {
        acknowledge(){
            this.$router.push({ name: 'dashboard' })
        },

    },
}
</script>

