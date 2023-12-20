<template>
<div class="page">
    <header>
        <h1>Remove your installation USB</h1>
        <h2>Your installation USB is no longer needed. Please remove & destroy it now. </h2>
        <h2>This USB stick is very dangerous and will overwrite the data on any machine. </h2>
    </header> 
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have removed my installation USB.</label>
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
  name: 'Setup1a',
  components: {
    ProgressBar,
  },
    methods: {
      acknowledge(){
        this.$router.push({ name:'Setup1b' })
        },
      },
    data(){
        return{
          checkbox: false,
        }
    },

}
</script>

