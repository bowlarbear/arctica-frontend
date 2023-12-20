<template>
    <header>
      <h1>Arctica Has Encountered a Fatal Error</h1>
      <h2>You may need to restart the application</h2>
      <h2>If you'd like to help improve Arctica please report this error</h2>
      <h2>Error: {{ errorMessage }}</h2>
    </header>
</template>

<script>
import store from '../store.js'

export default {
  name: 'Error',
    data(){
        return{
        }
    },
    computed:{
      errorMessage(){
        return store.getters.getErrorMessage
      }
    }
}
</script>

