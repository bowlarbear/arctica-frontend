<!-- User returns to primary machine for this step, currently on primary consider changing step 20-->

<template>
<div class="page">
    <header>
        <h1>Initial Sync Complete</h1>
        <h2>You may now log in to your wallet.</h2>
    </header>
        <div class="btn_container"> 
            <button @click="acknowledge()" class="btn">Go</Button> 
        </div>

</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'

export default {
  name: 'Setup51',
  components: {
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'welcome' })
            //TODO set these two false when building them out and testing
            store.commit('setDuressSetup', true)
            store.commit('setRecoverySetup', true)
            store.commit('setTripwireSetup', true)
        },

    },

}
</script>

