<template>
  <!-- Show the compromised component if the user has a tripped tripwire -->
  <Compromised v-if="this.tripwire != 'none'" />
  <!-- Show the main dashboard -->
  <div v-else class="page">
    <Nav />
      <div class="dashboard">
        <div class="head_container">
          <h1>Wallets</h1>
        </div>

<!-- the below code adds a display for a single sig hot wallet I had created for testing but this is mostly deprecated and all assets 
can be removed-->
            <!-- <router-link class="wallet_container" :to="{ name: 'hot' }">
            <div class="wallet_container_left">
            <h2>Hot Wallet</h2>
            <h2 class="time_decay">Spend Now</h2>
            </div>
            <div class="wallet_container_right">
              <h2 class="balance_overview">{{ this.hotBalance }} BTC</h2>
              <span class="carat"><img src="@/assets/carat_right.png"/></span>
            </div>
        </router-link>  -->

        <router-link class="wallet_container" :to="{ name: 'immediate' }">
            <div class="wallet_container_left">
            <h2>Immediate Wallet</h2>
            <h3 v-if="immediateDecay == false" class="time_decay">2 HWs</h3>
            <h3 v-else-if="immediateDecay == true" class="time_decay">1 HW</h3>
            </div>
            <div class="wallet_container_right">
              <h2 class="balance_overview"> {{ this.immediateBalance }} BTC</h2>
              <span class="carat"><img src="@/assets/carat_right.png"/></span>
            </div>
        </router-link> 
        <div v-if="this.immediateDecayComplete == false" class="decay_timer">
            <h2 class="time_decay">Time until next decay: {{ this.immediateYears }} year(s), {{ this.immediateMonths }} month(s), {{ this.immediateWeeks }} week(s), {{ this.immediateDays }} day(s), {{ this.immediateHours }} hour(s), {{ this.immediateMinutes }} minute(s), {{ this.immediateSeconds }} second(s)</h2>
          </div>
          <div v-else class="decay_timer">
            <h2 class="time_decay">Decay Complete</h2>
          </div>
        <router-link class="wallet_container" :to="{ name: 'delayed' }">
          <div class="wallet_container_left">
          <h2>Delayed Wallet</h2>
          <h3 v-if="delayedDecay == 'zero'" class="time_decay">5 HWs + Time Lock</h3>
          <h3 v-else-if="delayedDecay == 'one'" class="time_decay">5 HWs</h3>
          <h3 v-else-if="delayedDecay == 'two'" class="time_decay">4 HWs</h3>
          <h3 v-else-if="delayedDecay == 'three'" class="time_decay">3 HWs</h3>
          <h3 v-else-if="delayedDecay == 'four'" class="time_decay">2 HWs</h3>
          <h3 v-else-if="delayedDecay == 'five'" class="time_decay">1 HW</h3>
          </div>
          <div class="wallet_container_right">
            <h2 class="balance_overview">{{ this.delayedBalance }} BTC</h2>
            <span class="carat"><img src="@/assets/carat_right.png"/></span>
          </div> 
        </router-link> 
          <div v-if="this.delayedDecay == 'zero'" class="decay_timer">
            <h2 class="time_decay">Time Lock Expires in: {{ this.delayedLockYears }} year(s), {{ this.delayedLockMonths }} month(s), {{ this.delayedLockWeeks }} week(s), {{ this.delayedLockDays }} day(s), {{ this.delayedLockHours }} hour(s), {{ this.delayedLockMinutes }} minute(s), {{ this.delayedLockSeconds }} second(s)</h2>
          </div>
          <div v-else class="decay_timer">
            <h2 class="time_decay">Time Lock Unlocked!</h2>
          </div>
          <div v-if="this.delayedDecayComplete == false" class="decay_timer">
            <h2 class="time_decay">Time until next decay: {{ this.delayedYears }} year(s), {{ this.delayedMonths }} month(s), {{ this.delayedWeeks }} week(s), {{ this.delayedDays }} day(s), {{ this.delayedHours }} hour(s), {{ this.delayedMinutes }} minute(s), {{ this.delayedSeconds }} second(s)</h2>
          </div>
          <div v-else class="decay_timer">
            <h2 class="time_decay">Decay Complete</h2>
          </div>
      </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import { RouterView, RouterLink } from "vue-router";
import store from '../store.js'
import Compromised from './tripwire/compromised.vue'
const invoke = window.__TAURI__.invoke

{
  RouterView;
  RouterLink
}

