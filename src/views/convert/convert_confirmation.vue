<template>
    <div class="page">
        <header>
            <h1>If you cannot boot from HW 1 and you do not have a backup disc for HW 1, you must Login with this Hardware Wallet.</h1>
            <h2>This will require connecting to the internet and will forever alter the security profile of this device.</h2>
            <h2>This is irreversible and you should only proceed as a last resort.</h2>

            <h2>If you no longer have HW 1 or any of it's backups, you must do this in order to Log in to Arctica</h2>

            <h1>Are you sure you would like to Login with this Hardware wallet?</h1>
        </header>
        <div class="form_container">
          <form>
              <div class="checkbox_container">
                  <input type="checkbox" v-model="checkbox" name="checkbox">
                  <label for="checkbox">I understand the risks.</label>
              </div>
          </form>
          <div class="btn_container"> 
              <button v-if=checkbox @click="acknowledge()" class="btn">Continue</Button>
              <button v-else @click="warn()" class="btn3">Continue</Button>
          </div>
        </div> 
    </div>
</template>
    
  <script>
  import store from '../../store.js'
  const invoke = window.__TAURI__.invoke

  export default {
    name: 'convertConfirmation',
    components: {
    },
      methods: {
         acknowledge(){
          //update the config.txt to awake=true
          invoke('async_write', {name: "awake", value: "true"}).then(() => {
            //enable networking so that the user may connect to a network
            invoke('enable_networking').then((res) => {
            store.commit('setDebug', `Enabling Networking: ${res}`)
            this.$router.push({ name: 'convertFinal' })
            })
            .catch((e) => {
                store.commit('setDebug', `error enabling networking: ${e}`)
                store.commit('setErrorMessage', `Error enabling networking Error code: convertConfirmation-2 Response: ${e}`)
                this.$router.push({ name:'Error' })
            })
          }).catch((e) => {
              store.commit('setDebug', `async write error: ${e}`)
              store.commit('setErrorMessage', `Error with async write Error code: convertConfirmation-1 Response: ${e}`)
              this.$router.push({ name:'Error' })
          })
        },
        },
      data(){
          return{
            checkbox: false,
          }
      }
  }
  </script>