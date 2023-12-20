<template>
<div class="page">
<header>
    <h1>Are you sure you want to perform a quick withdrawal?</h1>
    <h2>This is not the recomended way to access your funds.</h2>
    <h2>Please confirm before proceeding.</h2>
 </header>
      <div class="form_container">
        <form>
            <div class="lg_checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I understand and would like to withdraw</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
            <button @click="goBack()" class="btn2">Go Back</button>
        </div>
    </div> 

</div>

</template>

<script>
export default {
  name: 'quick1',
  components: {
    },
    methods: {
        acknowledge(){
            this.$router.push({ name: 'quick2' })
        },
        warn(){
        },
        goBack(){
            this.$router.push({ name: 'welcome' })
        }

    },
    data(){
        return{
            checkbox: false,
        }
    }
}
</script>