export default {
  name: 'Dashboard',
  components: {
    Nav,
    Compromised,
  },  
 computed:{
 tripwire(){
    return store.getters.getTripwireTripped
 },
 immediateBalance:{
            get(){
                return store.getters.getImmediateBalance
            }
        },
 delayedBalance(){
  return store.getters.getDelayedBalance
 },
 tripwireSetup(){
  return store.getters.getTripwireSetup
 },
 recoverySetup(){
  return store.getters.getRecoverySetup
 },
 duressSetup(){
  return store.getters.getDuressSetup
 },
 immediateDecay(){
  return store.getters.getImmediateDecay
 },
 delayedDecay:{
    get(){
      return store.getters.getDelayedDecay
    }
 },
 hwNumber:{
            get(){
                return store.getters.getCurrentHW
            }
        },
      },
    mounted(){
      //calculate immediate_decay
      invoke('calculate_decay_time', {file: "immediate_decay"}).then((res)=>{
        console.log("immediate decay response:", res)
        if(res.includes("decay complete")){
          store.commit('setImmediateDecay', true)
          this.immediateDecayComplete = true
        }
        else{
        store.commit('setTimeLock', true)
        const parts = res.split(",")
        this.immediateYears = parts[0].split("=")[1].trim()
        this.immediateMonths = parts[1].split("=")[1].trim()
        this.immediateWeeks = parts[2].split("=")[1].trim()
        this.immediateDays = parts[3].split("=")[1].trim()
        this.immediateHours = parts[4].split("=")[1].trim()
        this.immediateMinutes = parts[5].split("=")[1].trim()
        this.immediateSeconds = parts[6].split("=")[1].trim()
        }
      })
        //get immediate balance
        invoke('get_balance', {walletname: "immediate", hwnumber: this.hwNumber.toString()}).then((res)=>{
          store.commit('setDebug', `getting balance for immediate wallet: ${res}`)
          let bal = parseFloat(res)
          store.commit('setImmediateBalance', `${bal}`)
        }).catch((e)=>{
        store.commit('setDebug', `error getting immediate wallet balance ${e}`)
          })
      //get delayed balance
      invoke('get_balance', {walletname: "delayed", hwnumber: this.hwNumber.toString()}).then((res)=>{
          store.commit('setDebug', `getting balance for delayed wallet: ${res}`)
          let bal = parseFloat(res)
          store.commit('setDelayedBalance', `${bal}`)
        }).catch((e)=>{
        store.commit('setDebug', `error getting delayed wallet balance ${e}`)
          })
      //fetch first time initial setup vars
      //TODO eventually these need to be checked against some kind of meta data
      this.duressSetup = store.getters.getDuressSetup
      this.recoverySetup = store.getters.getRecoverySetup
      this.tripwireSetup = store.getters.getTripwireSetup
      //below are the post set up redirects for first time users that have only completed initial set up
      if(this.recoverySetup == false){
        store.commit('setDebug', 'Sending user to piiPostSetup1')
        this.$router.push({ name: 'piiPostSetup1' })
      }
      else if(this.duressSetup == false){
        store.commit('setDebug', 'Sending user to duressPostSetup1')
        this.$router.push({ name: 'duressPostSetup1' })
      }
      else if(this.tripwireSetup == false){
        store.commit('setDebug', 'Sending user to tripwirePostSetup1')
        this.$router.push({ name: 'tripwirePostSetup1' })
      }
      //DELAYED WALLET DECAY TIMERS
        //calculate delayed_decay1 (Timelock)
        invoke('calculate_decay_time', {file: "delayed_decay1"}).then((res)=>{
          store.commit('setDebug', `calculating decay time for delayed_decay1(timelock): ${res}`)
          console.log("delayed decay response:", res)
          if(res.includes("decay complete")){
            store.commit('setDebug', 'delayed_decay1 complete, time lock expired')
            store.commit('setDelayedDecay', 'one')
            store.commit('setTimeLock', false)
          }
          else{
            store.commit('setDebug', 'delayed_decay1 incomplete')
            const parts = res.split(",")
            this.delayedLockYears = parts[0].split("=")[1].trim()
            this.delayedLockMonths = parts[1].split("=")[1].trim()
            this.delayedLockWeeks = parts[2].split("=")[1].trim()
            this.delayedLockDays = parts[3].split("=")[1].trim()
            this.delayedLockHours = parts[4].split("=")[1].trim()
            this.delayedLockMinutes = parts[5].split("=")[1].trim()
            this.delayedLockSeconds = parts[6].split("=")[1].trim()
          }
          //calculate delayed_decay2 (1st threshold decay)
        invoke('calculate_decay_time', {file: "delayed_decay2"}).then((res)=>{
        store.commit('setDebug', `calculating decay time for delayed_decay2: ${res}`)
        console.log("delayed decay response:", res)
        if(res.includes("decay complete")){
          store.commit('setDebug', 'delayed_decay2 complete, delayed thresh 4')
          store.commit('setDelayedDecay', 'two')
          store.commit('setTimeLock', false)
        }
        else{
          store.commit('setDebug', 'delayed_decay2 incomplete')
          const parts = res.split(",")
          this.delayedYears = parts[0].split("=")[1].trim()
          this.delayedMonths = parts[1].split("=")[1].trim()
          this.delayedWeeks = parts[2].split("=")[1].trim()
          this.delayedDays = parts[3].split("=")[1].trim()
          this.delayedHours = parts[4].split("=")[1].trim()
          this.delayedMinutes = parts[5].split("=")[1].trim()
          this.delayedSeconds = parts[6].split("=")[1].trim()
          this.timeSet = true
        }

        //calculate delayed_decay3 (2nd threshold decay)
        if(this.timeSet == false){
          invoke('calculate_decay_time', {file: "delayed_decay3"}).then((res)=>{
          store.commit('setDebug', `calculating decay time for delayed_decay3: ${res}`)
          console.log("delayed decay response:", res)
          if(res.includes("decay complete")){
            store.commit('setDebug', 'delayed_decay3 complete, delayed thresh 3')
            store.commit('setDelayedDecay', 'three')
            store.commit('setTimeLock', false)
          }
          else{
            store.commit('setDebug', 'delayed_decay3 incomplete')
            const parts = res.split(",")
            this.delayedYears = parts[0].split("=")[1].trim()
            this.delayedMonths = parts[1].split("=")[1].trim()
            this.delayedWeeks = parts[2].split("=")[1].trim()
            this.delayedDays = parts[3].split("=")[1].trim()
            this.delayedHours = parts[4].split("=")[1].trim()
            this.delayedMinutes = parts[5].split("=")[1].trim()
            this.delayedSeconds = parts[6].split("=")[1].trim()
            this.timeSet = true
          }

          //calculate delayed decay4 (3rd threshold decay)
        if(this.timeSet == false){
          invoke('calculate_decay_time', {file: "delayed_decay4"}).then((res)=>{
          store.commit('setDebug', `calculating decay time for delayed_decay4: ${res}`)
          console.log("delayed decay response:", res)
          if(res.includes("decay complete")){
            store.commit('setDebug', 'delayed_decay4 complete, delayed thresh 2')
            store.commit('setDelayedDecay', 'four')
            store.commit('setTimeLock', false)
            this.delayedStatus = 4
          }
          else{
            store.commit('setDebug', 'delayed_decay4 incomplete')
            const parts = res.split(",")
            this.delayedYears = parts[0].split("=")[1].trim()
            this.delayedMonths = parts[1].split("=")[1].trim()
            this.delayedWeeks = parts[2].split("=")[1].trim()
            this.delayedDays = parts[3].split("=")[1].trim()
            this.delayedHours = parts[4].split("=")[1].trim()
            this.delayedMinutes = parts[5].split("=")[1].trim()
            this.delayedSeconds = parts[6].split("=")[1].trim()
            this.timeSet = true
          }

          //calculate delayed decay5 (4th & final threshold decay)
        if(this.timeSet == false){
          invoke('calculate_decay_time', {file: "delayed_decay5"}).then((res)=>{
          store.commit('setDebug', `calculating decay time for delayed_decay5: ${res}`)
          console.log("delayed decay response:", res)
          if(res.includes("decay complete")){
            store.commit('setDebug', 'delayed_decay5 complete, delayed thresh 1')
            store.commit('setDelayedDecay', 'five')
            this.delayedDecayComplete = true
            store.commit('setTimeLock', false)
          }
          else{
            store.commit('setDebug', 'delayed_decay5 incomplete')
            const parts = res.split(",")
            this.delayedYears = parts[0].split("=")[1].trim()
            this.delayedMonths = parts[1].split("=")[1].trim()
            this.delayedWeeks = parts[2].split("=")[1].trim()
            this.delayedDays = parts[3].split("=")[1].trim()
            this.delayedHours = parts[4].split("=")[1].trim()
            this.delayedMinutes = parts[5].split("=")[1].trim()
            this.delayedSeconds = parts[6].split("=")[1].trim()
          }
        })
        }
        })
        }
        })
        }
        })
        
        })

        
        
        
        
        

 },
 data(){
  return{
    immediateDecayComplete: false,
    immediateYears: 0,
    immediateMonths: 0,
    immediateWeeks: 0,
    immediateDays: 0,
    immediateHours: 0,
    immediateMinutes: 0,
    immediateSeconds: 0,
    delayedDecayComplete: false,
    delayedYears: 0,
    delayedMonths: 0,
    delayedWeeks: 0,
    delayedDays: 0,
    delayedHours: 0,
    delayedMinutes: 0,
    delayedSeconds: 0,
    delayedLockYears: 0,
    delayedLockMonths: 0,
    delayedLockWeeks: 0,
    delayedLockDays: 0,
    delayedLockHours: 0,
    delayedLockMinutes: 0,
    delayedLockSeconds: 0,
    timeSet: false,
  }
 }
    }
</script>

<style scoped>
h2{
  color:#000000;
}
.time_decay{
  color:#777777;
}
</style>