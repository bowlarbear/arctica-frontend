<!-- User is brought to this screen when booting a freshly restored HW for the first time, the user should only see the loading compnent as we install deps and send back to welcome-->

<template>
  <div>
    <Loader/>
  </div>
</template>






<script>
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

  export default {
    name: 'restoreInit',
    components: {
      Loader,
    },
    mounted(){
      store.commit('setDebug', 'arrived at restoreInit')
      store.commit('setLoadMessage', 'Installing HW dependencies...')
      //install deps
      invoke('install_hw_deps', {warm: false}).then((res) => {
        store.commit('setDebug', `installing cold HW dependencies ${res}`)
        //update setupStep to default
        store.commit('setLoadMessage', 'Updating state...')
        invoke('async_write', {name: 'setupStep', value: "0"}).then((res) => {
          store.commit('setDebug', `config set to new values setupStep: ${this.setupStep} res:${res}`)
          //send user back to Welcome
          store.commit('setDebug', `restore init complete, sending user back to welcome`)
          this.$router.push({ name:'welcome' })
        }).catch((e) => {
            store.commit('setDebug', `async write error: ${e}`)
            store.commit('setErrorMessage', `Error with async write Error code: restoreInit-2 Response: ${e}`)
            this.$router.push({ name:'Error' })
        })
      }).catch((e) => {
          store.commit('setDebug', `install HW deps error: ${e}`)
          store.commit('setErrorMessage', `Error installing HW dependencies Error code: restoreInit-1 Response: ${e}`)
          this.$router.push({ name:'Error' })
      })
    },
      methods: {
        proceed(){
        },
        },
      data(){
          return{
          }
      }
  }
  </script>