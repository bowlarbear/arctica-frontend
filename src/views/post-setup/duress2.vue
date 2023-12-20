<template>
  <header>
<h1>Let's double check your duress password.</h1>
 <h2>Confirm the duress password that you created on the previous screen.</h2> 
            <div class="form_container">
                <form>
                    <label>Enter Duress Password</label>
                   <br><input v-model="password1" type="password" required placeholder="Your duress password">
                </form>
                <div class="btn_container"> 
                    <button v-if="password1 == this.password" @click="acknowledge()" class="btn">Continue</Button>
                    <button v-else @click="warn()" class="btn3">Continue</Button>
                    <button @click="$emit('goBack')" class="btn2">New Password</button>
                </div>
                </div>
    </header>
</template>

<!-- 
this component needs a fail condition -->

<script>

export default {
  name: 'Duress2',
  props: ['password'],
  components: {
    },
    methods: {
        acknowledge(){
        },
        warn(){
        },
    },
     data(){
     return{
         password1: '',
         password2: ''
     }
 }
}
</script>
