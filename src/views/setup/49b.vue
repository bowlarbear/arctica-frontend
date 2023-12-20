<template>
<div class="page">
    <header>
        <h1>Destroy Set up CD</h1>
        <h2>Beta testers please disregard this. Your setupCD can be used to login & break the time lock. </h2>
        <h2>Your Set up CD is no longer needed. Please <a class="blue_link" href="#">destroy</a> it now. </h2>
    </header> 
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have <a class="blue_link" href="#">destroyed</a> my set up CD.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
        </div>
    </div>
</div> 
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'

export default {
  name: 'Setup49b',
  components: {
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'Setup50a' })
        },
        warn(){
        },
    },
    data(){
        return{
            checkbox: false
        }
    },
    }
</script>


