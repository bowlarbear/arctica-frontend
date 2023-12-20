<template>
<Duress2 v-if="passwordSetup" v-on:goBack="goBack" :password="password2"/>
<div v-else class="page">
    <header>
        <h1>Please update your contact information</h1>
        <h2>In order to ensure your Time Machine Operator can contact you, please provide current contact information.</h2>
    </header>
      <div class="form_container">
        <form>
                    <label>Enter Phone Number</label>
                   <br><input v-model="phone1" type="text" required placeholder="Your preferred contact number">

                    <br><label>Confirm Phone Number</label>
                   <br><input v-model="phone2" type="text" required placeholder="Your preferred contact number">

        </form>
        <div class="btn_container"> 
            <button v-if="phone1 == phone2 && phone1 != '' && phone2 != '' " @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
        </div>
    </div> 

</div>

</template>

<script>
export default {
  name: 'TimeMachine2',
    methods: {
        acknowledge(){
            this.$router.push({ name: 'TimeMachine3' })
        },
        warn(){
        },


    },
    data(){
        return{
            phone1: '',
            phone2: '',
        }
    }
}
</script>

