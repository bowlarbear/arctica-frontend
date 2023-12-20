<template>
  <div v-if="this.loading == true">
    <Loader/>
  </div>
  <div v-else class="page">
        <header>
            <h1>Please insert your Backup CD.</h1>
            <h2>You will also need a blank USB stick or SD card with atleast 16GB of storage space. Do not insert this yet.</h2>
            <h4 v-if="badCD">*No valid backup CD found, please reinsert and try again</h4>
        </header>
        <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted a backup CD.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="proceed()" class="btn">Continue</Button>
            <button v-else @click="warn()" class="btn3">Continue</Button>
            <button class="btn2" @click="help()">I have no CD drive</button>
            <button v-if="this.node == true" class="btn2" @click="goHome()">Go Home</button>
        </div>
    </div>
  </div>
</template>


<script>
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
    name: 'restoreBackup',
    components: {
      Loader,
    },
      methods: {
         proceed(){
          this.loading = true
          this.badCD = false
          //here we need to check the CD contents and determine what number HW the user is attempting to restore
          invoke('read_cd').then((res) => {
              store.commit('setDebug', `invoking read_cd: ${res}`)
              let resArray = res.split("\n")
              store.commit('setDebug', `response Array: ${resArray}`)
              //check the config values
              for(let i = 0; i < resArray.length; i ++){
                  let it = resArray[i].split("=")
                  store.commit('setDebug', `for loop number: ${i+1}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                  //if config value is set to 'backupcd', user is attempting to manually decrypt
                  if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'HARDWAREWALLET'){
                      store.commit('setDebug', `backup CD detected, initializing iso`)
                      //init iso 
                      store.commit('setLoadMessage', 'Initializing Ubuntu iso...')
                      invoke('init_iso').then((res)=> {
                        store.commit('setDebug', `ubuntu iso created successfully: ${res}`)
                          this.loading = false;
                          //send user to next step
                          this.$router.push({ name:'restoreFlash' })
                      })
                      .catch((e) => {
                      store.commit('setDebug', `init_iso error: ${e}`)
                      store.commit('setErrorMessage', `Error initializing iso. Error code: restoreBackup1 Response: ${e}`)
                      this.$router.push({ name: 'Error' })
                      })
                      //break out of the read CD for loop
                      break
                  }else{
                    continue
                  }
              }
            }).catch((e)=>{
              store.commit('setDebug', `error reading CD Error Code: restoreBackup2 Response: : ${e}`)
              this.badCD = true
              this.loading = false
            })
        },
          help(){
            //TODO this needs to send the user to an instructional page that informs them to purchase a usb tethered CD Drive for their computer. 
            //can use a global helper state here, similar to how the loader component works
          },
          goHome(){
            //NOTE this function's button will only show if the user is on their primary node machine
            this.$router.push({ name: 'Node' })
          },
        },
      data(){
          return{
            checkbox: false,
            loading: false,
            badCD: false,
          }
      },

      computed: {
    node:{
            get(){
                return store.getters.getNode
            }
        },
 },
  }
  </script>