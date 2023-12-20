<template>
<div class="page">
<header>
    <!-- the below will need a full rework once page 2 and its child components are working correctly. This should be pulling in props from the previous page -->
    <h1>Does the below information look correct?</h1>
    <h2>Your Full Name [name variable will go here] <a class="blue_link" href="#">Image</a> <a class="blue_link" href="#">Edit</a> <a class="blue_link" href="#">Delete</a></h2>
    <h2>Family Member #1 Name [name variable will go here] <a class="blue_link" href="#">Image</a> <a class="blue_link" href="#">Edit</a> <a class="blue_link" href="#">Delete</a></h2>
 </header>
      <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have verified the above information</label>
                </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
        </div>
    </div> 

</div>

</template>

<script>
export default {
  name: 'piiPostSetup3',
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
            checkbox: false,
        }
    }
}
</script>

<style scoped>
.checkbox_container{
margin-left:5%; 
}
</style>