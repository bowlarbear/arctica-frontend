<template>
  <div v-if="this.loading == true">
  <Loader/>
</div>
  <div v-else class="login">
    <header>
      <h1>Please connect to the internet</h1>
      <h2>You must be connected to a network in order to continue.</h2>
      <h4 v-if="this.noNetwork == true">* Please verify that you are connected to the internet</h4>
    </header>
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have connected to the internet.</label>
            </div>
        </form>
            <div class="btn_container"> 
                <button v-if="checkbox" @click="install()" class="btn">Proceed</Button>
                <button v-else @click="warn()" class="btn3">Proceed</Button>
            </div>
        </div> 
  </div>
<ProgressBar/>
</template>


<script>
import ProgressBar from '@/components/ProgressBar'
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'Setup1b',
  components: {
    ProgressBar,
    Loader
  },
    methods: {
      install(){
        this.loading = true
        this.noNetwork = false
        store.commit('setLoadMessage', `checking network connection...`)
        //check network connection
        invoke('check_network').then((res) => {
          store.commit('setDebug', `network connected: ${res}`)
          store.commit('setLoadMessage', `Initializing Arctica...`)
          //init iso and then send user to setup3
          invoke('init_iso').then(()=> {
            store.commit('setDebug', 'ubuntu iso created successfully, sending to setup3')
            this.$router.push({ name:'Setup3' })
          }).catch((e) => {
              store.commit('setDebug', `init_iso error: ${e}`)
              store.commit('setErrorMessage', `Error in  init_iso. Error code: Setup1b-2 Response: ${e}`)
              this.$router.push({ name: 'Error' })
            })
        }).catch((e) => {
          store.commit('setDebug', `Error No network connection found Error code: Setup1b-1 Response:: ${e}`)
          this.noNetwork = true
          this.loading = false
        })
      },
    },
    data(){
        return{
          checkbox: false,
          loading: false,
          noNetwork: false,
        }
    },
    mounted(){
      //enable networking so that the user may connect to a network
      invoke('enable_networking').then((res) => {
      store.commit('setDebug', `Enabling Networking: ${res}`)
      if(res.includes("SUCCESS networking is already enabled")){
        this.loading = true
        store.commit('setDebug', `network connected: ${res}`)
        store.commit('setLoadMessage', `Initializing Arctica...`)
        //init iso and then send user to setup3
        invoke('init_iso').then(()=> {
          store.commit('setDebug', 'ubuntu iso created successfully, sending to setup3')
          this.$router.push({ name:'Setup3' })
        }).catch((e) => {
            store.commit('setDebug', `init_iso error: ${e}`)
            store.commit('setErrorMessage', `Error in  init_iso. Error code: Setup1b-3 Response: ${e}`)
            this.$router.push({ name: 'Error' })
          })
      }
      })
      .catch((e) => {
          store.commit('setDebug', `error enabling networking: ${e}`)
          store.commit('setErrorMessage', `Error enabling networking Error code: Setup1b-4 Response: ${e}`)
          this.$router.push({ name:'Error' })
      })
  },
}
</script>

