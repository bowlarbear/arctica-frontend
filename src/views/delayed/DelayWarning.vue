<template>
    <!-- timelock condition is true, expected behavior -->
    <div v-if="timelock == true" class="page">
        <header>
            <h1>Warning! Your Delayed Wallet is currently timelocked.</h1>
            <h2>Your Delayed Wallet is timelocked for...</h2>
            <div class="time_window">
                <h3>{{ this.delayedYears }} year(s),</h3> 
                <h3>{{ this.delayedMonths }} month(s), </h3>
                <h3>{{ this.delayedDays }} day(s), </h3>
                <h3>{{ this.delayedHours }} hour(s), </h3>
                <h3>{{ this.delayedMinutes }} minute(s),</h3>
                <h3>{{ this.delayedSeconds }} second(s) </h3>
            </div>
            <h2>Beta Users: Accessing these funds early is only possible with your setup CD and advanced understanding of the Bitcoin command line interface.</h2> 
            <h2>For more information, read the <a class="blue_link" href="#">Time Machine Protocol</a>.</h2>
        </header>        
        <div class="form_container">
            <form>
                <div class="lg_checkbox_container">
                    <input type="checkbox" v-model="checkbox" name="checkbox">
                    <label for="checkbox">I have read and understand the <a class="blue_link" href="#">Time Machine Protocol</a>.</label>
                </div>
            </form>
            <div class="btn_container"> 
                <button v-if="checkbox" @click="$emit('ackWarning')" class="btn">Proceed</Button>
                <button v-else @click="warn()" class="btn3">Proceed</Button>
            </div>
        </div> 
    </div>
    <!-- timelock condition is false, can only happen if the delayed wallet unlocks while user is within the wallet UI -->
    <div v-else class="page">
        <header>
            <h1>Your Delayed Wallet has unlocked!.</h1>
        </header>        
        <div class="form_container">
            <div class="btn_container"> 
                <button @click="$emit('ackWarning')" class="btn">Proceed</Button>
            </div>
        </div> 
    </div>
</template>

<script>
import store from '../../store.js'
const invoke = window.__TAURI__.invoke


export default {
    name: 'DelayWarning',
    props: [],
    data(){
        return{
            checkbox: false,
            delayedYears: 0,
            delayedMonths: 0,
            delayedWeeks: 0,
            delayedDays: 0,
            delayedHours: 0,
            delayedMinutes: 0,
            delayedSeconds: 0      
        }
    },
    methods:{
        warn(){
        },
    },
    computed:{
        timelock:{
            get(){
                return store.getters.getTimeLock
            },
            set(newVal){
                store.commit('setTimeLock', newVal)
            }
        },
    },
    mounted(){
        //calculate delayed_decay1
        invoke('calculate_decay_time', {file: "delayed_decay1"}).then((res)=>{
          console.log("delayed decay response:", res)
          if(res.includes("decay complete")){
            store.commit('setTimeLock', false)
          }
          else{
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
    },
}
</script>

<style scoped>

h3{
    font-weight: 800;
}

.time_window{
    text-align: center;
    flex-direction: column;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    line-height: 1.2;
}
</style>