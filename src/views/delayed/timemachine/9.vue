<!-- This page will be a popup that appears everytime the user logs in, when the user has completed their second time machine operation and
can now spend from delayed-->

<template>
<div class="page">
    <header>
        <h1>Your Second Time Machine Operation is Complete</h1>
        <h2>Your funds are now accessible from your delayed wallet.</h2>
    </header>
    

        <div class="btn_container"> 
            <button @click="acknowledge()" class="btn">Ok</Button>
        </div>



</div>

</template>

<script>

export default {
  name: 'TimeMachine9',
  components: {
    },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'delayed' })
            //update a global delayed wallet unlocked variable here
        },

    },
}
</script>

