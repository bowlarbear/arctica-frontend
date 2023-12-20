<!-- This page will be a popup that appears everytime the user logs in, when the user has completed their first time machine operation and
is waiting for a confirmation from the second time machine operator.-->

<template>
<div class="page">
    <header>
        <h1>Your First Time Machine Operation is Complete</h1>
        <h2>We are now waiting on a second Time Machine Operator.</h2>
        <h2>Check back in 24 hours.</h2>
    </header>
    

        <div class="btn_container"> 
            <button @click="acknowledge()" class="btn">Ok</Button>
        </div>



</div>

</template>

<script>

export default {
  name: 'TimeMachine7',
  components: {
    },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'dashboard' })
        },

    },
}
</script>

