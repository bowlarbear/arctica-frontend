<template>
    <div v-if="this.loading ==true">
    <Loader />
    </div>
    <div v-else class="page">
        <header>
        <h1>DVD/M-DISC 1 Backup</h1>
        <h2>Please remove CD 1 and insert DVD/M-DISC 1.</h2>
        <h4 v-if="badCD == true">* Setup CD detected! Please remove.</h4>
        <h4 v-if="noCD == true">* Error reading CD, please remove and reinsert.</h4>
    </header> 
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted DVD/M-DISC 1.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox" @click="acknowledge()" class="btn">Proceed</Button>
            <button v-else @click="warn()" class="btn3">Proceed</Button>
            <button @click="skip()" class="btn2">Skip (Beta Testers)</button>
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
  name: 'Setup24',
  components: {
    Loader,
    ProgressBar
  },
    methods: {
        acknowledge(){
            this.badCD = false
            this.setupCD = false
            this.loading = true
            store.commit('setLoadMessage', 'Reading DVD...')
            //read the CD to verify the user has not inserted the DVD
            invoke('read_cd').then((res) => {
                store.commit('setDebug', `invoking read_cd: ${res}`)
                let resArray = res.split("\n")
                store.commit('setDebug', `response Array: ${resArray}`)
                for(let i = 0; i < resArray.length; i ++){
                    let it = resArray[i].split("=")
                    store.commit('setDebug', `for loop number: ${i+1}; key: ${String(it[0]).toUpperCase()} value: ${it[1]}`)
                    //check for setup CD
                    if (String(it[0]).toUpperCase() == 'TYPE' && String(it[1]).toUpperCase() == 'SETUPCD'){
                        store.commit('setSetupCD', true)
                        store.commit('setDebug', `Error reading CD: Set up CD detected, Setup24-3 ${store.getters.getSetupCD}`)
                        this.loading = false
                        this.badCD = true
                    }
                    else{
                        store.commit('setDebug', `fall back inside for loop triggered; key: ${String(it[0]).toUpperCase()} value: ${String(it[1]).toUpperCase()}`)
                        store.commit('setLoadMessage', 'Creating Backup...')
                        //make and burn backup ISO
                        invoke('make_backup', {number: "1"}).then((res) => {
                            this.loading = false
                            store.commit('setDebug', `making and burning backup iso ${res}`)
                            this.$router.push({ name: 'Setup25' })
                        }).catch((e) => {
                            store.commit('setDebug', `error making and burning backup iso: ${e}`)
                            store.commit('setErrorMessage', `Error making backup Error code: Setup24-1 Response: ${e}`)
                            this.$router.push({ name:'Error' })
                        })
                    }
                }
            }).catch((e) => {
                            store.commit('setDebug', `error reading CD setup24-2: ${e}`)
                            this.loading = false
                            this.noCD = true
                        })
        },
        warn(){
        },
        skip(){
            this.$router.push({ name: 'Setup25' })
        },
    },
    data(){
        return{
            checkbox: false,
            loading: false,
            badCD: false,
            noCD: false,
        }
    },
}
</script>

