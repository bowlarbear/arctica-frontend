<template>
<div class="page">
    <header>
        <h1>Time to set up your Hardware Wallets...</h1>
        <h3>WARNING: All devices, including this computer, may be wiped during setup. Make absolutely sure you are only using dedicated devices that do not contain important information.</h3>
        <h2>Backup Discs: Label 8 CD-RW's "1" through "7", and label the final one "set up".</h2> 
        <h2>Backup Discs: Label 7 DVD/M-DISCs "1" through "7" (not required for Beta Testers).</h2> 
        <h2>Hardware Wallets: Label 7 blank SD cards or 7 blank USB sticks "HW 1" through "HW 7".</h2>
        <h2>Label 7 Envelopes "1" through "7" (large enough envelopes to hold 2 CDs & 1 Hardware Wallet).</h2>
    </header>
    
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">My devices are properly labelled</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Continue</Button>
            <button v-else @click="warn()" class="btn3">Continue</Button>
        </div>
    </div> 


</div>
<ProgressBar/>
</template>

<script>
import ProgressBar from '@/components/ProgressBar'

export default {
  name: 'Setup3',
  components: {
    ProgressBar
  },
    methods: {
            acknowledge(){
            this.$router.push({ name: 'Setup4' })
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
    h3{
        font-weight: 900;
        color: red;
    }
</style>
