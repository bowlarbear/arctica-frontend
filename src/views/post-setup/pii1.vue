<template>
<div class="page">
<header>
    <h1>We will now configure your recovery folder</h1>
    <h2>This folder is used for both the <a class="blue_link" href="#">Tripwire Protocol</a> and the <a class="blue_link" href="#">Duress Protocol</a>.</h2>
    <h2>This information will remain private unless you choose to reveal it!</h2>
 </header>
      <div class="form_container">
        <form>
            <div class="lg_checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have read and understand the <a class="blue_link" href="#">Tripwire Protocol</a> & <a class="blue_link" href="#">Duress Protocol</a>.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
            <button class="btn2" @click="skip()">Skip - Debug (recomended)</button>
        </div>
    </div> 

</div>

</template>

<script>
import store from '../../store.js'
export default {
  name: 'piiPostSetup1',
  components: {
    },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'piiPostSetup2' })
        },
        warn(){
        },
        skip(){
            store.commit('setRecoverySetup', true)
            this.$router.push({ name: 'dashboard' })
        }

    },
    data(){
        return{
            checkbox: false,
        }
    }
}
</script>
