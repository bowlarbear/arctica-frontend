<template>
    <div v-if="this.loading ==true">
    <Loader />
    </div>
    <div v-else class="page">
    <header>
        <h1>We will now create your multisig wallets</h1>
        <h2>Please insert the CD labelled "set up"</h2>
        <h4 v-if="badCD == true">* The detected CD is not a Setup CD</h4>
        <h4 v-if="noCD == true">* Error reading CD, please remove and reinsert.</h4>
    </header> 
    <div class="form_container">
        <form>
            <div class="checkbox_container">
                <input type="checkbox" v-model="checkbox" name="checkbox">
                <label for="checkbox">I have inserted the Set up CD.</label>
            </div>
        </form>
        <div class="btn_container"> 
            <button v-if="checkbox == true" @click="acknowledge()" class="btn">Proceed</Button>
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
  name: 'Setup21',
  components: {
    Loader,
    ProgressBar
  },
    methods: {
        acknowledge(){
        this.badCD = false
        this.noCD = false
        this.loading = true
        store.commit('setLoadMessage', 'Reading Setup CD...')
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
                    store.commit('setDebug', `Set up CD detected, boolean set to true ${store.getters.getSetupCD}`)
                    this.loading = false
                    this.$router.push({ name:'Setup23' })
                    break
                }
                else{
                    store.commit('setDebug', `fall back inside for loop triggered; key: ${String(it[0]).toUpperCase()} value: ${String(it[1]).toUpperCase()}`)
                    this.badCD = true
                }
            }
        //fallback in case user did not insert correct disc
        this.loading = false
         })
        .catch((e)=> {
          store.commit('setDebug', `error reading setup CD Setup21-1: ${e}`)
          this.noCD = true
          this.loading = false
        })
        },
        warn(){
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
    computed:{
        setupCD(){
            return store.getters.getSetupCD
        },
    }
}
</script>

