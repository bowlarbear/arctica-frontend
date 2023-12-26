<template>
  <div v-if="this.loading == true">
  <Loader/>
</div>
  <div v-else class="login">
    <header>
      <h1>What would you like to do?</h1>
      <h2>If you are new to Arctica, click the "Create New Wallet" button below.</h2>
      <h2>Check the box below if you would like to access other options.</h2>
    </header>
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I already have an Arctica wallet.</label>
            </div>
        </form>
            <div class="btn_container"> 
                <button @click="install()" class="btn">Create new wallet</Button> 
                <button v-if="checkbox" @click="sync()" class="btn2">Proceed to Node</button>
                <button v-if="checkbox" @click="restoreBackup()" class="btn2">Restore a Backup</button>
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
  name: 'Setup1c',
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
              store.commit('setErrorMessage', `Error in  init_iso. Error code: Setup1c-2 Response: ${e}`)
              this.$router.push({ name: 'Error' })
            })
        }).catch((e) => {
          store.commit('setDebug', `Error No network connection found Error code: Setup1c-1 Response:: ${e}`)
          this.noNetwork = true
          this.loading = false
        })
      },
      sync(){
        store.commit('setDebug', `returning user profile selected, sending user to node mode`)
        this.$router.push({ name:'Node' })
      },
      restoreBackup(){
        store.commit('setDebug', 'restore Backup button clicked, sending user to restoreBackup flow')
        this.$router.push({ name: 'restoreBackup' })
      },
    },
    data(){
        return{
          checkbox: false,
          loading: false,
        }
    },
    mounted(){
      //set a state value here that informs restore backup user is on the node machine
      store.commit('setNode', true)
    },
}
</script>

