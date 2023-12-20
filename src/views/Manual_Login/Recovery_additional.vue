<template>
  <div v-if="this.loading == true">
  <Loader/>
</div>
  <div v-else class="page">
    <header>
      <h1>Manual Recovery</h1>
      <h2 v-if="badCD == false">Please remove your recovery CD and reboot with your next available Hardware Wallet</h2>
      <h2 v-if="badCD == true">There was an error updating your recovery CD. Please reinsert it and try again</h2>
    </header>
    <div class="btn_container"> 
    <button v-if="badCD == true" class="btn" @click="tryAgain()">Try again</button>
    </div>
  </div>
</template>

<script>
import store from '../../store.js'
import Loader from '@/components/loader'
const invoke = window.__TAURI__.invoke

export default {
  name: 'RecoveryAdditional',
  components: {
    Loader
  },
    computed: {
      numberToRecover(){
        return store.getters.getNumberToRecover
      },
    },
    methods: {
      //used to reinitialize refresh_cd if catch statement is triggered
      tryAgain(){
        this.loading = true
        this.badCD = false
        invoke('calculate_number_of_shards').then((res)=> {
          store.commit('setDebug', `calculating number of shards in ramdisk: number = ${res}`)
          //if numbertorecover threshold is not yet met
          if(this.numberToRecover > res){
            store.commit('setLoadMessage', 'refreshing Recovery CD...')
            store.commit('setDebug', `Need more shards to complete recovery. obtained ${res} of ${this.numberToRecover}`)
            invoke('refresh_cd', {psbt: false}).then((res)=>{
              store.commit('setDebug', `refreshing recovery CD with the contents of /mnt/ramdisk/CDROM: ${res}`)
              this.loading = false
            })
            .catch((e)=>{
              store.commit('setDebug', `error refreshing recovery cd rror code: RecoveryAdditional6 Response: ${e}`)
              this.loading = false
              this.badCD = true
            })
          }
          //if the numbertorecover threshold is met
          else{
            invoke('refresh_cd', {psbt: false}).then((res)=>{
              store.commit('setDebug', `refreshing recovery CD with the contents of /mnt/ramdisk/CDROM: ${res}`)
              this.loading = false
              this.$router.push({ name: 'RecoverySuccess' })
            })
            .catch((e)=>{
              store.commit('setDebug', `error refreshing recovery cd rror code: RecoveryAdditional7 Response: ${e}`)
              this.loading = false
              this.badCD = true
            })
          }
        })
      }
    },
    mounted(){
      // collecting shards from $HOME on current HW and adding them to /mnt/ramdisk/CDROM/shards
      store.commit('setLoadMessage', 'collecting privacy key shards...')
      invoke('collect_shards').then((res)=>{
        store.commit('setDebug', `collecting shards: ${res}`)
        store.commit('setLoadMessage', 'calculating differential...')
        //calculate numbertorecover differential based on how many shards are present on recoverycd
        invoke('calculate_number_of_shards').then((res)=> {
          store.commit('setDebug', `calculating number of shards in ramdisk: number = ${res}`)

          //if numbertorecover threshold is not yet met
          if(this.numberToRecover > res){
            store.commit('setLoadMessage', 'refreshing Recovery CD...')
            store.commit('setDebug', `Need more shards to complete recovery. obtained ${res} of ${this.numberToRecover}`)
            invoke('refresh_cd', {psbt: false}).then((res)=>{
              store.commit('setDebug', `refreshing recovery CD with the contents of /mnt/ramdisk/CDROM: ${res}`)
              this.loading = false
            })
            .catch((e)=>{
              store.commit('setDebug', `error refreshing recovery cd rror code: RecoveryAdditional2 Response: ${e}`)
              this.loading = false
              this.badCD = true
            })
          }
          //if the numbertorecover threshold is met
          else{
            store.commit('setDebug', `shard threshold met, obtained ${res} of ${this.numberToRecover}`)
            store.commit('setLoadMessage', 'Reconstituting Masterkey...')
            invoke('combine_shards').then((res)=>{
              store.commit('setDebug', `reconstituting masterkey ${res}`)
              store.commit('setLoadMessage', 'Converting CD Config...')
              invoke('convert_to_transfer_cd').then((res)=>{
                store.commit('setDebug', `converting CD config from recoverycd to transfercd ${res}`)
                store.commit('setLoadMessage', 'Refreshing CD...')
                invoke('refresh_cd', {psbt: false}).then((res)=>{
                  store.commit('setDebug', `refreshing CD: ${res}`)
                  this.loading = false
                  this.$router.push({ name: 'RecoverySuccess' })
                }) .catch((e)=>{
                    store.commit('setDebug', `error refreshing cd Error code: RecoveryAdditional3 Response: ${e}`)
                    this.loading = false
                    this.badCD = true
              }) .catch((e)=>{
                store.commit('setDebug', `error converting cd: ${e}`)
                store.commit('setErrorMessage', `Error converting cd Error code: RecoveryAdditional4 Response: ${e}`)
                this.$router.push({ name: 'Error' })
            }) .catch((e)=>{
                store.commit('setDebug', `error combining shards: ${e}`)
                store.commit('setErrorMessage', `Error combining shards Error code: RecoveryAdditional5 Response: ${e}`)
                this.$router.push({ name: 'Error' })
              })
              })
            })
          }
          
        })
        .catch((e) => {
          store.commit('setDebug', `error calculating shards on recovery cd: ${e}`)
          store.commit('setErrorMessage', `Error calculating shard count on disk Error code: RecoveryAdditional1 Response: ${e}`)
          this.$router.push({ name: 'Error' })
        })
      })
      .catch((e)=>{
        store.commit('setDebug', `error collecting shards ${e}`)
        store.commit('setErrorMessage', `Error collecting shards Error code: RecoveryAdditional2 Response: ${e}`)
        this.$router.push({ name: 'Error' })
      })    
      
    },
    data() {
    return {
    loading: true,
    badCD: false,
    }
  },
  }
</script>

