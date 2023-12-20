<template>
<Duress2 v-if="passwordSetup" v-on:goBack="goBack" :password="password2"/>
<div v-else class="page">
<header>
    <h1>Let's create a duress password</h1>
    <h2>When you attempt to login with this password, it will activate Arctica's <a class="blue_link" href="#">Duress Protocol</a>.</h2>
    <h2 class="strong_text">Entering your Duress Password at the Login screen will automatically send Bitcoin.</h2>
 </header>
      <div class="form_container">
        <form>
                    <label>Enter Duress Password</label>
                   <br><input v-model="password1" type="password" required placeholder="Your duress password">

                    <br><label>Confirm Duress Password</label>
                   <br><input v-model="password2" type="password" required placeholder="Your duress password">

            <div class="lg_checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have read and understand the <a class="blue_link" href="#">Duress Protocol</a>.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox && password1 == password2 && password1 != '' && password2 != '' " @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
            <button @click="skip()" class="btn2">Skip - Debug (recomended)</button>
        </div>
    </div> 

</div>

</template>

<script>
import Duress2 from './duress2'
import store from '../../store.js'

export default {
  name: 'duressPostSetup1',
  components: {
      Duress2
    },
    methods: {
        acknowledge(){
            this.passwordSetup = true
        },
        warn(){
        },
        goBack(){
            this.passwordSetup = false
            this.password1 = ''
            this.password2 = ''
        },
        skip(){
            store.commit('setDuressSetup', true)
            this.$router.push({ name: 'dashboard' })
        }

    },
    data(){
        return{
            checkbox: false,
            password1: '',
            password2: '',
            passwordSetup: false
        }
    }
}
</script>
